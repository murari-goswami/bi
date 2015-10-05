-- Name: desk_com_connector.show_mailbox_inbound
-- Created: 2015-08-10 15:23:27

CREATE virtual procedure desk_com_connector.show_mailbox_inbound (
    in in_mailbox_id string
) RETURNS (
    "idColumn" integer
    ,"id" string
    ,"name" string
    ,"hostname" string
    ,"email" string
    ,"last_checked_at" string
    ,"created_at" string
    ,"updated_at" string
    ,"inbound_address_filter" string
    ,"outbound_address_filter" string
    ,"last_error" string
    ,"port" string
    ,"enabled" string
    ,"type" string
) as
begin
    call "desk_com_connector.internal_validateServerVersion" (
    ) ;
    SELECT
            "xml_table.idColumn"
            ,"xml_table.id"
            ,"xml_table.name"
            ,"xml_table.hostname"
            ,"xml_table.email"
            ,"xml_table.last_checked_at"
            ,"xml_table.created_at"
            ,"xml_table.updated_at"
            ,"xml_table.inbound_address_filter"
            ,"xml_table.outbound_address_filter"
            ,"xml_table.last_error"
            ,"xml_table.port"
            ,"xml_table.enabled"
            ,"xml_table.type"
        FROM
            (
                exec "desk_com_ws".invokeHTTP (
                    action => 'GET'
                    ,requestContentType => 'application/json'
                    ,endpoint => 'mailboxes/inbound/' || in_mailbox_id
                )
            ) w
            ,XMLTABLE (
                XMLNAMESPACES (
                    'http://www.w3.org/2001/XMLSchema-instance' as "xsi"
                )
                ,'//root' PASSING JSONTOXML (
                    'root'
                    ,to_chars (
                        w.result
                        ,'UTF-8'
                    )
                ) COLUMNS "idColumn" FOR ORDINALITY
                ,"id" STRING PATH 'id'
                ,"name" STRING PATH 'name'
                ,"hostname" STRING PATH 'hostname'
                ,"email" STRING PATH 'email'
                ,"last_checked_at" STRING PATH 'last_checked_at'
                ,"created_at" STRING PATH 'created_at'
                ,"updated_at" STRING PATH 'updated_at'
                ,"inbound_address_filter" STRING PATH 'inbound_address_filter'
                ,"outbound_address_filter" STRING PATH 'outbound_address_filter'
                ,"last_error" STRING PATH 'last_error'
                ,"port" STRING PATH 'port'
                ,"enabled" STRING PATH 'enabled'
                ,"type" STRING PATH 'type'
            ) "xml_table" ;
end


