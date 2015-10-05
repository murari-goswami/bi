-- Name: desk_com_connector_example.example_show_site_language
-- Created: 2015-08-10 15:24:10
-- Updated: 2015-08-10 15:24:10

create view desk_com_connector_example.example_show_site_language as select
        *
    from
        (
            call "desk_com_connector.show_site_language" (
                "in_lang_id" => 'en'
            )
        ) ff


