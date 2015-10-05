-- Name: desk_com_connector_example.example_show_user
-- Created: 2015-08-10 15:24:11
-- Updated: 2015-08-10 15:24:11

create view "desk_com_connector_example"."example_show_user" as select
        *
    from
        (
            call "desk_com_connector.show_user" (
                "in_user_id" => '23129264'
            )
        ) ss


