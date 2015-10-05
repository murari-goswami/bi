-- Name: desk_com_connector.show_translations_article
-- Created: 2015-08-10 15:23:18

CREATE virtual procedure desk_com_connector.show_translations_article (
    in in_article_id string
    ,in in_locale string
) RETURNS (
    "idColumn" integer
    ,"id" string
    ,"locale" string
    ,"publish_at" string
    ,"created_at" string
    ,"updated_at" string
    ,"outdated" string
    ,"subject" string
    ,"body" string
    ,"body_email" string
    ,"body_email_auto" string
    ,"body_chat" string
    ,"body_chat_auto" string
    ,"body_web_callback" string
    ,"body_web_callback_auto" string
    ,"body_twitter" string
    ,"body_twitter_auto" string
    ,"body_qna" string
    ,"body_qna_auto" string
    ,"body_phone" string
    ,"body_phone_auto" string
    ,"body_facebook" string
    ,"body_facebook_auto" string
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
        or (
            in_locale is null
        )
        or (
            in_locale = ''
        )
    ) error '
    
    Please, set all parameters in procedure to NOT NULL.' ;
    SELECT
            "xml_table.idColumn"
            ,"xml_table.id"
            ,"xml_table.locale"
            ,"xml_table.publish_at"
            ,"xml_table.created_at"
            ,"xml_table.updated_at"
            ,"xml_table.outdated"
            ,"xml_table.subject"
            ,"xml_table.body"
            ,"xml_table.body_email"
            ,"xml_table.body_email_auto"
            ,"xml_table.body_chat"
            ,"xml_table.body_chat_auto"
            ,"xml_table.body_web_callback"
            ,"xml_table.body_web_callback_auto"
            ,"xml_table.body_twitter"
            ,"xml_table.body_twitter_auto"
            ,"xml_table.body_qna"
            ,"xml_table.body_qna_auto"
            ,"xml_table.body_phone"
            ,"xml_table.body_phone_auto"
            ,"xml_table.body_facebook"
            ,"xml_table.body_facebook_auto"
        FROM
            (
                exec "desk_com_ws".invokeHTTP (
                    action => 'GET'
                    ,requestContentType => 'application/json'
                    ,endpoint => 'articles/' || in_article_id || '/translations/' || in_locale
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
                ,"locale" STRING PATH 'locale'
                ,"publish_at" STRING PATH 'publish_at'
                ,"created_at" STRING PATH 'created_at'
                ,"updated_at" STRING PATH 'updated_at'
                ,"outdated" STRING PATH 'outdated'
                ,"subject" STRING PATH 'subject'
                ,"body" STRING PATH 'body'
                ,"body_email" STRING PATH 'body_email'
                ,"body_email_auto" STRING PATH 'body_email_auto'
                ,"body_chat" STRING PATH 'body_chat'
                ,"body_chat_auto" STRING PATH 'body_chat_auto'
                ,"body_web_callback" STRING PATH 'body_web_callback'
                ,"body_web_callback_auto" STRING PATH 'body_web_callback_auto'
                ,"body_twitter" STRING PATH 'body_twitter'
                ,"body_twitter_auto" STRING PATH 'body_twitter_auto'
                ,"body_qna" STRING PATH 'body_qna'
                ,"body_qna_auto" STRING PATH 'body_qna_auto'
                ,"body_phone" STRING PATH 'body_phone'
                ,"body_phone_auto" STRING PATH 'body_phone_auto'
                ,"body_facebook" STRING PATH 'body_facebook'
                ,"body_facebook_auto" STRING PATH 'body_facebook_auto'
            ) "xml_table" ;
end


