-- Name: desk_com_connector.show_rule
-- Created: 2015-08-10 15:23:31

CREATE virtual procedure desk_com_connector.show_rule (
    in in_rules_id string
) RETURNS (
    "idColumn" integer
    ,"id" string
    ,"name" string
    ,"description" string
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
            ,"xml_table.name"
            ,"xml_table.description"
            ,"xml_table.created_at"
            ,"xml_table.updated_at"
            ,"xml_table.enabled"
        FROM
            (
                exec "desk_com_ws".invokeHTTP (
                    action => 'GET'
                    ,requestContentType => 'application/json'
                    ,endpoint => 'rules/' || in_rules_id
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
                ,"description" STRING PATH 'description'
                ,"created_at" STRING PATH 'created_at'
                ,"updated_at" STRING PATH 'updated_at'
                ,"enabled" STRING PATH 'enabled'
            ) "xml_table" ;
end


