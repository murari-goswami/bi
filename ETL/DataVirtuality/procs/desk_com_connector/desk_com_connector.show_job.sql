-- Name: desk_com_connector.show_job
-- Created: 2015-08-10 15:23:56

create virtual procedure desk_com_connector.show_job (
    in in_job_id string
) RETURNS (
    "id" string
    ,"type" string
    ,"status_message" string
    ,"progress" string
    ,"created_at" string
    ,"completed_at" string
    ,"last_error" string
) as
begin
    call "desk_com_connector.internal_validateServerVersion" (
    ) ;
    if (
        (
            in_job_id is null
        )
        or (
            in_job_id = ''
        )
    ) error '
    
    Please, set all parameters in procedure to NOT NULL.' ;
    declare string endpointstring = 'jobs/' || in_job_id ;
    SELECT
            "xml_table.id"
            ,"xml_table.type"
            ,"xml_table.status_message"
            ,"xml_table.progress"
            ,"xml_table.created_at"
            ,"xml_table.completed_at"
            ,"xml_table.last_error"
        FROM
            (
                exec "desk_com_ws".invokeHTTP (
                    action => 'GET'
                    ,requestContentType => 'application/json'
                    ,endpoint => 'jobs'
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
                ,"type" STRING PATH 'type'
                ,"status_message" STRING PATH 'status_message'
                ,"progress" STRING PATH 'progress'
                ,"created_at" STRING PATH 'created_at'
                ,"completed_at" STRING PATH 'completed_at'
                ,"last_error" STRING PATH 'last_error'
            ) "xml_table" ;
end


