-- Name: desk_com_connector.show_system_message
-- Created: 2015-08-10 15:23:57

create virtual procedure desk_com_connector.show_system_message (
) RETURNS (
    "message" string
    ,"updated_at" string
) as
begin
    call "desk_com_connector.internal_validateServerVersion" (
    ) ;
    declare string endpointstring = 'system_message' ;
    SELECT
            "xml_table.message"
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
                ) COLUMNS "message" STRING PATH 'message'
                ,"updated_at" STRING PATH 'updated_at'
            ) "xml_table" ;
end


