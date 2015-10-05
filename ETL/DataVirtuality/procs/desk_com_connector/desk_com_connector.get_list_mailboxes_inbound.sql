-- Name: desk_com_connector.get_list_mailboxes_inbound
-- Created: 2015-08-10 15:23:42

CREATE virtual procedure desk_com_connector.get_list_mailboxes_inbound ( ) RETURNS ( "id" string, "name" string, "hostname" string, "email" string, "last_checked_at" timestamp, "created_at" timestamp, "updated_at" timestamp, "inbound_address_filter" string, "outbound_address_filter" string, "last_error" string, "port" string, "enabled" string, "type" string, "total_entries" string, "page" string ) as
begin
    call "desk_com_connector.internal_validateServerVersion" ( ) ;
    declare string endpointstring = 'mailboxes/inbound' ;
    SELECT
            "xml_table.id"
            , "xml_table.name"
            , "xml_table.hostname"
            , "xml_table.email"
            , PARSETIMESTAMP ( NULLIF ( "xml_table.last_checked_at", '' ), 'yyyy-MM-dd''T''hh:mm:ssX' ) as "last_checked_at"
            , PARSETIMESTAMP ( NULLIF ( "xml_table.created_at", '' ), 'yyyy-MM-dd''T''hh:mm:ssX' ) as "created_at"
            , PARSETIMESTAMP ( NULLIF ( "xml_table.updated_at", '' ), 'yyyy-MM-dd''T''hh:mm:ssX' ) as "updated_at"
            , "xml_table.inbound_address_filter"
            , "xml_table.outbound_address_filter"
            , "xml_table.last_error"
            , "xml_table.port"
            , "xml_table.enabled"
            , "xml_table.type"
            , "xml_table.total_entries"
            , "xml_table.page"
        FROM
            ( exec "desk_com_ws".invokeHTTP ( action => 'GET', requestContentType => 'application/json', endpoint => endpointstring ) ) w
            , XMLTABLE ( XMLNAMESPACES ( 'http://www.w3.org/2001/XMLSchema-instance' as "xsi" ), '//entries' PASSING JSONTOXML ( 'root', to_chars ( w.result, 'UTF-8' ) ) COLUMNS "id" STRING PATH 'id', "name" STRING PATH 'name', "hostname" STRING PATH 'hostname', "email" STRING PATH 'email', "last_checked_at" STRING PATH 'last_checked_at', "created_at" STRING PATH 'created_at', "updated_at" STRING PATH 'updated_at', "inbound_address_filter" STRING PATH 'inbound_address_filter', "outbound_address_filter" STRING PATH 'outbound_address_filter', "last_error" STRING PATH 'last_error', "port" STRING PATH 'port', "enabled" STRING PATH 'enabled', "type" STRING PATH 'type', "total_entries" STRING PATH '../../total_entries', "page" STRING PATH '../../page' ) "xml_table" ;
end


