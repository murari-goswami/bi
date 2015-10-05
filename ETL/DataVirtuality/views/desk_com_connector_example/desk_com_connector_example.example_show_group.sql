-- Name: desk_com_connector_example.example_show_group
-- Created: 2015-08-10 15:24:06
-- Updated: 2015-08-10 15:24:06

create view "desk_com_connector_example"."example_show_group" as select
        *
    from
        (
            call "desk_com_connector.show_group" (
                "in_group_id" => '496868'
            )
        ) ff


