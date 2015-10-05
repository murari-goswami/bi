-- Name: desk_com_connector.show_user
-- Created: 2015-08-10 15:23:34

CREATE virtual procedure desk_com_connector.show_user (
    in in_user_id string
) RETURNS (
    "idColumn" integer
    ,"id" string
    ,"name" string
    ,"email" string
    ,"created_at" string
    ,"updated_at" string
    ,"current_login_at" string
    ,"last_login_at" string
    ,"level" string
    ,"email_verified" string
    ,"public_name" string
    ,"avatar" string
    ,"available" string
) as
begin
    call "desk_com_connector.internal_validateServerVersion" (
    ) ;
    SELECT
            "xml_table.idColumn"
            ,"xml_table.id"
            ,"xml_table.name"
            ,"xml_table.email"
            ,"xml_table.created_at"
            ,"xml_table.updated_at"
            ,"xml_table.current_login_at"
            ,"xml_table.last_login_at"
            ,"xml_table.level"
            ,"xml_table.email_verified"
            ,"xml_table.public_name"
            ,"xml_table.avatar"
            ,"xml_table.available"
        FROM
            (
                exec "desk_com_ws".invokeHTTP (
                    action => 'GET'
                    ,requestContentType => 'application/json'
                    ,endpoint => 'users/' || in_user_id
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
                ,"name" STRING PATH 'name'
                ,"email" STRING PATH 'email'
                ,"created_at" STRING PATH 'created_at'
                ,"updated_at" STRING PATH 'updated_at'
                ,"current_login_at" STRING PATH 'current_login_at'
                ,"last_login_at" STRING PATH 'last_login_at'
                ,"level" STRING PATH 'level'
                ,"email_verified" STRING PATH 'email_verified'
                ,"public_name" STRING PATH 'public_name'
                ,"avatar" STRING PATH 'avatar'
                ,"available" STRING PATH 'available'
            ) "xml_table" ;
end


