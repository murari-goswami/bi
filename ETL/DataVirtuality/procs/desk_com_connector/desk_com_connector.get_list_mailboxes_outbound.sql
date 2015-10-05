-- Name: desk_com_connector.get_list_mailboxes_outbound
-- Created: 2015-08-10 15:23:42

create virtual procedure desk_com_connector.get_list_mailboxes_outbound ( ) RETURNS ( "id" string, "reply_to" string, "hostname" string, "last_error" string, "created_at" timestamp, "updated_at" timestamp, "port" string, "from_name" string, "from_email" string, "enabled" string, "default" string, "type" string, "total_entries" string, "page" string ) as
begin
    call "desk_com_connector.internal_validateServerVersion" ( ) ;
    declare string endpointstring = 'mailboxes/outbound' ;
    SELECT
            "xml_table.id"
            , "xml_table.reply_to"
            , "xml_table.hostname"
            , "xml_table.last_error"
            , PARSETIMESTAMP ( NULLIF ( "xml_table.created_at", '' ), 'yyyy-MM-dd''T''hh:mm:ssX' ) as "created_at"
            , PARSETIMESTAMP ( NULLIF ( "xml_table.updated_at", '' ), 'yyyy-MM-dd''T''hh:mm:ssX' ) as "updated_at"
            , "xml_table.port"
            , "xml_table.from_name"
            , "xml_table.from_email"
            , "xml_table.enabled"
            , "xml_table.default"
            , "xml_table.type"
            , "xml_table.total_entries"
            , "xml_table.page"
        FROM
            ( exec "desk_com_ws".invokeHTTP ( action => 'GET', requestContentType => 'application/json', endpoint => endpointstring ) ) w
            , XMLTABLE ( XMLNAMESPACES ( 'http://www.w3.org/2001/XMLSchema-instance' as "xsi" ), '//entries' PASSING JSONTOXML ( 'root', to_chars ( w.result, 'UTF-8' ) ) COLUMNS "id" STRING PATH 'id', "reply_to" STRING PATH 'reply_to', "hostname" STRING PATH 'hostname', "last_error" STRING PATH 'last_error', "created_at" STRING PATH 'created_at', "updated_at" STRING PATH 'updated_at', "port" STRING PATH 'port', "from_name" STRING PATH 'from_name', "from_email" STRING PATH 'from_email', "enabled" STRING PATH 'enabled', "default" STRING PATH 'default', "type" STRING PATH 'type', "total_entries" STRING PATH '../../total_entries', "page" STRING PATH '../../page' ) "xml_table" ;
end


