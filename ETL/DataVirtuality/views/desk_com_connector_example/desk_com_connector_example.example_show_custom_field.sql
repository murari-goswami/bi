-- Name: desk_com_connector_example.example_show_custom_field
-- Created: 2015-08-10 15:24:17
-- Updated: 2015-08-10 15:24:17

create view "desk_com_connector_example"."example_show_custom_field" as select
        *
    from
        (
            call "desk_com_connector.show_custom_field" (
                "in_field_id" => '66049'
            )
        ) dd


