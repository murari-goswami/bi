-- Name: desk_com_connector_example.example_show_topics_translation
-- Created: 2015-08-10 15:24:11
-- Updated: 2015-08-10 15:24:11

CREATE view desk_com_connector_example.example_show_topics_translation as select
        *
    from
        (
            call "desk_com_connector.show_topics_translation" (
                "in_topic_id" => '786247'
                ,"in_locale" => 'en'
            )
        ) ss


