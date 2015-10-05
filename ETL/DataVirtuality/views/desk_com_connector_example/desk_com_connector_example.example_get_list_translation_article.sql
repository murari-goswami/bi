-- Name: desk_com_connector_example.example_get_list_translation_article
-- Created: 2015-08-10 15:24:25
-- Updated: 2015-08-10 15:24:25

CREATE view desk_com_connector_example.example_get_list_translation_article as select
        *
    from
        ( call "desk_com_connector.get_list_translation_article" ( "in_article_id" => '1618949' ) ) ff


