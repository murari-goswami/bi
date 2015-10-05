-- Name: desk_com_connector_example.example_show_translations_article
-- Created: 2015-08-10 15:24:01
-- Updated: 2015-08-10 15:24:01

CREATE view desk_com_connector_example.example_show_translations_article as select
        *
    from
        (
            call "desk_com_connector.show_translations_article" (
                "in_article_id" => '1947938'
                ,"in_locale" => 'en'
            )
        ) dd


