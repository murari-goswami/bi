-- Name: desk_com_connector.get_list_users_mobile_devices
-- Created: 2015-08-10 15:23:47

CREATE virtual procedure desk_com_connector.get_list_users_mobile_devices ( IN in_since_id integer, in in_user_id string ) RETURNS ( "id" integer, "device_token" string, "type" string, "created_at" timestamp, "updated_at" timestamp, "total_entries" string, "page" string ) as
begin
    call "desk_com_connector.internal_validateServerVersion" ( ) ;
    if ( ( in_user_id is null )
    or ( in_user_id = '' ) ) error '
    
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
    declare integer PageSize = 50 ;
    declare boolean page_limit_exceeded = false ;
    declare string internal_since_id = 0 ;
    declare string internal_since___id = 0 ;
    DECLARE integer tmpMaxID = null ;
    CREATE LOCAL TEMPORARY TABLE TabTmpMax ( c integer ) ;
    declare string endpointstring = 'users/' || in_user_id || '/mobile_devices?page=' || CurrentPage || '&per_page=' || PageSize || '&sort_field=created_at&sort_direction=asc' ;
    CREATE LOCAL TEMPORARY TABLE tmpTable ( "id" integer, "device_token" string, "type" string, "created_at" timestamp, "updated_at" timestamp, "total_entries" string, "page" string ) ;
    IF ( in_since_id IS NOT NULL )
    BEGIN
        internal_since_id = '&since_id=' || in_since_id ;
        endpointstring = 'users/' || in_user_id || '/mobile_devices?page=' || CurrentPage || '&per_page=' || PageSize || '&sort_field=created_at&sort_direction=asc' || NVL ( internal_since_id, '' ) ;
    END
    else internal_since_id = '&since_id=' || 0 ;
    totalrecords = SELECT
            "xml_table.total_entries"
        FROM
            ( exec "desk_com_ws".invokeHTTP ( action => 'GET', requestContentType => 'application/json', endpoint => 'users/' || in_user_id || '/mobile_devices?sort_field=created_at&sort_direction=asc&since_id=' || internal_since___id ) ) w
            , XMLTABLE ( XMLNAMESPACES ( 'http://www.w3.org/2001/XMLSchema-instance' as "xsi" ), '//root' PASSING JSONTOXML ( 'root', to_chars ( w.result, 'UTF-8' ) ) COLUMNS "total_entries" INTEGER PATH 'total_entries' ) "xml_table" ;
    if ( totalrecords > 0 )
    begin
        pagescount = cast ( totalrecords as double ) / PageSize ;
        mod_val = pagescount - floor ( pagescount ) ;
        querrycount = round ( cast ( pagescount as integer ), 0 ) + 1 ;
        exec "SYSADMIN.logMsg" ( "level" => 'INFO', "context" => 'org.teiid.PROCESSOR', "msg" => '[desk_com_connector.get_list_users_mobile_devices] Max Pages to get: ' || querrycount ) ;
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
                endpointstring = 'users/' || in_user_id || '/mobile_devices?page=' || PageNum || '&per_page=' || PageSize || '&sort_field=created_at&sort_direction=asc' || NVL ( internal_since_id, '' ) ;
                PageNum = PageNum + 1 ;
            END
            else
            begin
                if ( tmpMaxID is null )
                begin
                    endpointstring = 'users/' || in_user_id || '/mobile_devices?page=' || PageNum || '&per_page=' || PageSize || '&sort_field=created_at&sort_direction=asc' || NVL ( internal_since_id, '' ) ;
                end
                else
                begin
                    endpointstring = 'users/' || in_user_id || '/mobile_devices?page=' || PageNum || '&per_page=' || PageSize || '&sort_field=created_at&sort_direction=asc&since_id=' || tmpMaxID ;
                end
                PageNum = PageNum + 1 ;
            end
            exec "SYSADMIN.logMsg" ( "level" => 'INFO', "context" => 'org.teiid.PROCESSOR', "msg" => '[desk_com_connector.get_list_users_mobile_devices] Executing "' || endpointstring || '"' ) ;
            INSERT
                INTO tmpTable SELECT
                        "xml_table.id"
                        , "xml_table.device_token"
                        , "xml_table.type"
                        , PARSETIMESTAMP ( NULLIF ( "xml_table.created_at", '' ), 'yyyy-MM-dd''T''hh:mm:ssX' ) as "created_at"
                        , PARSETIMESTAMP ( NULLIF ( "xml_table.updated_at", '' ), 'yyyy-MM-dd''T''hh:mm:ssX' ) as "updated_at"
                        , "xml_table.total_entries"
                        , "xml_table.page"
                    FROM
                        ( exec "desk_com_ws".invokeHTTP ( action => 'GET', requestContentType => 'application/json', endpoint => endpointstring ) ) w
                        , XMLTABLE ( XMLNAMESPACES ( 'http://www.w3.org/2001/XMLSchema-instance' as "xsi" ), '//root' PASSING JSONTOXML ( 'root', to_chars ( w.result, 'UTF-8' ) ) COLUMNS "id" integer PATH 'id', "device_token" STRING PATH 'device_token', "type" STRING PATH 'type', "created_at" STRING PATH 'created_at', "updated_at" STRING PATH 'updated_at', "total_entries" STRING PATH '../../total_entries', "page" STRING PATH '../../page' ) "xml_table" ;
            if ( PageNum = PagesCountLimit )
            BEGIN
                page_limit_exceeded = true ;
                PageNum = 1 ;
                DELETE
                    FROM
                        TabTmpMax ;
                EXECUTE IMMEDIATE 'INSERT INTO TabTmpMax SELECT max ( id ) FROM tmpTable;' WITHOUT RETURN ;
                tmpMaxID = select
                        c
                    from
                        TabTmpMax ;
            END
            IF ( in_since_id IS NOT NULL )
            BEGIN
                if ( ( totalrecords2 - records_processed2 ) < PageSize ) PageSize = totalrecords2 - records_processed2 ;
                exec "SYSADMIN.logMsg" ( "level" => 'INFO', "context" => 'org.teiid.PROCESSOR', "msg" => '[desk_com_connector.get_list_users_mobile_devices] Totalrecords from get_list_users_mobile_devices are ' || totalrecords || '.
        Processed records are ' || records_processed2 ) ;
            end
            else
            BEGIN
                if ( totalrecords - cast ( cast ( records_processed as string ) as integer ) < PageSize ) PageSize = totalrecords - cast ( cast ( records_processed as string ) as integer ) ;
                records_processed = SELECT
                        count ( * )
                    FROM
                        tmpTable ;
                exec "SYSADMIN.logMsg" ( "level" => 'INFO', "context" => 'org.teiid.PROCESSOR', "msg" => '[desk_com_connector.get_list_users_mobile_devices] Totalrecords from get_list_users_mobile_devices are ' || totalrecords || '.
        Processed records are ' || records_processed ) ;
            end
            i = i + 1 ;
        end
        select
                *
            from
                tmpTable ;
    end
end


