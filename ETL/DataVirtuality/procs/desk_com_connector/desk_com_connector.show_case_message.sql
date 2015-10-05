-- Name: desk_com_connector.show_case_message
-- Created: 2015-08-10 15:23:19

CREATE virtual procedure desk_com_connector.show_case_message (
    in in_case_id string
) RETURNS (
    "idColumn" integer
    ,"id" string
    ,"created_at" string
    ,"updated_at" string
    ,"erased_at" string
    ,"hidden_by" string
    ,"hidden_at" string
    ,"sent_at" string
    ,"body" string
    ,"from" string
    ,"to" string
    ,"cc" string
    ,"bcc" string
    ,"client_type" string
    ,"direction" string
    ,"status" string
    ,"subject" string
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
    SELECT
            "xml_table.idColumn"
            ,"xml_table.id"
            ,"xml_table.created_at"
            ,"xml_table.updated_at"
            ,"xml_table.erased_at"
            ,"xml_table.hidden_by"
            ,"xml_table.hidden_at"
            ,"xml_table.sent_at"
            ,"xml_table.body"
            ,"xml_table.from"
            ,"xml_table.to"
            ,"xml_table.cc"
            ,"xml_table.bcc"
            ,"xml_table.client_type"
            ,"xml_table.direction"
            ,"xml_table.status"
            ,"xml_table.subject"
            ,"xml_table.hidden"
        FROM
            (
                exec "desk_com_ws".invokeHTTP (
                    action => 'GET'
                    ,requestContentType => 'application/json'
                    ,endpoint => 'cases/' || in_case_id || '/message'
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
                ,"created_at" STRING PATH 'created_at'
                ,"updated_at" STRING PATH 'updated_at'
                ,"erased_at" STRING PATH 'erased_at'
                ,"hidden_by" STRING PATH 'hidden_by'
                ,"hidden_at" STRING PATH 'hidden_at'
                ,"sent_at" STRING PATH 'sent_at'
                ,"body" STRING PATH 'body'
                ,"from" STRING PATH 'from'
                ,"to" STRING PATH 'to'
                ,"cc" STRING PATH 'cc'
                ,"bcc" STRING PATH 'bcc'
                ,"client_type" STRING PATH 'client_type'
                ,"direction" STRING PATH 'direction'
                ,"status" STRING PATH 'status'
                ,"subject" STRING PATH 'subject'
                ,"hidden" STRING PATH 'hidden'
            ) "xml_table" ;
end


