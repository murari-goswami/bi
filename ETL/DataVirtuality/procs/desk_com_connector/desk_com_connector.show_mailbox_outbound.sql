-- Name: desk_com_connector.show_mailbox_outbound
-- Created: 2015-08-10 15:23:49

CREATE virtual procedure desk_com_connector.show_mailbox_outbound (
    in in_mb_outbound_id string
) RETURNS (
    "idColumn" integer
    ,"id" string
    ,"reply_to" string
    ,"hostname" string
    ,"last_error" string
    ,"created_at" string
    ,"updated_at" string
    ,"port" string
    ,"from_name" string
    ,"from_email" string
    ,"enabled" string
    ,"default" string
    ,"type" string
) as
begin
    call "desk_com_connector.internal_validateServerVersion" (
    ) ;
    SELECT
            "xml_table.idColumn"
            ,"xml_table.id"
            ,"xml_table.reply_to"
            ,"xml_table.hostname"
            ,"xml_table.last_error"
            ,"xml_table.created_at"
            ,"xml_table.updated_at"
            ,"xml_table.port"
            ,"xml_table.from_name"
            ,"xml_table.from_email"
            ,"xml_table.enabled"
            ,"xml_table.default"
            ,"xml_table.type"
        FROM
            (
                exec "desk_com_ws".invokeHTTP (
                    action => 'GET'
                    ,requestContentType => 'application/json'
                    ,endpoint => 'mailboxes/outbound/' || in_mb_outbound_id
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
                ,"reply_to" STRING PATH 'reply_to'
                ,"hostname" STRING PATH 'hostname'
                ,"last_error" STRING PATH 'last_error'
                ,"created_at" STRING PATH 'created_at'
                ,"updated_at" STRING PATH 'updated_at'
                ,"port" STRING PATH 'port'
                ,"from_name" STRING PATH 'from_name'
                ,"from_email" STRING PATH 'from_email'
                ,"enabled" STRING PATH 'enabled'
                ,"default" STRING PATH 'default'
                ,"type" STRING PATH 'type'
            ) "xml_table" ;
end


