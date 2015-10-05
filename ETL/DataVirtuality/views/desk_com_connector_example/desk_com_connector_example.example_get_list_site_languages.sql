-- Name: desk_com_connector_example.example_get_list_site_languages
-- Created: 2015-08-10 15:24:09
-- Updated: 2015-08-10 15:24:09

CREATE view desk_com_connector_example.example_get_list_site_languages as 
select
        *
    from
        (
            call "desk_com_connector.get_list_site_languages" ()) ff


