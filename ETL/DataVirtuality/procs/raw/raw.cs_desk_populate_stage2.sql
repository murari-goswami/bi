-- Name: raw.cs_desk_populate_stage2
-- Created: 2015-09-07 13:42:28

CREATE virtual procedure raw.cs_desk_populate_stage2 (
    IN stg2_table string
) as
/*********************************************************************************
  Author  :	Murari Goswami                                   
  Date    : 07/09/2015                                        
  Purpose :	Created this procedure to extract all the 
   			reporting details into a delta table and store them in a incremental
   			order into the reporting table.
**********************************************************************************/
begin
    /* Calling the internal DV server validarion process to check and return error in case of failure
       The process will break in case of the validation fails*/
    call "desk_com_connector.internal_validateServerVersion" (
    ) ;
    /* Calling the internal DV server validarion process to check and return error in case of failure*/
    DECLARE string VARIABLES.dwh_schema = (
        select
                nameindv
            from
                (
                    exec getCurrentDWH ()) a
    ) ;    
    DECLARE string VARIABLES.vdb_name = 'datavirtuality' ;
    /* Declaring the Delta table Name which will hold 1 day worth of desk data*/
    DECLARE string VARIABLES.deltatable = LCASE (
        replace (
            stg2_table
            ,'"'
            ,''
        ) || '_delta'
    ) ; 
    /*Declaring the job locking table Name that will control the overlapping execution hecne
      all overlapping execution can be restricted. */
    DECLARE string VARIABLES.locktable = LCASE (
        replace (
            stg2_table
            ,'"'
            ,''
        ) || '_joblock'
    ) ;  
    DECLARE date VARIABLES.start_date = (
        select
                TIMESTAMPADD (
                    SQL_TSI_DAY
                    ,1
                    ,max (extraction_start_date)
                )
            from
                "dwh.desk_case_audit_ctrl"
    ) ; /* Capture the start date of data extraction from the control table. The control table will
    	   in charge of the daily execution. In case of repeat execution it will increment the completion date 
    	   flag and make it ready for next execution.*/
    
    DECLARE date VARIABLES.ctrl_date = (
        select
                max (extraction_start_date)
            from
                "dwh.desk_case_audit_ctrl"
    ) ;  
    
    /* Set of differne variable declaration to capture different data points within the procedure*/
    DECLARE date VARIABLES.max_delta_date = null ;
    DECLARE date VARIABLES.max_changed_at = null ;
    DECLARE long VARIABLES.Finance = 0;
    DECLARE long VARIABLES.Datenschutz = 0;
    DECLARE long VARIABLES.Lieferung_Ruckversand = 0;
    DECLARE long VARIABLES.Reklamation = 0;
    DECLARE long VARIABLES.Service = 0;
    DECLARE long VARIABLES.Storno_Adresanderung = 0;
    DECLARE long VARIABLES.Emarsys = 0;
    DECLARE long VARIABLES.new_cases = 0 ;
    DECLARE long VARIABLES.closed_cases = 0 ;
    DECLARE long VARIABLES.reopened_case = 0 ;
    DECLARE double VARIABLES.quote_reopened_closed_case = 0 ;
    DECLARE long VARIABLES.t1_response = 0 ;
    DECLARE string VARIABLES.t1_response_format = null ;
    DECLARE long VARIABLES.t1_resolved = 0 ;
    DECLARE string VARIABLES.t1_resolved_format = null ;
    DECLARE long VARIABLES.var_exec_number = (
        select
                max (exec_number)+1
            from
                "dwh.desk_case_audit_ctrl"
    ) ;
