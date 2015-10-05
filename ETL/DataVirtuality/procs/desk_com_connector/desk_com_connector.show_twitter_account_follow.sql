-- Name: desk_com_connector.show_twitter_account_follow
-- Created: 2015-08-10 15:23:59

create virtual procedure desk_com_connector.show_twitter_account_follow (
    in in_twit_acc_id string
    ,in in_username string
) RETURNS (
    "idColumn" integer
    ,"handle" string
    ,"can_direct_message" string
) as
begin
    call "desk_com_connector.internal_validateServerVersion" (
    ) ;
    if (
        (
            in_twit_acc_id is null
        )
        or (
            in_twit_acc_id = ''
        )
        or (
            in_username is null
        )
        or (
            in_username = ''
        )
    ) error '
    
    Please, set all parameters in procedure to NOT NULL.' ;
    declare string endpointstring = 'twitter_accounts/' || in_twit_acc_id || '/follows/' || in_username ;
    SELECT
            "xml_table.idColumn"
            ,"xml_table.handle"
            ,"xml_table.can_direct_message"
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
                ) COLUMNS "idColumn" FOR ORDINALITY
                ,"handle" STRING PATH 'handle'
                ,"can_direct_message" STRING PATH 'can_direct_message'
            ) "xml_table" ;
end


