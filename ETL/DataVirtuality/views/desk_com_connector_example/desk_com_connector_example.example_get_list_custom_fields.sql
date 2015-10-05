-- Name: desk_com_connector_example.example_get_list_custom_fields
-- Created: 2015-08-10 15:24:17
-- Updated: 2015-08-10 15:24:17

create view "desk_com_connector_example"."example_get_list_custom_fields" as select
        *
    from
        (
            call "desk_com_connector.get_list_custom_fields" ()) dd


