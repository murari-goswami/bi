-- Name: desk_com_connector.show_custom_field
-- Created: 2015-08-10 15:23:36

CREATE virtual procedure desk_com_connector.show_custom_field (
    in in_field_id string
) RETURNS (
    "id" string
    ,"name" string
    ,"active" string
    ,"label" string
    ,"type" string
    ,"data_type" string
) as
begin
    call "desk_com_connector.internal_validateServerVersion" (
    ) ;
    if (
        (
            in_field_id is null
        )
        or (
            in_field_id = ''
        )
    ) error '
    
    Please, set all parameters in procedure to NOT NULL.' ;
    declare string endpointstring = 'custom_fields/' || in_field_id ;
    SELECT
            "xml_table.id"
            ,"xml_table.name"
            ,"xml_table.active"
            ,"xml_table.label"
            ,"xml_table.type"
            ,"xml_table.data_type"
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
                ,'/root/data/type' PASSING JSONTOXML (
                    'root'
                    ,to_chars (
                        w.result
                        ,'UTF-8'
                    )
                ) COLUMNS "id" STRING PATH '../../id'
                ,"name" STRING PATH '../../name'
                ,"active" STRING PATH '../../active'
                ,"label" STRING PATH '../../label'
                ,"type" STRING PATH '../../type'
                ,"data_type" STRING PATH '.'
            ) "xml_table" ;
end


