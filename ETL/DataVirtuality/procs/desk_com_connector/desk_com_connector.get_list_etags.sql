-- Name: desk_com_connector.get_list_etags
-- Created: 2015-08-10 15:23:24

CREATE virtual procedure desk_com_connector.get_list_etags (
) RETURNS (
    "idColumn" integer
    ,"endpoint" string
    ,"value" string
    ,"total_entries" string
    ,"page" string
) as
begin
    call "desk_com_connector.internal_validateServerVersion" (
    ) ;
    SELECT
            "xml_table.idColumn"
            ,"xml_table.endpoint"
            ,"xml_table.value"
            ,"xml_table.total_entries"
            ,"xml_table.page"
        FROM
            (
                exec "desk_com_ws".invokeHTTP (
                    action => 'GET'
                    ,requestContentType => 'application/json'
                    ,endpoint => 'etags?endpoints=users,groups,labels,macros'
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
                ,"endpoint" STRING PATH 'endpoint'
                ,"value" STRING PATH 'value'
                ,"total_entries" STRING PATH '../../total_entries'
                ,"page" STRING PATH '../../page'
            ) "xml_table" ;
end


