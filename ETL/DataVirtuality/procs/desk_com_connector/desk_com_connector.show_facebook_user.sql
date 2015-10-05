-- Name: desk_com_connector.show_facebook_user
-- Created: 2015-08-10 15:23:55

create virtual procedure desk_com_connector.show_facebook_user (
    in in_fb_user_id string
) RETURNS (
    "id" string
    ,"image_url" string
    ,"profile_url" string
    ,"created_at" string
    ,"updated_at" string
) as
begin
    call "desk_com_connector.internal_validateServerVersion" (
    ) ;
    if (
        (
            in_fb_user_id is null
        )
        or (
            in_fb_user_id = ''
        )
    ) error '
    
    Please, set all parameters in procedure to NOT NULL.' ;
    declare string endpointstring = 'facebook_users/' || in_fb_user_id ;
    SELECT
            "xml_table.id"
            ,"xml_table.image_url"
            ,"xml_table.profile_url"
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
                ,"image_url" STRING PATH 'image_url'
                ,"profile_url" STRING PATH 'profile_url'
                ,"created_at" STRING PATH 'created_at'
                ,"updated_at" STRING PATH 'updated_at'
            ) "xml_table" ;
end


