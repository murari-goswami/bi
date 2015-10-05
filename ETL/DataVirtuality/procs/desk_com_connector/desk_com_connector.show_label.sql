-- Name: desk_com_connector.show_label
-- Created: 2015-08-10 15:23:29

CREATE virtual procedure desk_com_connector.show_label (
    in in_label_id string
) RETURNS (
    "idColumn" integer
    ,"id" string
    ,"name" string
    ,"types" string
    ,"description" string
    ,"enabled" string
    ,"color" string
) as
begin
    call "desk_com_connector.internal_validateServerVersion" (
    ) ;
    SELECT
            "xml_table.idColumn"
            ,"xml_table.id"
            ,"xml_table.name"
            ,"xml_table.types"
            ,"xml_table.description"
            ,"xml_table.enabled"
            ,"xml_table.color"
        FROM
            (
                exec "desk_com_ws".invokeHTTP (
                    action => 'GET'
                    ,requestContentType => 'application/json'
                    ,endpoint => 'labels/' || in_label_id
                )
            ) w
            ,XMLTABLE (
                XMLNAMESPACES (
                    'http://www.w3.org/2001/XMLSchema-instance' as "xsi"
                )
                ,'//types' PASSING JSONTOXML (
                    'root'
                    ,to_chars (
                        w.result
                        ,'UTF-8'
                    )
                ) COLUMNS "idColumn" FOR ORDINALITY
                ,"id" STRING PATH '../id'
                ,"name" STRING PATH '../name'
                ,"types" STRING PATH '.'
                ,"description" STRING PATH '../description'
                ,"enabled" STRING PATH '../enabled'
                ,"color" STRING PATH '../color'
            ) "xml_table" ;
end


