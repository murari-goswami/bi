-- Name: desk_com_connector.show_filter
-- Created: 2015-08-10 15:23:25

CREATE virtual procedure desk_com_connector.show_filter (
    in in_filter_id string
) RETURNS (
    "idColumn" integer
    ,"id" string
    ,"name" string
    ,"sort_field" string
    ,"sort_direction" string
    ,"position" string
    ,"active" string
    ,"routing_enabled" string
) as
begin
    call "desk_com_connector.internal_validateServerVersion" (
    ) ;
    SELECT
            "xml_table.idColumn"
            ,"xml_table.id"
            ,"xml_table.name"
            ,"xml_table.sort_field"
            ,"xml_table.sort_direction"
            ,"xml_table.position"
            ,"xml_table.active"
            ,"xml_table.routing_enabled"
        FROM
            (
                exec "desk_com_ws".invokeHTTP (
                    action => 'GET'
                    ,requestContentType => 'application/json'
                    ,endpoint => 'filters/' || in_filter_id
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
                ,"sort_field" STRING PATH 'sort_field'
                ,"sort_direction" STRING PATH 'sort_direction'
                ,"position" STRING PATH 'position'
                ,"active" STRING PATH 'active'
                ,"routing_enabled" STRING PATH 'routing_enabled'
            ) "xml_table" ;
end


