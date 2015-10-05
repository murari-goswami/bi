-- Name: desk_com_connector.show_article
-- Created: 2015-08-10 15:23:17

CREATE virtual procedure desk_com_connector.show_article (
    in in_article_id string
) RETURNS (
    "idColumn" integer
    ,"id" string
    ,"subject" string
    ,"body" string
    ,"body_email" string
    ,"body_email_auto" string
    ,"body_chat" string
    ,"body_twitter" string
    ,"body_qna" string
    ,"body_phone" string
    ,"body_facebook" string
    ,"quickcode" string
    ,"publish_at" string
    ,"updated_at" string
    ,"created_at" string
    ,"public_url" string
    ,"body_chat_auto" string
    ,"body_web_callback" string
    ,"body_web_callback_auto" string
    ,"body_twitter_auto" string
    ,"body_qna_auto" string
    ,"body_phone_auto" string
    ,"rating" string
    ,"rating_count" string
    ,"rating_score" string
    ,"keywords" string
    ,"position" string
    ,"in_support_center" string
    ,"internal_notes" string
    ,"total_entries" string
    ,"page" string
) as
begin
    call "desk_com_connector.internal_validateServerVersion" (
    ) ;
    if (
        (
            in_article_id is null
        )
        or (
            in_article_id = ''
        )
    ) error '
    
    Please, set all parameters in procedure to NOT NULL.' ;
    SELECT
            "xml_table.idColumn"
            ,"xml_table.id"
            ,"xml_table.subject"
            ,"xml_table.body"
            ,"xml_table.body_email"
            ,"xml_table.body_email_auto"
            ,"xml_table.body_chat"
            ,"xml_table.body_twitter"
            ,"xml_table.body_qna"
            ,"xml_table.body_phone"
            ,"xml_table.body_facebook"
            ,"xml_table.quickcode"
            ,"xml_table.publish_at"
            ,"xml_table.updated_at"
            ,"xml_table.created_at"
            ,"xml_table.public_url"
            ,"xml_table.body_chat_auto"
            ,"xml_table.body_web_callback"
            ,"xml_table.body_web_callback_auto"
            ,"xml_table.body_twitter_auto"
            ,"xml_table.body_qna_auto"
            ,"xml_table.body_phone_auto"
            ,"xml_table.rating"
            ,"xml_table.rating_count"
            ,"xml_table.rating_score"
            ,"xml_table.keywords"
            ,"xml_table.position"
            ,"xml_table.in_support_center"
            ,"xml_table.internal_notes"
            ,"xml_table.total_entries"
            ,"xml_table.page"
        FROM
            (
                exec "desk_com_ws".invokeHTTP (
                    action => 'GET'
                    ,requestContentType => 'application/json'
                    ,endpoint => 'articles' || '/' || in_article_id
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
                ,"subject" STRING PATH 'subject'
                ,"body" STRING PATH 'body'
                ,"body_email" STRING PATH 'body_email'
                ,"body_email_auto" STRING PATH 'body_email_auto'
                ,"body_chat" STRING PATH 'body_chat'
                ,"body_twitter" STRING PATH 'body_twitter'
                ,"body_qna" STRING PATH 'body_qna'
                ,"body_phone" STRING PATH 'body_phone'
                ,"body_facebook" STRING PATH 'body_facebook'
                ,"quickcode" STRING PATH 'quickcode'
                ,"publish_at" STRING PATH 'publish_at'
                ,"updated_at" STRING PATH 'updated_at'
                ,"created_at" STRING PATH 'created_at'
                ,"public_url" STRING PATH 'public_url'
                ,"body_chat_auto" STRING PATH 'body_chat_auto'
                ,"body_web_callback" STRING PATH 'body_web_callback'
                ,"body_web_callback_auto" STRING PATH 'body_web_callback_auto'
                ,"body_twitter_auto" STRING PATH 'body_twitter_auto'
                ,"body_qna_auto" STRING PATH 'body_qna_auto'
                ,"body_phone_auto" STRING PATH 'body_phone_auto'
                ,"rating" STRING PATH 'rating'
                ,"rating_count" STRING PATH 'rating_count'
                ,"rating_score" STRING PATH 'rating_score'
                ,"keywords" STRING PATH 'keywords'
                ,"position" STRING PATH 'position'
                ,"in_support_center" STRING PATH 'in_support_center'
                ,"internal_notes" STRING PATH 'internal_notes'
                ,"total_entries" STRING PATH '../../total_entries'
                ,"page" STRING PATH '../../page'
            ) "xml_table" ;
end


