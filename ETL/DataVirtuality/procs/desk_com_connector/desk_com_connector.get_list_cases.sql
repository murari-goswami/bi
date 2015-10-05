-- Name: desk_com_connector.get_list_cases
-- Created: 2015-08-10 15:23:18

CREATE virtual procedure desk_com_connector.get_list_cases ( IN in_since_id integer, IN dwh_table string ) RETURNS ( recordsprocessed string ) as
begin
    call "desk_com_connector.internal_validateServerVersion" ( ) ;
    declare long unixtimestamp = 0 ;
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
    declare string endpointstring = 'cases?page=' || CurrentPage || '&per_page=' || PageSize || '&sort_field=created_at&sort_direction=asc' ;
    declare string internal_since_id = 0 ;
    declare string internal_since___id = 0 ;
    DECLARE string VARIABLES.dwh_schema = ( select
            nameindv
        from
            ( exec getCurrentDWH ( ) ) a ) ;
    DECLARE string VARIABLES.vdb_name = 'datavirtuality' ;
    DECLARE string VARIABLES.deltatable = LCASE ( replace ( dwh_table, '"', '' ) || 'delta' ) ;
    DECLARE string VARIABLES.locktable = LCASE ( replace ( dwh_table, '"', '' ) || 'lock' ) ;
    DECLARE integer tmpMaxID = null ;
    CREATE LOCAL TEMPORARY TABLE TabTmpMax ( c integer ) ;
    CREATE LOCAL TEMPORARY TABLE TabTmpCount ( c long ) ;
    IF ( VARIABLES.dwh_schema IS NULL )
    BEGIN
        ERROR 'DWH schema name cannot be NULL' ;
    END
    IF ( EXISTS ( select
            *
        from
            SYS.Tables t
        where
            LCASE ( t.VDBName ) = LCASE ( VARIABLES.vdb_name )
            and LCASE ( t.schemaName ) = LCASE ( VARIABLES.dwh_schema )
            and LCASE ( ( t.schemaName || '.' || t.name ) ) = LCASE ( VARIABLES.locktable ) ) )
    BEGIN
        ERROR 'Another "get_list_cases" incremental update is already running on the provided DWH table. Please, wait until the concurrent update is completed. If the server has been suddenly shut down when a batch udpate was running or an unexpected error occurred during a previous batch execution, it is possible that the lock table has not been correctly dropped. Only in this case, please manually delete the lock table from the DV Server running the command DROP TABLE ' || VARIABLES.locktable ;
    END
    EXECUTE IMMEDIATE 'CREATE TABLE ' || VARIABLES.locktable || '(a integer)' WITHOUT RETURN ;
    CREATE LOCAL TEMPORARY TABLE tmpTable ( "id" integer, "blurb" string, "priority" string, "locked_until" string, "label_ids" string, "active_at" timestamp, "changed_at" timestamp, "created_at" timestamp, "updated_at" timestamp, "first_opened_at" timestamp, "opened_at" timestamp, "first_resolved_at" timestamp, "resolved_at" timestamp, "status" string, "active_notes_count" string, "active_attachments_count" string, "has_pending_interactions" string, "has_failed_interactions" string, "description" string, "language" string, "received_at" timestamp, "type" string, "labels" string, "subject" string, "custom_fields" string, "message_href" string, "customer_href" string, "labels_href" string, "userid" string, "assigned_group" string, "locked_by" string, "history_href" string, "case_links_href" string, "macro_preview_href" string, "replies_href" string, "replies__count" integer, "notes_href" string, "notes_count" integer, "attachements_href" string, "attachements_count" integer ) ;
    IF ( NOT EXISTS ( select
            *
        from
            SYS.Tables t
        where
            LCASE ( t.VDBName ) = LCASE ( VARIABLES.vdb_name )
            and LCASE ( t.schemaName ) = LCASE ( VARIABLES.dwh_schema )
            and LCASE ( ( t.schemaName || '.' || t.name ) ) = LCASE ( replace ( dwh_table, '"', '' ) ) ) )
    BEGIN
        EXECUTE IMMEDIATE 'SELECT * INTO ' || dwh_table || ' FROM  tmpTable LIMIT 0' WITHOUT RETURN ;
    END
    IF ( EXISTS ( select
            *
        from
            SYS.Tables t
        where
            LCASE ( t.VDBName ) = LCASE ( VARIABLES.vdb_name )
            and LCASE ( t.schemaName ) = LCASE ( VARIABLES.dwh_schema )
            and LCASE ( ( t.schemaName || '.' || t.name ) ) = LCASE ( VARIABLES.deltatable ) ) )
    BEGIN
        EXECUTE IMMEDIATE 'DROP TABLE ' || deltatable WITHOUT RETURN ;
    END
    totalrecords = SELECT
            "xml_table.total_entries"
        FROM
            ( exec "desk_com_ws".invokeHTTP ( action => 'GET', requestContentType => 'application/json', endpoint => 'cases?sort_field=created_at&sort_direction=asc&since_id=' || internal_since___id ) ) w
            , XMLTABLE ( XMLNAMESPACES ( 'http://www.w3.org/2001/XMLSchema-instance' as "xsi" ), '//root' PASSING JSONTOXML ( 'root', to_chars ( w.result, 'UTF-8' ) ) COLUMNS "total_entries" INTEGER PATH 'total_entries' ) "xml_table" ;
    IF ( in_since_id IS NOT NULL )
    BEGIN
        internal_since_id = '&since_id=' || in_since_id ;
        endpointstring = 'cases?page=' || CurrentPage || '&per_page=' || PageSize || '&sort_field=created_at&sort_direction=asc' || NVL ( internal_since_id, '' ) ;
        totalrecords = ( SELECT
                "xml_table.total_entries"
            FROM
                ( exec "desk_com_ws".invokeHTTP ( action => 'GET', requestContentType => 'application/json', endpoint => endpointstring ) ) w
                , XMLTABLE ( XMLNAMESPACES ( 'http://www.w3.org/2001/XMLSchema-instance' as "xsi" ), '//root' PASSING JSONTOXML ( 'root', to_chars ( w.result, 'UTF-8' ) ) COLUMNS "total_entries" INTEGER PATH 'total_entries' ) "xml_table" ) /* - cast ( records_processed as integer ) */
        ;
    END
    else internal_since_id = '&since_id=' || 0 ;
    if ( totalrecords > 0 )
    begin
        pagescount = cast ( totalrecords as double ) / PageSize ;
        mod_val = pagescount - floor ( pagescount ) ;
        querrycount = round ( cast ( pagescount as integer )
        , 0 ) + 1 ;
        exec "SYSADMIN.logMsg" ( "level" => 'INFO'
        , "context" => 'org.teiid.PROCESSOR'
        , "msg" => '[desk_com_connector.get_list_cases_inc] Max Pages to get: ' || querrycount ) ;
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
            or ( in_since_id = '' ) ) )
            BEGIN
                if ( totalrecords - cast ( cast ( records_processed as string ) as integer ) < PageSize ) PageSize = totalrecords - cast ( cast ( records_processed as string ) as integer ) ;
                endpointstring = 'cases?page=' || PageNum || '&per_page=' || PageSize || '&sort_field=created_at&sort_direction=asc' || NVL ( internal_since_id
                , '' ) ;
                PageNum = PageNum + 1 ;
            END
            else
            begin
                if ( tmpMaxID is null )
                begin
                    endpointstring = 'cases?page=' || PageNum || '&per_page=' || PageSize || '&sort_field=created_at&sort_direction=asc' || NVL ( internal_since_id
                    , '' ) ;
                end
                else
                begin
                    endpointstring = 'cases?page=' || PageNum || '&per_page=' || PageSize || '&sort_field=created_at&sort_direction=asc&since_id=' || tmpMaxID ;
                end
                PageNum = PageNum + 1 ;
            end
            exec "SYSADMIN.logMsg" ( "level" => 'INFO'
            , "context" => 'org.teiid.PROCESSOR'
            , "msg" => '[desk_com_connector.get_list_cases] Executing "' || endpointstring || '"' ) ;
            INSERT
                INTO tmpTable SELECT
                        "xml_table.id"
                        , substring ( replace ( "xml_table.blurb", unescape ( '\0' ), '' ), 1, 4000 ) as "blurb"
                        , "xml_table.priority"
                        , "xml_table.locked_until"
                        , "xml_table.label_ids"
                        , parsetimestamp ( NULLIF ( "xml_table.active_at", '' ), 'yyyy-MM-dd''T''hh:mm:ssX' ) as "active_at"
                        , parsetimestamp ( NULLIF ( "xml_table.changed_at", '' ), 'yyyy-MM-dd''T''hh:mm:ssX' ) as "changed_at"
                        , parsetimestamp ( NULLIF ( "xml_table.created_at", '' ), 'yyyy-MM-dd''T''hh:mm:ssX' ) as "created_at"
                        , parsetimestamp ( NULLIF ( "xml_table.updated_at", '' ), 'yyyy-MM-dd''T''hh:mm:ssX' ) as "updated_at"
                        , parsetimestamp ( NULLIF ( "xml_table.first_opened_at", '' ), 'yyyy-MM-dd''T''hh:mm:ssX' ) as "first_opened_at"
                        , parsetimestamp ( NULLIF ( "xml_table.opened_at", '' ), 'yyyy-MM-dd''T''hh:mm:ssX' ) as "opened_at"
                        , parsetimestamp ( NULLIF ( "xml_table.first_resolved_at", '' ), 'yyyy-MM-dd''T''hh:mm:ssX' ) as "first_resolved_at"
                        , parsetimestamp ( NULLIF ( "xml_table.resolved_at", '' ), 'yyyy-MM-dd''T''hh:mm:ssX' ) as "resolved_at"
                        , "xml_table.status"
                        , "xml_table.active_notes_count"
                        , "xml_table.active_attachments_count"
                        , "xml_table.has_pending_interactions"
                        , "xml_table.has_failed_interactions"
                        , "xml_table.description"
                        , "xml_table.language"
                        , parsetimestamp ( NULLIF ( "xml_table.received_at", '' ), 'yyyy-MM-dd''T''hh:mm:ssX' ) as "received_at"
                        , "xml_table.type"
                        , "xml_table.labels"
                        , substring ( "xml_table.subject", 1, 4000 ) as subject
                        , "xml_table.custom_fields"
                        , "xml_table.message_href"
                        , nvl ( substring ( "xml_table.customer_href", 19 ), 0 ) as customerid
                        , "xml_table.labels_href"
                        , nvl ( substring ( "xml_table.assigned_user_href", 15 ), 0 ) as userid
                        , "xml_table.assigned_group"
                        , "xml_table.locked_by"
                        , "xml_table.history_href"
                        , "xml_table.case_links_href"
                        , "xml_table.macro_preview_href"
                        , "xml_table.replies_href"
                        , "xml_table.replies__count"
                        , "xml_table.notes_href"
                        , "xml_table.notes_count"
                        , "xml_table.attachements_href"
                        , "xml_table.attachements_count"
                    FROM
                        ( exec "desk_com_ws".invokeHTTP ( action => 'GET', requestContentType => 'application/json', endpoint => endpointstring ) ) w
                        , XMLTABLE ( XMLNAMESPACES ( 'http://www.w3.org/2001/XMLSchema-instance' as "xsi" ), '//entries' PASSING JSONTOXML ( 'root', to_chars ( w.result, 'UTF-8' ) ) COLUMNS "total_entries" STRING PATH '../../total_entries', "id" INTEGER PATH 'id', "blurb" STRING PATH 'blurb', "priority" STRING PATH 'priority', "locked_until" STRING PATH 'locked_until', "label_ids" STRING PATH 'string-join(label_ids/text(),'', '')', "active_at" STRING PATH 'active_at', "changed_at" STRING PATH 'changed_at', "created_at" STRING PATH 'created_at', "updated_at" STRING PATH 'updated_at', "first_opened_at" STRING PATH 'first_opened_at', "opened_at" STRING PATH 'opened_at', "first_resolved_at" STRING PATH 'first_resolved_at', "resolved_at" STRING PATH 'resolved_at', "status" STRING PATH 'status', "active_notes_count" STRING PATH 'active_notes_count', "active_attachments_count" STRING PATH 'active_attachments_count', "has_pending_interactions" STRING PATH 'has_pending_interactions', "has_failed_interactions" STRING PATH 'has_failed_interactions', "description" STRING PATH 'description', "language" STRING PATH 'language', "received_at" STRING PATH 'received_at', "type" STRING PATH 'type', "labels" STRING PATH 'string-join(labels/text(),'', '')', "subject" STRING PATH 'subject', "custom_fields" STRING PATH 'custom_fields', "message_href" STRING PATH '_links/message/href', "customer_href" STRING PATH '_links/customer/href', "labels_href" STRING PATH '_links/labels/href', "assigned_user_href" STRING PATH '_links/assigned_user/href', "assigned_group" STRING PATH '_links/assigned_group', "locked_by" STRING PATH '_links/locked_by', "history_href" STRING PATH '_links/history/href', "case_links_href" STRING PATH '_links/case_links/href', "macro_preview_href" STRING PATH '_links/macro_preview/href', "replies_href" STRING PATH '_links/replies/href', "replies__count" integer PATH '_links/replies/count', "notes_href" STRING PATH '_links/notes/href', "notes_count" integer PATH '_links/notes/count', "attachements_href" STRING PATH '_links/attachments/href', "attachements_count" integer PATH '_links/attachments/count' ) "xml_table" ;
            EXECUTE IMMEDIATE 'SELECT * INTO ' || VARIABLES.deltatable || ' FROM tmpTable' WITHOUT RETURN ;
            DELETE
                FROM
                    tmpTable ;
            /*---------------------------------------- checking duplicates*/
            /*      EXECUTE IMMEDIATE 'DELETE FROM ' || dwh_table || '  WHERE id IN (SELECT id as a FROM ' || VARIABLES.deltatable || ')' WITHOUT RETURN ;*/
            /*----------------------------------------checking duplicates*/
            EXECUTE IMMEDIATE 'INSERT INTO ' || dwh_table || ' SELECT * FROM ' || deltatable WITHOUT RETURN ;
            EXECUTE IMMEDIATE 'DROP TABLE ' || deltatable WITHOUT RETURN ;
            if ( PageNum = PagesCountLimit )
            BEGIN
                page_limit_exceeded = true ;
                PageNum = 1 ;
                DELETE
                    FROM
                        TabTmpMax ;
                EXECUTE IMMEDIATE 'INSERT INTO TabTmpMax SELECT max ( id ) FROM ' || dwh_table WITHOUT RETURN ;
                tmpMaxID = select
                        c
                    from
                        TabTmpMax ;
            END
            IF ( in_since_id IS NOT NULL )
            BEGIN
                if ( ( totalrecords2 - records_processed2 ) < PageSize ) PageSize = totalrecords2 - records_processed2 ;
                exec "SYSADMIN.logMsg" ( "level" => 'INFO', "context" => 'org.teiid.PROCESSOR', "msg" => '[desk_com_connector.get_list_cases] Totalrecords from get_list_cases are ' || totalrecords || '.
        Processed records are ' || records_processed2 ) ;
            end
            else
            BEGIN
                if ( totalrecords - cast ( cast ( records_processed as string ) as integer ) < PageSize ) PageSize = totalrecords - cast ( cast ( records_processed as string ) as integer ) ;
                DELETE
                    FROM
                        TabTmpCount ;
                EXECUTE IMMEDIATE 'INSERT INTO TabTmpCount SELECT count(*) FROM ' || dwh_table WITHOUT RETURN ;
                records_processed = select
                        c
                    from
                        TabTmpCount ;
                exec "SYSADMIN.logMsg" ( "level" => 'INFO', "context" => 'org.teiid.PROCESSOR', "msg" => '[desk_com_connector.get_list_cases] Totalrecords from get_list_cases are ' || totalrecords || '.
        Processed records are ' || records_processed ) ;
            end
            i = i + 1 ;
        end
    end
    EXECUTE IMMEDIATE 'DROP TABLE ' || VARIABLES.locktable WITHOUT RETURN ;
    select
            '[desk_com_connector.get_list_cases]  Processed records are ' || records_processed || '. Content inserted to ' || dwh_table as recordsprocessed ;
end


