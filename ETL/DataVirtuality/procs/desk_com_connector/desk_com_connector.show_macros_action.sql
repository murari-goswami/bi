-- Name: desk_com_connector.show_macros_action
-- Created: 2015-08-10 15:23:30

CREATE virtual procedure desk_com_connector.show_macros_action (
    in in_macros_id string
    ,in in_action_id string
) RETURNS (
    "idColumn" integer
    ,"id" string
    ,"type" string
    ,"value" string
    ,"created_at" string
    ,"updated_at" string
    ,"enabled" string
) as
begin
    call "desk_com_connector.internal_validateServerVersion" (
    ) ;
    SELECT
            "xml_table.idColumn"
            ,"xml_table.id"
            ,"xml_table.type"
            ,"xml_table.value"
            ,"xml_table.created_at"
            ,"xml_table.updated_at"
            ,"xml_table.enabled"
        FROM
            (
                exec "desk_com_ws".invokeHTTP (
                    action => 'GET'
                    ,requestContentType => 'application/json'
                    ,endpoint => 'macros/' || in_macros_id || '/actions/' || in_action_id
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
                ,"type" STRING PATH 'type'
                ,"value" STRING PATH 'value'
                ,"created_at" STRING PATH 'created_at'
                ,"updated_at" STRING PATH 'updated_at'
                ,"enabled" STRING PATH 'enabled'
            ) "xml_table" ;
end


