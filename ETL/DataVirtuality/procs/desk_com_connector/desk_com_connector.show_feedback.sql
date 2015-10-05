-- Name: desk_com_connector.show_feedback
-- Created: 2015-08-10 15:23:55

create virtual procedure desk_com_connector.show_feedback (
    in in_feedback_id string
) RETURNS (
    "id" string
    ,"rating" string
    ,"rating_type" string
    ,"additional_feedback" string
) as
begin
    call "desk_com_connector.internal_validateServerVersion" (
    ) ;
    if (
        (
            in_feedback_id is null
        )
        or (
            in_feedback_id = ''
        )
    ) error '
    
    Please, set all parameters in procedure to NOT NULL.' ;
    declare string endpointstring = 'feedbacks/' || in_feedback_id ;
    SELECT
            "xml_table.id"
            ,"xml_table.rating"
            ,"xml_table.rating_type"
            ,"xml_table.additional_feedback"
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
                ,"rating" STRING PATH 'rating'
                ,"rating_type" STRING PATH 'rating_type'
                ,"additional_feedback" STRING PATH 'additional_feedback'
            ) "xml_table" ;
end


