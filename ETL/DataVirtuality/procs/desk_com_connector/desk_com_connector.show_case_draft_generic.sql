-- Name: desk_com_connector.show_case_draft_generic
-- Created: 2015-08-10 15:23:53

create virtual procedure desk_com_connector.show_case_draft_generic (
    in in_case_id string
) RETURNS (
    "idColumn" integer
    ,"subject" string
    ,"body" string
    ,"direction" string
    ,"status" string
    ,"to" string
    ,"from" string
    ,"cc" string
    ,"bcc" string
    ,"client_type" string
    ,"created_at" string
    ,"updated_at" string
    ,"hidden_at" string
    ,"hidden" string
) as
begin
    call "desk_com_connector.internal_validateServerVersion" (
    ) ;
    if (
        (
            in_case_id is null
        )
        or (
            in_case_id = ''
        )
    ) error '
    
    Please, set all parameters in procedure to NOT NULL.' ;
    declare string endpointstring = 'cases/' || in_case_id || '/draft' ;
    SELECT
            "xml_table.idColumn"
            ,"xml_table.subject"
            ,"xml_table.body"
            ,"xml_table.direction"
            ,"xml_table.status"
            ,"xml_table.to"
            ,"xml_table.from"
            ,"xml_table.cc"
            ,"xml_table.bcc"
            ,"xml_table.client_type"
            ,"xml_table.created_at"
            ,"xml_table.updated_at"
            ,"xml_table.hidden_at"
            ,"xml_table.hidden"
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
                ,'//entries' PASSING JSONTOXML (
                    'root'
                    ,to_chars (
                        w.result
                        ,'UTF-8'
                    )
                ) COLUMNS "idColumn" FOR ORDINALITY
                ,"subject" STRING PATH 'subject'
                ,"body" STRING PATH 'body'
                ,"direction" STRING PATH 'direction'
                ,"status" STRING PATH 'status'
                ,"to" STRING PATH 'to'
                ,"from" STRING PATH 'from'
                ,"cc" STRING PATH 'cc'
                ,"bcc" STRING PATH 'bcc'
                ,"client_type" STRING PATH 'client_type'
                ,"created_at" STRING PATH 'created_at'
                ,"updated_at" STRING PATH 'updated_at'
                ,"hidden_at" STRING PATH 'hidden_at'
                ,"hidden" STRING PATH 'hidden'
            ) "xml_table" ;
end


