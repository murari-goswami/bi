-- Name: desk_com_connector.show_twitter_account_tweet
-- Created: 2015-08-10 15:23:58

create virtual procedure desk_com_connector.show_twitter_account_tweet (
    in in_twit_acc_id string
    ,in in_twit_id string
) RETURNS (
    "id" string
    ,"body" string
    ,"direction" string
    ,"type" string
    ,"status" string
    ,"to" string
    ,"from" string
    ,"created_at" string
    ,"updated_at" string
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
            in_twit_id is null
        )
        or (
            in_twit_id = ''
        )
    ) error '
    
    Please, set all parameters in procedure to NOT NULL.' ;
    declare string endpointstring = 'twitter_accounts/' || in_twit_acc_id || '/tweets/' || in_twit_id ;
    SELECT
            "xml_table.id"
            ,"xml_table.body"
            ,"xml_table.direction"
            ,"xml_table.type"
            ,"xml_table.status"
            ,"xml_table.to"
            ,"xml_table.from"
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
                ,'//entries' PASSING JSONTOXML (
                    'root'
                    ,to_chars (
                        w.result
                        ,'UTF-8'
                    )
                ) COLUMNS "id" STRING PATH 'id'
                ,"body" STRING PATH 'body'
                ,"direction" STRING PATH 'direction'
                ,"type" STRING PATH 'type'
                ,"status" STRING PATH 'status'
                ,"to" STRING PATH 'to'
                ,"from" STRING PATH 'from'
                ,"created_at" STRING PATH 'created_at'
                ,"updated_at" STRING PATH 'updated_at'
            ) "xml_table" ;
end


