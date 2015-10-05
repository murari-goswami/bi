-- Name: desk_com_connector.show_case_history
-- Created: 2015-08-10 15:23:22

CREATE virtual procedure desk_com_connector.show_case_history (
    in in_case_id string
) RETURNS (
    "idColumn" integer
    ,"id" string
    ,"type" string
    ,"context" string
    ,"created_at" string
    ,"total_entries" string
    ,"page" string
) as
begin
    call "desk_com_connector.internal_validateServerVersion" (
    ) ;
    SELECT
            "xml_table.idColumn"
            ,"xml_table.id"
            ,"xml_table.type"
            ,"xml_table.context"
            ,"xml_table.created_at"
            ,"xml_table.total_entries"
            ,"xml_table.page"
        FROM
            (
                exec "desk_com_ws".invokeHTTP (
                    action => 'GET'
                    ,requestContentType => 'application/json'
                    ,endpoint => 'cases/' || in_case_id || '/history'
                )
            ) w
            ,XMLTABLE (
                XMLNAMESPACES (
                    'http://www.w3.org/2001/XMLSchema-instance' as "xsi"
                )
                ,'//entries' PASSING JSONTOXML (
                    'root'
                    ,to_chars (
                        w.result
                        ,'UTF-8'
                    )
                ) COLUMNS "idColumn" FOR ORDINALITY
                ,"id" STRING PATH 'id'
                ,"type" STRING PATH 'type'
                ,"context" STRING PATH 'context'
                ,"created_at" STRING PATH 'created_at'
                ,"total_entries" STRING PATH '../../total_entries'
                ,"page" STRING PATH '../../page'
            ) "xml_table" ;
end


