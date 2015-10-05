-- Name: desk_com_connector_example.example_get_list_topics_translations
-- Created: 2015-08-10 15:24:24
-- Updated: 2015-08-10 15:24:24

CREATE view "desk_com_connector_example"."example_get_list_topics_translations" as select
        *
    from
        ( call "desk_com_connector.get_list_topics_translations" ( "in_topic_id" => '567135' ) ) ss


