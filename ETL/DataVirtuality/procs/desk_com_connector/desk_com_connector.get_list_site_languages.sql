-- Name: desk_com_connector.get_list_site_languages
-- Created: 2015-08-10 15:23:32

CREATE virtual procedure desk_com_connector.get_list_site_languages ( ) RETURNS ( "id" string, "name" string, "customer" string, "is_case_default" string, "agent" string, "case" string, "total_entries" string, "page" string ) as
begin
    call "desk_com_connector.internal_validateServerVersion" ( ) ;
    declare string endpointstring = 'site/languages' ;
    SELECT
            "xml_table.id"
            , "xml_table.name"
            , "xml_table.customer"
            , "xml_table.is_case_default"
            , "xml_table.agent"
            , "xml_table.case"
            , "xml_table.total_entries"
            , "xml_table.page"
        FROM
            ( exec "desk_com_ws".invokeHTTP ( action => 'GET', requestContentType => 'application/json', endpoint => endpointstring ) ) w
            , XMLTABLE ( XMLNAMESPACES ( 'http://www.w3.org/2001/XMLSchema-instance' as "xsi" ), '//entries' PASSING JSONTOXML ( 'root', to_chars ( w.result, 'UTF-8' ) ) COLUMNS "id" STRING PATH 'id', "name" STRING PATH 'name', "customer" STRING PATH 'customer', "is_case_default" STRING PATH 'is_case_default', "agent" STRING PATH 'agent', "case" STRING PATH 'case', "total_entries" STRING PATH '../../total_entries', "page" STRING PATH '../../page' ) "xml_table" ;
end


