-- Name: desk_com_connector.show_company
-- Created: 2015-08-10 15:23:53

CREATE virtual procedure desk_com_connector.show_company (
    in in_company_id string
) RETURNS (
    "id" string
    ,"name" string
    ,"created_at" string
    ,"updated_at" string
    ,"domains" string
    ,"custom_fields" string
) as
begin
    call "desk_com_connector.internal_validateServerVersion" (
    ) ;
    if (
        (
            in_company_id is null
        )
        or (
            in_company_id = ''
        )
    ) error '
    
    Please, set all parameters in procedure to NOT NULL.' ;
    declare string endpointstring = 'companies/' || in_company_id ;
    SELECT
            "xml_table.id"
            ,"xml_table.name"
            ,"xml_table.created_at"
            ,"xml_table.updated_at"
            ,"xml_table.domains"
            ,"xml_table.custom_fields"
        FROM
            (
                exec "desk_com_ws".invokeHTTP (
                    action => 'GET'
                    ,requestContentType => 'application/json'
                    ,endpoint => endpointstring
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
                ) COLUMNS "id" STRING PATH 'id'
                ,"name" STRING PATH 'name'
                ,"created_at" STRING PATH 'created_at'
                ,"updated_at" STRING PATH 'updated_at'
                ,"domains" STRING PATH 'string-join(domains/text(),'', '')'
                ,"custom_fields" STRING PATH 'custom_fields'
            ) "xml_table" ;
end


