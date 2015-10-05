-- Name: desk_com_connector_example.example_show_integration_url
-- Created: 2015-08-10 15:24:07
-- Updated: 2015-08-10 15:24:07

create view "desk_com_connector_example"."example_show_integration_url" as select
        *
    from
        (
            call "desk_com_connector.show_integration_url" (
                "in_url_id" => '349355'
            )
        ) ss


