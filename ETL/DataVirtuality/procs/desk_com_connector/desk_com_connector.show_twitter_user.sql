-- Name: desk_com_connector.show_twitter_user
-- Created: 2015-08-10 15:23:34

CREATE virtual procedure desk_com_connector.show_twitter_user (
    in in_twitter_user_id string
) RETURNS (
    "idColumn" integer
    ,"id" string
    ,"followers_count" string
    ,"verified" string
    ,"created_at" string
    ,"updated_at" string
    ,"handle" string
    ,"image_url" string
) as
begin
    call "desk_com_connector.internal_validateServerVersion" (
    ) ;
    SELECT
            "xml_table.idColumn"
            ,"xml_table.id"
            ,"xml_table.followers_count"
            ,"xml_table.verified"
            ,"xml_table.created_at"
            ,"xml_table.updated_at"
            ,"xml_table.handle"
            ,"xml_table.image_url"
        FROM
            (
                exec "desk_com_ws".invokeHTTP (
                    action => 'GET'
                    ,requestContentType => 'application/json'
                    ,endpoint => 'twitter_users/' || in_twitter_user_id
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
                ,"followers_count" STRING PATH 'followers_count'
                ,"verified" STRING PATH 'verified'
                ,"created_at" STRING PATH 'created_at'
                ,"updated_at" STRING PATH 'updated_at'
                ,"handle" STRING PATH 'handle'
                ,"image_url" STRING PATH 'image_url'
            ) "xml_table" ;
end


