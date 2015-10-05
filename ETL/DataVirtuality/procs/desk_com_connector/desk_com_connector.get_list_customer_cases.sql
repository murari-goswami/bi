-- Name: desk_com_connector.get_list_customer_cases
-- Created: 2015-08-10 15:23:24

CREATE virtual procedure desk_com_connector.get_list_customer_cases ( in in_customer_id string, IN in_since_id integer ) RETURNS ( "id" string, "external_id" string, "blurb" string, "priority" string, "locked_until" string, "active_at" timestamp, "label_ids" string, "changed_at" timestamp, "created_at" timestamp, "updated_at" timestamp, "first_opened_at" timestamp, "opened_at" timestamp, "first_resolved_at" timestamp, "resolved_at" timestamp, "status" string, "active_notes_count" string, "active_attachments_count" string, "has_pending_interactions" string, "has_failed_interactions" string, "description" string, "language" string, "received_at" timestamp, "type" string, "labels" string, "subject" string, "custom_fields" string, "total_entries" string, "page" string ) as
begin
    call "desk_com_connector.internal_validateServerVersion" ( ) ;
    if ( ( in_customer_id is null )
    or ( in_customer_id = '' ) ) error '
    
    Please, set all parameters in procedure to NOT NULL.' ;
    declare integer PagesCountLimit = 501 ;
    declare integer PageNum = 1 ;
    declare long records_processed = 0 ;
    declare integer records_processed2 = 0 ;
    declare integer totalrecords ;
    declare integer totalrecords2 ;
    declare double pagescount ;
    declare double mod_val ;
    declare integer i = 1 ;
    declare integer querrycount ;
    declare integer CurrentPage = 1 ;
    declare integer PageSize = 100 ;
    declare boolean page_limit_exceeded = false ;
    declare string endpointstring = 'customers/' || in_customer_id || '/cases?page=' || CurrentPage || '&per_page=' || PageSize || '&sort_field=created_at&sort_direction=asc' ;
    declare string internal_since_id = 0 ;
    declare string internal_since___id = 0 ;
    DECLARE integer tmpMaxID = null ;
    CREATE LOCAL TEMPORARY TABLE TabTmpMax ( c integer ) ;
    CREATE LOCAL TEMPORARY TABLE tbltmp ( "id" string, "external_id" string, "blurb" string, "priority" string, "locked_until" string, "active_at" timestamp, "label_ids" string, "changed_at" timestamp, "created_at" timestamp, "updated_at" timestamp, "first_opened_at" timestamp, "opened_at" timestamp, "first_resolved_at" timestamp, "resolved_at" timestamp, "status" string, "active_notes_count" string, "active_attachments_count" string, "has_pending_interactions" string, "has_failed_interactions" string, "description" string, "language" string, "received_at" timestamp, "type" string, "labels" string, "subject" string, "custom_fields" string, "total_entries" string, "page" string ) ;
    totalrecords = SELECT
            "xml_table.total_entries"
        FROM
            ( exec "desk_com_ws".invokeHTTP ( action => 'GET', requestContentType => 'application/json', endpoint => 'customers/' || in_customer_id || '/cases?sort_field=created_at&sort_direction=asc&since_id=' || internal_since___id ) ) w
            , XMLTABLE ( XMLNAMESPACES ( 'http://www.w3.org/2001/XMLSchema-instance' as "xsi" ), '//root' PASSING JSONTOXML ( 'root', to_chars ( w.result, 'UTF-8' ) ) COLUMNS "total_entries" INTEGER PATH 'total_entries' ) "xml_table" ;
    IF ( in_since_id IS NOT NULL )
    BEGIN
        internal_since_id = '&since_id=' || in_since_id ;
        endpointstring = 'customers/' || in_customer_id || '/cases?page=' || CurrentPage || '&per_page=' || PageSize || '&sort_field=created_at&sort_direction=asc' || NVL ( internal_since_id, '' ) ;
    END
    else internal_since_id = '&since_id=' || 0 ;
    if ( totalrecords > 0 )
    begin
        pagescount = cast ( totalrecords as double ) / PageSize ;
        mod_val = pagescount - floor ( pagescount ) ;
        querrycount = round ( cast ( pagescount as integer ), 0 ) + 1 ;
        exec "SYSADMIN.logMsg" ( "level" => 'INFO', "context" => 'org.teiid.PROCESSOR', "msg" => '[desk_com_connector.get_list_customer_cases] Max Pages to get: ' || querrycount ) ;
        while ( i <= querrycount )
        begin
            if ( ( in_since_id is not null )
            and ( i = 1 ) )
            begin
                totalrecords2 = totalrecords ;
                records_processed2 = i * PageSize ;
            end
            else if ( ( in_since_id is not null )
            and ( i > 1 ) )
            begin
                records_processed2 = i * PageSize ;
            end
            IF ( ( NOT page_limit_exceeded )
            and ( ( in_since_id IS NULL )
            or ( in_since_id = 0 ) ) )
            BEGIN
                if ( ( totalrecords - cast ( cast ( records_processed as string ) as integer ) ) < PageSize )
                begin
                    PageSize = ( totalrecords - cast ( cast ( records_processed as string ) as integer ) ) ;
                end
                endpointstring = 'customers/' || in_customer_id || '/cases?page=' || PageNum || '&per_page=' || PageSize || '&sort_field=created_at&sort_direction=asc' || NVL ( internal_since_id, '' ) ;
                PageNum = PageNum + 1 ;
            END
            else
            begin
                if ( tmpMaxID is null )
                begin
                    endpointstring = 'customers/' || in_customer_id || '/cases?page=' || PageNum || '&per_page=' || PageSize || '&sort_field=created_at&sort_direction=asc' || NVL ( internal_since_id, '' ) ;
                end
                else
                begin
                    endpointstring = 'customers/' || in_customer_id || '/cases?page=' || PageNum || '&per_page=' || PageSize || '&sort_field=created_at&sort_direction=asc&since_id=' || tmpMaxID ;
                end
                PageNum = PageNum + 1 ;
            end
            exec "SYSADMIN.logMsg" ( "level" => 'INFO', "context" => 'org.teiid.PROCESSOR', "msg" => '[desk_com_connector.get_list_customer_cases] Executing "' || endpointstring || '"' ) ;
            INSERT
                INTO tbltmp SELECT
                        "xml_table.id"
                        , "xml_table.external_id"
                        , substring ( "xml_table.blurb", 1, 4000 ) as blurb
                        , "xml_table.priority"
                        , "xml_table.locked_until"
                        , PARSETIMESTAMP ( NULLIF ( "xml_table.active_at", '' ), 'yyyy-MM-dd''T''hh:mm:ssX' ) as "active_at"
                        , "xml_table.label_ids"
                        , PARSETIMESTAMP ( NULLIF ( "xml_table.changed_at", '' ), 'yyyy-MM-dd''T''hh:mm:ssX' ) as "changed_at"
                        , PARSETIMESTAMP ( NULLIF ( "xml_table.created_at", '' ), 'yyyy-MM-dd''T''hh:mm:ssX' ) as "created_at"
                        , PARSETIMESTAMP ( NULLIF ( "xml_table.updated_at", '' ), 'yyyy-MM-dd''T''hh:mm:ssX' ) as "updated_at"
                        , PARSETIMESTAMP ( NULLIF ( "xml_table.first_opened_at", '' ), 'yyyy-MM-dd''T''hh:mm:ssX' ) as "first_opened_at"
                        , PARSETIMESTAMP ( NULLIF ( "xml_table.opened_at", '' ), 'yyyy-MM-dd''T''hh:mm:ssX' ) as "opened_at"
                        , PARSETIMESTAMP ( NULLIF ( "xml_table.first_resolved_at", '' ), 'yyyy-MM-dd''T''hh:mm:ssX' ) as "first_resolved_at"
                        , PARSETIMESTAMP ( NULLIF ( "xml_table.resolved_at", '' ), 'yyyy-MM-dd''T''hh:mm:ssX' ) as "resolved_at"
                        , "xml_table.status"
                        , "xml_table.active_notes_count"
                        , "xml_table.active_attachments_count"
                        , "xml_table.has_pending_interactions"
                        , "xml_table.has_failed_interactions"
                        , "xml_table.description"
                        , "xml_table.language"
                        , PARSETIMESTAMP ( NULLIF ( "xml_table.received_at", '' ), 'yyyy-MM-dd''T''hh:mm:ssX' ) as "received_at"
                        , "xml_table.type"
                        , "xml_table.labels"
                        , substring ( "xml_table.subject", 1, 4000 ) as subject
                        , "xml_table.custom_fields"
                        , "xml_table.total_entries"
                        , "xml_table.page"
                    FROM
                        ( exec "desk_com_ws".invokeHTTP ( action => 'GET', requestContentType => 'application/json', endpoint => endpointstring ) ) w
                        , XMLTABLE ( XMLNAMESPACES ( 'http://www.w3.org/2001/XMLSchema-instance' as "xsi" ), '//entries' PASSING JSONTOXML ( 'root', to_chars ( w.result, 'UTF-8' ) ) COLUMNS "id" INTEGER PATH 'id', "external_id" STRING PATH 'external_id', "blurb" STRING PATH 'blurb', "priority" STRING PATH 'priority', "locked_until" STRING PATH 'locked_until', "active_at" STRING PATH 'active_at', "label_ids" STRING PATH 'string-join(label_ids/text(),'', '')', "changed_at" STRING PATH 'changed_at', "created_at" STRING PATH 'created_at', "updated_at" STRING PATH 'updated_at', "first_opened_at" STRING PATH 'first_opened_at', "opened_at" STRING PATH 'opened_at', "first_resolved_at" STRING PATH 'first_resolved_at', "resolved_at" STRING PATH 'resolved_at', "status" STRING PATH 'status', "active_notes_count" STRING PATH 'active_notes_count', "active_attachments_count" STRING PATH 'active_attachments_count', "has_pending_interactions" STRING PATH 'has_pending_interactions', "has_failed_interactions" STRING PATH 'has_failed_interactions', "description" STRING PATH 'description', "language" STRING PATH 'language', "received_at" STRING PATH 'received_at', "type" STRING PATH 'type', "labels" STRING PATH 'string-join(labels/text(),'', '')', "subject" STRING PATH 'subject', "custom_fields" STRING PATH 'custom_fields', "total_entries" STRING PATH '../../total_entries', "page" STRING PATH '../../page' ) "xml_table" ;
            if ( PageNum = PagesCountLimit )
            BEGIN
                page_limit_exceeded = true ;
                PageNum = 1 ;
                DELETE
                    FROM
                        TabTmpMax ;
                EXECUTE IMMEDIATE 'INSERT INTO TabTmpMax SELECT max ( id ) FROM tbltmp' WITHOUT RETURN ;
                tmpMaxID = select
                        c
                    from
                        TabTmpMax ;
            end
            IF ( in_since_id IS NOT NULL )
            BEGIN
                if ( ( totalrecords2 - records_processed2 ) < PageSize ) PageSize = totalrecords2 - records_processed2 ;
                exec "SYSADMIN.logMsg" ( "level" => 'INFO', "context" => 'org.teiid.PROCESSOR', "msg" => '[desk_com_connector.get_list_customer_cases] Totalrecords from get_list_customer_cases are ' || totalrecords || '.
        Processed records are ' || records_processed2 ) ;
            end
            else
            BEGIN
                if ( totalrecords - cast ( cast ( records_processed as string ) as integer ) < PageSize ) PageSize = totalrecords - cast ( cast ( records_processed as string ) as integer ) ;
                records_processed = select
                        count ( * )
                    from
                        tbltmp ;
                exec "SYSADMIN.logMsg" ( "level" => 'INFO', "context" => 'org.teiid.PROCESSOR', "msg" => '[desk_com_connector.get_list_customer_cases] Totalrecords are ' || totalrecords || '.
        Processed records are ' || records_processed ) ;
            end
            i = i + 1 ;
        end
        select
                *
            from
                tbltmp ;
    end
end


