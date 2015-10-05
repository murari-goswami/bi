-- Name: desk_com_connector.show_brand
-- Created: 2015-08-10 15:23:51

create virtual procedure desk_com_connector.show_brand (
    in in_brand_id string
) RETURNS (
    "id" string
    ,"total_entries" string
    ,"page" string
    ,"name" string
    ,"created_at" string
    ,"updated_at" string
) as
begin
    call "desk_com_connector.internal_validateServerVersion" (
    ) ;
    if (
        (
            in_brand_id is null
        )
        or (
            in_brand_id = ''
        )
    ) error '
    
    Please, set all parameters in procedure to NOT NULL.' ;
    declare string endpointstring = 'brands/' || in_brand_id ;
    SELECT
            "xml_table.id"
            ,"xml_table.total_entries"
            ,"xml_table.page"
            ,"xml_table.name"
            ,"xml_table.created_at"
            ,"xml_table.updated_at"
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
                ,"total_entries" STRING PATH '../../total_entries'
                ,"page" STRING PATH '../../page'
                ,"name" STRING PATH 'name'
                ,"created_at" STRING PATH 'created_at'
                ,"updated_at" STRING PATH 'updated_at'
            ) "xml_table" ;
end


