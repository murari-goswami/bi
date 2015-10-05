-- Name: desk_com_connector.get_list_snippets
-- Created: 2015-08-10 15:23:33

CREATE virtual procedure desk_com_connector.get_list_snippets ( ) RETURNS ( "name" string, "total_entries" string, "page" string ) as
begin
    call "desk_com_connector.internal_validateServerVersion" ( ) ;
    declare integer totalrecords ;
    declare double pagescount ;
    declare double mod_val ;
    declare integer i = 1 ;
    declare integer querrycount ;
    declare integer CurrentPage = 1 ;
    declare integer PageSize = 100 ;
    declare string endpointstring = 'snippets?page=' || CurrentPage || '&per_page=' || PageSize ;
    CREATE LOCAL TEMPORARY TABLE tmpTable ( "name" string, "total_entries" string, "page" string ) ;
    totalrecords = SELECT
            "xml_table.total_entries"
        FROM
            ( exec "desk_com_ws".invokeHTTP ( action => 'GET', requestContentType => 'application/json', endpoint => 'snippets' ) ) w
            , XMLTABLE ( XMLNAMESPACES ( 'http://www.w3.org/2001/XMLSchema-instance' as "xsi" ), '//root' PASSING JSONTOXML ( 'root', to_chars ( w.result, 'UTF-8' ) ) COLUMNS "total_entries" INTEGER PATH 'total_entries' ) "xml_table" ;
    if ( totalrecords > 0 )
    begin
        pagescount = cast ( totalrecords as double ) / PageSize ;
        mod_val = pagescount - floor ( pagescount ) ;
        querrycount = round ( cast ( pagescount as integer ), 0 ) + 1 ;
        while ( i <= querrycount )
        begin
            endpointstring = 'snippets?page=' || i || '&per_page=' || PageSize ;
            INSERT
                INTO tmpTable SELECT
                        "xml_table.name"
                        , "xml_table.total_entries"
                        , "xml_table.page"
                    FROM
                        ( exec "desk_com_ws".invokeHTTP ( action => 'GET', requestContentType => 'application/json', endpoint => endpointstring ) ) w
                        , XMLTABLE ( XMLNAMESPACES ( 'http://www.w3.org/2001/XMLSchema-instance' as "xsi" ), '//entries' PASSING JSONTOXML ( 'root', to_chars ( w.result, 'UTF-8' ) ) COLUMNS "name" STRING PATH 'name', "total_entries" STRING PATH '../../total_entries', "page" STRING PATH '../../page' ) "xml_table" ;
            i = i + 1 ;
        end
        select
                *
            from
                tmpTable ;
    end
end


