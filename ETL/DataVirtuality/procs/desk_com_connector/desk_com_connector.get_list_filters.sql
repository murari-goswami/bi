-- Name: desk_com_connector.get_list_filters
-- Created: 2015-08-10 15:23:25

CREATE virtual procedure desk_com_connector.get_list_filters ( IN in_since_id integer ) RETURNS ( "id" integer, "name" string, "position" string, "active" string, "routing_enabled" string, "sort_field" string, "sort_direction" string, "total_entries" string, "page" string ) as
begin
    call "desk_com_connector.internal_validateServerVersion" ( ) ;
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
    declare string endpointstring = 'filters?page=' || CurrentPage || '&per_page=' || PageSize || '&sort_field=created_at&sort_direction=asc' ;
    declare string internal_since_id = 0 ;
    declare string internal_since___id = 0 ;
    DECLARE integer tmpMaxID = null ;
    CREATE LOCAL TEMPORARY TABLE TabTmpMax ( c integer ) ;
    CREATE LOCAL TEMPORARY TABLE tmpTable ( "id" integer, "name" string, "position" string, "active" string, "routing_enabled" string, "sort_field" string, "sort_direction" string, "total_entries" string, "page" string ) ;
    totalrecords = SELECT
            "xml_table.total_entries"
        FROM
            ( exec "desk_com_ws".invokeHTTP ( action => 'GET', requestContentType => 'application/json', endpoint => 'filters?sort_field=created_at&sort_direction=asc&since_id=' || internal_since___id ) ) w
            , XMLTABLE ( XMLNAMESPACES ( 'http://www.w3.org/2001/XMLSchema-instance' as "xsi" ), '//root' PASSING JSONTOXML ( 'root', to_chars ( w.result, 'UTF-8' ) ) COLUMNS "total_entries" INTEGER PATH 'total_entries' ) "xml_table" ;
    IF ( in_since_id IS NOT NULL )
    BEGIN
        internal_since_id = '&since_id=' || in_since_id ;
        endpointstring = 'filters?page=' || CurrentPage || '&per_page=' || PageSize || '&sort_field=created_at&sort_direction=asc' || NVL ( internal_since_id, '' ) ;
    END
    else internal_since_id = '&since_id=' || 0 ;
    if ( totalrecords > 0 )
    begin
        pagescount = cast ( totalrecords as double ) / PageSize ;
        mod_val = pagescount - floor ( pagescount ) ;
        querrycount = round ( cast ( pagescount as integer ), 0 ) + 1 ;
        exec "SYSADMIN.logMsg" ( "level" => 'INFO', "context" => 'org.teiid.PROCESSOR', "msg" => '[desk_com_connector.get_list_filters] Max Pages to get: ' || querrycount ) ;
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
                endpointstring = 'filters?page=' || PageNum || '&per_page=' || PageSize || '&sort_field=created_at&sort_direction=asc' || NVL ( internal_since_id, '' ) ;
                PageNum = PageNum + 1 ;
            END
            else
            begin
                if ( tmpMaxID is null )
                begin
                    endpointstring = 'filters?page=' || PageNum || '&per_page=' || PageSize || '&sort_field=created_at&sort_direction=asc' || NVL ( internal_since_id, '' ) ;
                end
                else
                begin
                    endpointstring = 'filters?page=' || PageNum || '&per_page=' || PageSize || '&sort_field=created_at&sort_direction=asc&since_id=' || tmpMaxID ;
                end
                PageNum = PageNum + 1 ;
            end
            exec "SYSADMIN.logMsg" ( "level" => 'INFO', "context" => 'org.teiid.PROCESSOR', "msg" => '[desk_com_connector.get_list_filters] Executing "' || endpointstring || '"' ) ;
            INSERT
                INTO tmpTable SELECT
                        "xml_table.id"
                        , "xml_table.name"
                        , "xml_table.position"
                        , "xml_table.active"
                        , "xml_table.routing_enabled"
                        , "xml_table.sort_field"
                        , "xml_table.sort_direction"
                        , "xml_table.total_entries"
                        , "xml_table.page"
                    FROM
                        ( exec "desk_com_ws".invokeHTTP ( action => 'GET', requestContentType => 'application/json', endpoint => endpointstring ) ) w
                        , XMLTABLE ( XMLNAMESPACES ( 'http://www.w3.org/2001/XMLSchema-instance' as "xsi" ), '//entries' PASSING JSONTOXML ( 'root', to_chars ( w.result, 'UTF-8' ) ) COLUMNS "id" INTEGER PATH 'id', "name" STRING PATH 'name', "position" STRING PATH 'position', "active" STRING PATH 'active', "routing_enabled" STRING PATH 'routing_enabled', "sort_field" STRING PATH 'sort_field', "sort_direction" STRING PATH 'sort_direction', "total_entries" STRING PATH '../../total_entries', "page" STRING PATH '../../page' ) "xml_table" ;
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
                exec "SYSADMIN.logMsg" ( "level" => 'INFO', "context" => 'org.teiid.PROCESSOR', "msg" => '[desk_com_connector.get_list_filters] Totalrecords from get_list_filters are ' || totalrecords || '.
        Processed records are ' || records_processed2 ) ;
            end
            else
            BEGIN
                if ( totalrecords - cast ( cast ( records_processed as string ) as integer ) < PageSize ) PageSize = totalrecords - cast ( cast ( records_processed as string ) as integer ) ;
                records_processed = SELECT
                        count ( * )
                    FROM
                        tmpTable ;
                exec "SYSADMIN.logMsg" ( "level" => 'INFO', "context" => 'org.teiid.PROCESSOR', "msg" => '[desk_com_connector.get_list_filters] Totalrecords from get_list_filters are ' || totalrecords || '.
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


