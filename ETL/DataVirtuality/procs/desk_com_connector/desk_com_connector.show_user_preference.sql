-- Name: desk_com_connector.show_user_preference
-- Created: 2015-08-10 15:23:35

create virtual procedure desk_com_connector.show_user_preference (
    in in_user_id string
    ,in in_pref_id string
) RETURNS (
    "idColumn" integer
    ,"id" string
    ,"name" string
    ,"value" string
) as
begin
    call "desk_com_connector.internal_validateServerVersion" (
    ) ;
    SELECT
            "xml_table.idColumn"
            ,"xml_table.id"
            ,"xml_table.name"
            ,"xml_table.value"
        FROM
            (
                exec "desk_com_ws".invokeHTTP (
                    action => 'GET'
                    ,requestContentType => 'application/json'
                    ,endpoint => 'users/' || in_user_id || '/preferences/' || in_pref_id
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
                ,"value" STRING PATH 'value'
            ) "xml_table" ;
end


