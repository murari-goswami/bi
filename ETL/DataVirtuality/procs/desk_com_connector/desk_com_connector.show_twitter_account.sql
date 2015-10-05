-- Name: desk_com_connector.show_twitter_account
-- Created: 2015-08-10 15:23:58

create virtual procedure desk_com_connector.show_twitter_account (
    in in_twit_acc_id string
) RETURNS (
    "id" string
    ,"handle" string
    ,"name" string
    ,"profile_image" string
    ,"active" string
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
    ) error '
    
    Please, set all parameters in procedure to NOT NULL.' ;
    declare string endpointstring = 'twitter_accounts/' || in_twit_acc_id ;
    SELECT
            "xml_table.id"
            ,"xml_table.handle"
            ,"xml_table.name"
            ,"xml_table.profile_image"
            ,"xml_table.active"
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
                ,"handle" STRING PATH 'handle'
                ,"name" STRING PATH 'name'
                ,"profile_image" STRING PATH 'profile_image'
                ,"active" STRING PATH 'active'
                ,"created_at" STRING PATH 'created_at'
                ,"updated_at" STRING PATH 'updated_at'
            ) "xml_table" ;
end


