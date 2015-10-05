-- Name: desk_com_connector.show_site_language
-- Created: 2015-08-10 15:23:32

CREATE virtual procedure desk_com_connector.show_site_language (
    in in_lang_id string
) RETURNS (
    "idColumn" integer
    ,"id" string
    ,"name" string
    ,"customer" string
    ,"is_case_default" string
    ,"agent" string
    ,"case" string
) as
begin
    call "desk_com_connector.internal_validateServerVersion" (
    ) ;
    SELECT
            "xml_table.idColumn"
            ,"xml_table.id"
            ,"xml_table.name"
            ,"xml_table.customer"
            ,"xml_table.is_case_default"
            ,"xml_table.agent"
            ,"xml_table.case"
        FROM
            (
                exec "desk_com_ws".invokeHTTP (
                    action => 'GET'
                    ,requestContentType => 'application/json'
                    ,endpoint => 'site/languages/' || in_lang_id
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
                ,"customer" STRING PATH 'customer'
                ,"is_case_default" STRING PATH 'is_case_default'
                ,"agent" STRING PATH 'agent'
                ,"case" STRING PATH 'case'
            ) "xml_table" ;
end


