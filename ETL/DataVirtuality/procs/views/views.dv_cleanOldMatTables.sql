-- Name: views.dv_cleanOldMatTables
-- Created: 2015-04-24 18:17:53

create virtual procedure views.dv_cleanOldMatTables() as
/*Run this to delete all old mat_tables*/
BEGIN
	LOOP ON (
		SELECT 
			'DROP TABLE dwh.' || a.TableName as full_path
		FROM (
			SELECT 
				"t.Name" as "TableName", 
				"mt.accessState", 
				SUBSTRING("t.Name",0,LOCATE('_st',"t.Name")-1) as "TablePrefix", 
				CAST(SUBSTRING("t.Name",11,LOCATE('_st',"t.Name")-11) as integer) as "TableNumberInfix",
				CAST(SUBSTRING("t.Name",LOCATE('_st',"t.Name")+3) as integer) as "MatTableStage", 
				RANK() OVER (PARTITION BY SUBSTRING("t.Name",0,LOCATE('_st',"t.Name")-1) ORDER BY CAST(SUBSTRING("t.Name",LOCATE('_st',"t.Name")+3) as integer) DESC) as "StagePriority"
			FROM "SYS.Tables" t 
			INNER JOIN "SYSADMIN.MaterializedTable" mt ON ("mt.name" = "t.name")
			WHERE "t.SchemaName" = 'dwh' 
			AND "mt.accessState" = 'READY'
			ORDER BY CAST(SUBSTRING("t.Name",11,LOCATE('_st',"t.Name")-11) as integer)
		) as a
		WHERE "a.StagePriority" > 1
	) as dwh_tables

	BEGIN
		EXECUTE IMMEDIATE dwh_tables.full_path;
	END
END