/**************************************************************************************************************/
/* Main programme starts here...*/
    IF (
        VARIABLES.dwh_schema IS NULL
    )
    BEGIN
        ERROR 'DWH schema name cannot be NULL' ;
    END
    IF (
        EXISTS (
            select
                    *
                from
                    SYS.Tables t
                where
                    LCASE (t.VDBName) = LCASE (VARIABLES.vdb_name)
                    and LCASE (t.schemaName) = LCASE (VARIABLES.dwh_schema)
                    and LCASE (
                        (
                            t.schemaName || '.' || t.name
                        )
                    ) = LCASE (VARIABLES.locktable)
        )
    )
    BEGIN
        ERROR 'Another "cs_desk_populate_stage2" stage 2 table update is already running on the provided stage 2 table. Please, wait until the concurrent update is completed. If the server has been suddenly shut down when a batch udpate was running or an unexpected error occurred during a previous batch execution, it is possible that the lock table has not been correctly dropped. Only in this case, please manually delete the lock table from the DV Server running the command DROP TABLE ' || VARIABLES.locktable ;
    END
    EXECUTE IMMEDIATE 'CREATE TABLE ' || VARIABLES.locktable || '(text string)' WITHOUT RETURN ;
   
    /* Check to make sure that data extraction are up to date and in case of no further data to extract then raise the error*/
    VARIABLES.max_changed_at = (
        SELECT
                max (
                    cast (
                        changed_at as date
                    )
                )
            from
                "dwh.desk_raw_cases"
    ) ;
    IF (
        VARIABLES.max_changed_at <= VARIABLES.ctrl_date
    )
    BEGIN
        ERROR 'There are no data loaded after the last extraction done do far ' || '. The last extraction was done for ' ||  
        ctrl_date ;
    END
 /* Preliminary Checks done and ready to proceed to the next step of data population and stage 2 data dump*/
 /* Create delta table for the last 1 day change. This data will be extracted from desk raw cases table*/  
 /* Cleansing of delta table for before processing.*/
 
    delete from  dwh.desk_case_report_delta ;   
 
   /*Populate Delta table with the recent 1 day data from the raw information. Data population Criteria : Changed_At  =  Audit    
    control date && Update_At = Audit Control date (? id not already pulled  with Changed_At criteria)*/
    insert into dwh.desk_case_report_delta
    (select * from dwh.desk_raw_cases
	 where cast (changed_at as date) = 
    (select cast (TIMESTAMPADD (SQL_TSI_DAY,1,max (extraction_start_date)) as date)
    from dwh.desk_case_audit_ctrl)) ;
    insert into dwh.desk_case_report_delta
    (select * from  dwh.desk_raw_cases
    where (cast (updated_at as date) = 
    (select cast (TIMESTAMPADD (SQL_TSI_DAY,1,max (extraction_start_date)) as date)
     from  dwh.desk_case_audit_ctrl)
     and id not in (select id from dwh.desk_case_report_delta))) ;
     
    /*Clearing any existing data in the report table for running date.  A step for re run ablity.*/
    execute immediate 'delete from ' || stg2_table || ' where cast (ndate as date)    
    = (select TIMESTAMPADD(SQL_TSI_DAY,1,max(extraction_start_date)) from dwh.desk_case_audit_ctrl)' ;

    /*Insert the date for current processing day into the report table*/
    insert into dwh.desk_case_report (nDate,week_no) values (VARIABLES.start_date,week(VARIABLES.start_date)) ;

    /* Data point calculation for Labels like Finance*/
    VARIABLES.Finance = (select count(distinct id) from dwh.desk_raw_cases
										where cast(created_at as date) = 
										(select  cast (TIMESTAMPADD (SQL_TSI_DAY,1,max (extraction_start_date)) as date)
	                       				 from  dwh.desk_case_audit_ctrl)
											and labels like '%Finance%');
	/*Data point calculation for Labels like Datenschutz*/										
    VARIABLES.Datenschutz = (select count(distinct id) from dwh.desk_raw_cases
										where cast(created_at as date) = 
										(select  cast (TIMESTAMPADD (SQL_TSI_DAY,1,max (extraction_start_date)) as date)
	                       				 from  dwh.desk_case_audit_ctrl)
											and labels like '%Datenschutz%');
	/*Data point calculation for Labels like Lieferung und Rückversand*/
    VARIABLES.Lieferung_Ruckversand = (select count(distinct id) from dwh.desk_raw_cases
										where cast(created_at as date) = 
										(select  cast (TIMESTAMPADD (SQL_TSI_DAY,1,max (extraction_start_date)) as date)
	                       				 from  dwh.desk_case_audit_ctrl)
											and labels like '%Lieferung und Rückversand%');
	/*Data point calculation for Labels like Reklamation*/										
    VARIABLES.Reklamation = (select count(distinct id) from dwh.desk_raw_cases
										where cast(created_at as date) = 
										(select  cast (TIMESTAMPADD (SQL_TSI_DAY,1,max (extraction_start_date)) as date)
	                       				 from  dwh.desk_case_audit_ctrl)
											and labels like '%Reklamation%');
    /*Data point calculation for Labels like Service*/
    VARIABLES.Service = (select count(distinct id) from dwh.desk_raw_cases
										where cast(created_at as date) = 
										(select  cast (TIMESTAMPADD (SQL_TSI_DAY,1,max (extraction_start_date)) as date)
	                       				 from  dwh.desk_case_audit_ctrl)
											and labels like '%Service%');
    /*Data point calculation for Labels like Storno - Adresänderung Cases*/
    VARIABLES.Storno_Adresanderung = (select count(distinct id) from dwh.desk_raw_cases
										where cast(created_at as date) = 
										(select  cast (TIMESTAMPADD (SQL_TSI_DAY,1,max (extraction_start_date)) as date)
	                       				 from  dwh.desk_case_audit_ctrl)
											and labels like '%Storno - Adresänderung Cases%');
    /*Data point calculation for Labels like Emarsys*/
    VARIABLES.Emarsys = (select count(distinct id) from dwh.desk_raw_cases
										where cast(created_at as date) = 
										(select  cast (TIMESTAMPADD (SQL_TSI_DAY,1,max (extraction_start_date)) as date)
	                       				 from  dwh.desk_case_audit_ctrl)
											and labels like '%Emarsys%');
	/*Update all respective field values in Stage 2 DESK_CASE_REPORT table*/									
    update dwh.desk_case_report
    set Finance = VARIABLES.Finance, Datenschutz = VARIABLES.Datenschutz, Lieferung_Ruckversand = VARIABLES.Lieferung_Ruckversand,
    				Reklamation=VARIABLES.Reklamation, Service=VARIABLES.Service,
    				Storno_Adresanderung= VARIABLES.Storno_Adresanderung, Emarsys=VARIABLES.Emarsys
    where ndate = (select cast ( TIMESTAMPADD (SQL_TSI_DAY,1,max (extraction_start_date))as date)
                    from  dwh.desk_case_audit_ctrl);
	
	/*Calculate and Update Values  for New Case as the ? (Finance, Datenschutz, Lieferung_Ruckversand, Reklamation, Service,   
	 Storno_Adresanderung, Emarsys)*/
	VARIABLES.new_cases = (VARIABLES.Finance+VARIABLES.Datenschutz+VARIABLES.Lieferung_Ruckversand+
							VARIABLES.Reklamation+VARIABLES.Service+VARIABLES.Storno_Adresanderung+VARIABLES.Emarsys);
    update dwh.desk_case_report
    set new_cases = VARIABLES.new_cases
    where ndate = (select cast ( TIMESTAMPADD (SQL_TSI_DAY,1,max (extraction_start_date))as date)
                    from  dwh.desk_case_audit_ctrl);
   
    /*Calculate and Update Values  for Reopened Case as opened_date = control date*/
    VARIABLES.reopened_case = (SELECT count (distinct id) FROM dwh.desk_raw_cases
					            where cast (opened_at as date) = 
					            (select cast (TIMESTAMPADD (SQL_TSI_DAY,1,max (extraction_start_date)) as date)
		                        from dwh.desk_case_audit_ctrl));
    update dwh.desk_case_report
    set reopened_case = VARIABLES.reopened_case
    where ndate = (select cast (TIMESTAMPADD (SQL_TSI_DAY,1,max (extraction_start_date)) as date)
                    from dwh.desk_case_audit_ctrl);
            
    /*Calculate and Update Values  for closed Case as status = closed &  (Changed At || Updated At ) = Control Date*/
    VARIABLES.closed_cases = (SELECT count (distinct id) FROM dwh.desk_raw_cases
				            	where (nvl(status, 'zzz') = 'closed' 
				            		and 
				            		(cast (changed_at as date) = 
				            							(select cast (TIMESTAMPADD (SQL_TSI_DAY,1,max 																			(extraction_start_date)) as date)
                        		 						from dwh.desk_case_audit_ctrl)
				            			or 
				            	 		cast (updated_at as date) = 
				            							(select cast (TIMESTAMPADD (SQL_TSI_DAY,1,max 																			(extraction_start_date)) as date)
                        								 from dwh.desk_case_audit_ctrl)
				            	)));
	
    update dwh.desk_case_report
    set closed_case = VARIABLES.closed_cases
    where ndate = (select cast (TIMESTAMPADD (SQL_TSI_DAY,1,max (extraction_start_date)) as date)
                    from dwh.desk_case_audit_ctrl);
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      
    /*Calculate and Update Values  for “Time to 1st Response”   Average (Created At – First Opened At)*/
    VARIABLES.t1_response = (SELECT cast(AVG(cast(COALESCE(TIMESTAMPDIFF(SQL_TSI_SECOND,created_at,first_opened_at),0) as long)) 											as long)  
  	                       FROM dwh.desk_raw_cases
  	                       where cast(first_opened_at as date) =
	                        (select cast (TIMESTAMPADD (SQL_TSI_DAY,1,max (extraction_start_date)) as date)
		                        from dwh.desk_case_audit_ctrl));  
    
    /*Call custom function (sec_2_hrmisec) to convert the time difference from long to hhmiss format*/                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        	VARIABLES.t1_response_format = (call raw.sec_2_hrmisec(VARIABLES.t1_response));  
    update dwh.desk_case_report
  	set t1_response = VARIABLES.t1_response_format
	where ndate = (select cast (TIMESTAMPADD (SQL_TSI_DAY,1,max (extraction_start_date)) as date)
                 from dwh.desk_case_audit_ctrl);  
  
  /*Calculate and Update Values  for “Time to 1st Resolution”   Average (Created At – First Resolved At)*/
  VARIABLES.t1_resolved = (SELECT cast(AVG(cast(COALESCE(TIMESTAMPDIFF(SQL_TSI_SECOND,created_at,first_resolved_at),0) as long)) 								as long)  
  	                       FROM dwh.desk_raw_cases
  	                       where cast(first_resolved_at as date) =
	                        (select cast (TIMESTAMPADD (SQL_TSI_DAY,1,max (extraction_start_date)) as date)
		                        from dwh.desk_case_audit_ctrl));  
		                        
  /*Call custom function (sec_2_hrmisec) to convert the time difference from long to hhmiss format*/
  VARIABLES.t1_resolved_format = (call raw.sec_2_hrmisec(VARIABLES.t1_resolved)); /* This is going to be an insertion*/
  update dwh.desk_case_report
  set t1_resolve = VARIABLES.t1_resolved_format
  where ndate = (select cast (TIMESTAMPADD (SQL_TSI_DAY,1,max (extraction_start_date)) as date)
                 from dwh.desk_case_audit_ctrl);
                 
  /*Update control table with  completion information on the day’s execution is over and make it ready for next execution*/
  insert into dwh.desk_case_audit_ctrl (extraction_start_date, extraction_end_date,processed_date,exec_number)
  values(VARIABLES.start_date,VARIABLES.start_date,curdate(),VARIABLES.var_exec_number);
  
  /*Drop Job_Lock Table to enable the process for next execution*/
  EXECUTE IMMEDIATE 'DROP TABLE ' || VARIABLES.locktable WITHOUT RETURN ;
end


