-- Name: desk_com_connector.get_list_translation_article
-- Created: 2015-08-10 15:23:44

CREATE virtual procedure desk_com_connector.get_list_translation_article ( IN in_since_id integer, in in_article_id string ) RETURNS ( "id" integer, "subject" string, "body" string, "body_email" string, "body_email_auto" string, "body_chat" string, "body_twitter" string, "body_qna" string, "body_phone" string, "body_facebook" string, "quickcode" string, "publish_at" timestamp, "updated_at" timestamp, "created_at" timestamp, "public_url" string, "body_chat_auto" string, "body_web_callback" string, "body_web_callback_auto" string, "body_twitter_auto" string, "body_qna_auto" string, "body_phone_auto" string, "rating" string, "rating_count" string, "rating_score" string, "keywords" string, "position" string, "in_support_center" string, "internal_notes" string, "total_entries" string, "page" string ) as
begin
    call "desk_com_connector.internal_validateServerVersion" ( ) ;
    if ( ( in_article_id is null )
    or ( in_article_id = '' ) ) error '
    
    Please, set all parameters in procedure to NOT NULL.' ;
    declare integer PagesCountLimit = 501 ;
    declare integer PageNum = 1 ;
    declare long records_processed = 0 ;
    declare integer records_processed2 = 0 ;
    declare integer totalrecords ;
    declare integer totalrecords2 ;
    declare double pagescount ;
    declare double mod_val ;
    declare integer i = 1 ;
    declare integer querrycount ;
    declare integer CurrentPage = 1 ;
    declare integer PageSize = 50 ;
    declare boolean page_limit_exceeded = false ;
    declare string internal_since_id = 0 ;
    declare string internal_since___id = 0 ;
    DECLARE integer tmpMaxID = null ;
    CREATE LOCAL TEMPORARY TABLE TabTmpMax ( c integer ) ;
    CREATE LOCAL TEMPORARY TABLE tmpTable ( "id" integer, "subject" string, "body" string, "body_email" string, "body_email_auto" string, "body_chat" string, "body_twitter" string, "body_qna" string, "body_phone" string, "body_facebook" string, "quickcode" string, "publish_at" timestamp, "updated_at" timestamp, "created_at" timestamp, "public_url" string, "body_chat_auto" string, "body_web_callback" string, "body_web_callback_auto" string, "body_twitter_auto" string, "body_qna_auto" string, "body_phone_auto" string, "rating" string, "rating_count" string, "rating_score" string, "keywords" string, "position" string, "in_support_center" string, "internal_notes" string, "total_entries" string, "page" string ) ;
    declare string endpointstring = 'articles' || '/' || in_article_id || '/translations?page=' || CurrentPage || '&per_page=' || PageSize || '&sort_field=created_at&sort_direction=asc' ;
    totalrecords = SELECT
            "xml_table.total_entries"
        FROM
            ( exec "desk_com_ws".invokeHTTP ( action => 'GET', requestContentType => 'application/json', endpoint => 'articles' || '/' || in_article_id || '/translations?sort_field=created_at&sort_direction=asc&since_id=' || internal_since___id ) ) w
            , XMLTABLE ( XMLNAMESPACES ( 'http://www.w3.org/2001/XMLSchema-instance' as "xsi" ), '//root' PASSING JSONTOXML ( 'root', to_chars ( w.result, 'UTF-8' ) ) COLUMNS "total_entries" INTEGER PATH 'total_entries' ) "xml_table" ;
    IF ( in_since_id IS NOT NULL )
    BEGIN
        internal_since_id = '&since_id=' || in_since_id ;
        endpointstring = 'articles' || '/' || in_article_id || '/translations?page=' || CurrentPage || '&per_page=' || PageSize || '&sort_field=created_at&sort_direction=asc' || NVL ( internal_since_id, '' ) ;
    END
    else internal_since_id = '&since_id=' || 0 ;
    if ( totalrecords > 0 )
    begin
        pagescount = cast ( totalrecords as double ) / PageSize ;
        mod_val = pagescount - floor ( pagescount ) ;
        querrycount = round ( cast ( pagescount as integer ), 0 ) + 1 ;
        exec "SYSADMIN.logMsg" ( "level" => 'INFO', "context" => 'org.teiid.PROCESSOR', "msg" => '[desk_com_connector.get_list_translation_article] Max Pages to get: ' || querrycount ) ;
        while ( i <= querrycount )
        begin
            if ( ( in_since_id is not null )
            and ( i = 1 ) )
            begin
                totalrecords2 = totalrecords ;
                records_processed2 = i * PageSize ;
            end
            else if ( ( in_since_id is not null )
            and ( i > 1 ) )
            begin
                records_processed2 = i * PageSize ;
            end
            IF ( ( NOT page_limit_exceeded )
            and ( ( in_since_id IS NULL )
            or ( in_since_id = 0 ) ) )
            BEGIN
                if ( ( totalrecords - cast ( cast ( records_processed as string ) as integer ) ) < PageSize )
                begin
                    PageSize = ( totalrecords - cast ( cast ( records_processed as string ) as integer ) ) ;
                end
                endpointstring = 'articles' || '/' || in_article_id || '/translations?page=' || PageNum || '&per_page=' || PageSize || '&sort_field=created_at&sort_direction=asc' || NVL ( internal_since_id, '' ) ;
                PageNum = PageNum + 1 ;
            END
            else
            begin
                if ( tmpMaxID is null )
                begin
                    endpointstring = 'articles' || '/' || in_article_id || '/translations?page=' || PageNum || '&per_page=' || PageSize || '&sort_field=created_at&sort_direction=asc' || NVL ( internal_since_id, '' ) ;
                end
                else
                begin
                    endpointstring = 'articles' || '/' || in_article_id || '/translations?page=' || PageNum || '&per_page=' || PageSize || '&sort_field=created_at&sort_direction=asc&since_id=' || tmpMaxID ;
                end
                PageNum = PageNum + 1 ;
            end
            exec "SYSADMIN.logMsg" ( "level" => 'INFO', "context" => 'org.teiid.PROCESSOR', "msg" => '[desk_com_connector.get_list_translation_article] Executing "' || endpointstring || '"' ) ;
            INSERT
                INTO tmpTable SELECT
                        "xml_table.id"
                        , substring ( "xml_table.subject", 1, 4000 ) as subject
                        , substring ( "xml_table.body", 1, 4000 ) as body
                        , "xml_table.body_email"
                        , "xml_table.body_email_auto"
                        , "xml_table.body_chat"
                        , "xml_table.body_twitter"
                        , "xml_table.body_qna"
                        , "xml_table.body_phone"
                        , "xml_table.body_facebook"
                        , "xml_table.quickcode"
                        , PARSETIMESTAMP ( NULLIF ( "xml_table.publish_at", '' ), 'yyyy-MM-dd''T''hh:mm:ssX' ) as "publish_at"
                        , PARSETIMESTAMP ( NULLIF ( "xml_table.updated_at", '' ), 'yyyy-MM-dd''T''hh:mm:ssX' ) as "updated_at"
                        , PARSETIMESTAMP ( NULLIF ( "xml_table.created_at", '' ), 'yyyy-MM-dd''T''hh:mm:ssX' ) as "created_at"
                        , "xml_table.public_url"
                        , "xml_table.body_chat_auto"
                        , "xml_table.body_web_callback"
                        , "xml_table.body_web_callback_auto"
                        , "xml_table.body_twitter_auto"
                        , "xml_table.body_qna_auto"
                        , "xml_table.body_phone_auto"
                        , "xml_table.rating"
                        , "xml_table.rating_count"
                        , "xml_table.rating_score"
                        , "xml_table.keywords"
                        , "xml_table.position"
                        , "xml_table.in_support_center"
                        , "xml_table.internal_notes"
                        , "xml_table.total_entries"
                        , "xml_table.page"
                    FROM
                        ( exec "desk_com_ws".invokeHTTP ( action => 'GET', requestContentType => 'application/json', endpoint => endpointstring ) ) w
                        , XMLTABLE ( XMLNAMESPACES ( 'http://www.w3.org/2001/XMLSchema-instance' as "xsi" ), '//entries' PASSING JSONTOXML ( 'root', to_chars ( w.result, 'UTF-8' ) ) COLUMNS "id" integer PATH 'id', "subject" STRING PATH 'subject', "body" STRING PATH 'body', "body_email" STRING PATH 'body_email', "body_email_auto" STRING PATH 'body_email_auto', "body_chat" STRING PATH 'body_chat', "body_twitter" STRING PATH 'body_twitter', "body_qna" STRING PATH 'body_qna', "body_phone" STRING PATH 'body_phone', "body_facebook" STRING PATH 'body_facebook', "quickcode" STRING PATH 'quickcode', "publish_at" STRING PATH 'publish_at', "updated_at" STRING PATH 'updated_at', "created_at" STRING PATH 'created_at', "public_url" STRING PATH 'public_url', "body_chat_auto" STRING PATH 'body_chat_auto', "body_web_callback" STRING PATH 'body_web_callback', "body_web_callback_auto" STRING PATH 'body_web_callback_auto', "body_twitter_auto" STRING PATH 'body_twitter_auto', "body_qna_auto" STRING PATH 'body_qna_auto', "body_phone_auto" STRING PATH 'body_phone_auto', "rating" STRING PATH 'rating', "rating_count" STRING PATH 'rating_count', "rating_score" STRING PATH 'rating_score', "keywords" STRING PATH 'keywords', "position" STRING PATH 'position', "in_support_center" STRING PATH 'in_support_center', "internal_notes" STRING PATH 'internal_notes', "total_entries" STRING PATH '../../total_entries', "page" STRING PATH '../../page' ) "xml_table" ;
            if ( PageNum = PagesCountLimit )
            BEGIN
                page_limit_exceeded = true ;
                PageNum = 1 ;
                DELETE
                    FROM
                        TabTmpMax ;
                EXECUTE IMMEDIATE 'INSERT INTO TabTmpMax SELECT max ( id ) FROM tmpTable;' WITHOUT RETURN ;
                tmpMaxID = select
                        c
                    from
                        TabTmpMax ;
            END
            IF ( in_since_id IS NOT NULL )
            BEGIN
                if ( ( totalrecords2 - records_processed2 ) < PageSize ) PageSize = totalrecords2 - records_processed2 ;
                exec "SYSADMIN.logMsg" ( "level" => 'INFO', "context" => 'org.teiid.PROCESSOR', "msg" => '[desk_com_connector.get_list_translation_article] Totalrecords from get_list_translation_article are ' || totalrecords || '.
        Processed records are ' || records_processed2 ) ;
            end
            else
            BEGIN
                if ( totalrecords - cast ( cast ( records_processed as string ) as integer ) < PageSize ) PageSize = totalrecords - cast ( cast ( records_processed as string ) as integer ) ;
                records_processed = SELECT
                        count ( * )
                    FROM
                        tmpTable ;
                exec "SYSADMIN.logMsg" ( "level" => 'INFO', "context" => 'org.teiid.PROCESSOR', "msg" => '[desk_com_connector.get_list_translation_article] Totalrecords from get_list_translation_article are ' || totalrecords || '.
        Processed records are ' || records_processed ) ;
            end
            i = i + 1 ;
        end
        select
                *
            from
                tmpTable ;
    end
end


