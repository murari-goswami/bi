-- Name: desk_com_connector.get_list_Facebook_feeds_Likes
-- Created: 2015-08-10 15:23:16

CREATE virtual procedure desk_com_connector.get_list_Facebook_feeds_Likes (
    in in_facebook_feed_id string
    ,in in_facebook_post_id string
) RETURNS (
    "idColumn" integer
    ,"facebook_id" string
    ,"liked_by_page" string
    ,"like_count" string
) as
begin
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
                    ,endpoint => 'facebook_feeds/' || in_facebook_feed_id || '/facebook_posts/' || in_facebook_post_id || '/likes'
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


