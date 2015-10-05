-- Name: desk_com_connector.get_list_custom_fields
-- Created: 2015-08-10 15:23:36

CREATE virtual procedure desk_com_connector.get_list_custom_fields ( ) RETURNS ( "id" integer, "name" string, "active" string, "label" string, "type" string, "data_type" string, "total_entries" string, "page" string ) as
begin
    call "desk_com_connector.internal_validateServerVersion" ( ) ;
    declare integer totalrecords ;
    declare double pagescount ;
    declare double mod_val ;
    declare integer i = 1 ;
    declare integer querrycount ;
    declare integer CurrentPage = 1 ;
    declare integer PageSize = 100 ;
    declare string endpointstring = 'custom_fields?page=' || CurrentPage || '&per_page=' || PageSize ;
    CREATE LOCAL TEMPORARY TABLE tbltmp ( "id" integer, "name" string, "active" string, "label" string, "type" string, "data_type" string, "total_entries" string, "page" string ) ;
    totalrecords = SELECT
            "xml_table.total_entries"
        FROM
            ( exec "desk_com_ws".invokeHTTP ( action => 'GET', requestContentType => 'application/json', endpoint => 'custom_fields' ) ) w
            , XMLTABLE ( XMLNAMESPACES ( 'http://www.w3.org/2001/XMLSchema-instance' as "xsi" ), '//root' PASSING JSONTOXML ( 'root', to_chars ( w.result, 'UTF-8' ) ) COLUMNS "total_entries" INTEGER PATH 'total_entries' ) "xml_table" ;
    if ( totalrecords > 0 )
    begin
        pagescount = cast ( totalrecords as double ) / PageSize ;
        mod_val = pagescount - floor ( pagescount ) ;
        querrycount = round ( cast ( pagescount as integer ), 0 ) + 1 ;
        while ( i <= querrycount )
        begin
            endpointstring = 'custom_fields?page=' || i || '&per_page=' || PageSize ;
            INSERT
                INTO tbltmp SELECT
                        "xml_table.id"
                        , "xml_table.name"
                        , "xml_table.active"
                        , "xml_table.label"
                        , "xml_table.type"
                        , "xml_table.data_type"
                        , "xml_table.total_entries"
                        , "xml_table.page"
                    FROM
                        ( exec "desk_com_ws".invokeHTTP ( action => 'GET', requestContentType => 'application/json', endpoint => endpointstring ) ) w
                        , XMLTABLE ( XMLNAMESPACES ( 'http://www.w3.org/2001/XMLSchema-instance' as "xsi" ), '/root/_embedded/entries/data/type' PASSING JSONTOXML ( 'root', to_chars ( w.result, 'UTF-8' ) ) COLUMNS "id" integer PATH '../../id', "name" STRING PATH '../../name', "active" STRING PATH '../../active', "label" STRING PATH '../../label', "type" STRING PATH '../../type', "data_type" STRING PATH '.', "total_entries" STRING PATH '../../../../total_entries', "page" STRING PATH '../../../../page' ) "xml_table" ;
            i = i + 1 ;
        end
        select
                *
            from
                tbltmp ;
    end
end


