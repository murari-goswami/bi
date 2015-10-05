-- Name: desk_com_connector.get_list_case_Facebook_Likes
-- Created: 2015-08-10 15:23:48

CREATE virtual procedure desk_com_connector.get_list_case_Facebook_Likes (
    in in_case_id string
) RETURNS (
    "idColumn" integer
    ,"facebook_id" string
    ,"liked_by_page" string
    ,"like_count" string
) as
begin
    call "desk_com_connector.internal_validateServerVersion" (
    ) ;
    SELECT
            "xml_table.idColumn"
            ,"xml_table.facebook_id"
            ,"xml_table.liked_by_page"
            ,"xml_table.like_count"
        FROM
            (
                exec "desk_com_ws".invokeHTTP (
                    action => 'GET'
                    ,requestContentType => 'application/json'
                    ,endpoint => 'cases/' || in_case_id || '/message/likes'
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
                ,"facebook_id" STRING PATH 'facebook_id'
                ,"liked_by_page" STRING PATH 'liked_by_page'
                ,"like_count" STRING PATH 'like_count'
            ) "xml_table" ;
end


