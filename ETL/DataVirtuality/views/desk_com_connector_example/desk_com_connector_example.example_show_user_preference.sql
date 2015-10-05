-- Name: desk_com_connector_example.example_show_user_preference
-- Created: 2015-08-10 15:24:15
-- Updated: 2015-08-10 15:24:15

create view "desk_com_connector_example"."example_show_user_preference" as select
        *
    from
        (
            call "desk_com_connector.show_user_preference" (
                "in_user_id" => '23129264'
                ,"in_pref_id" => '1001'
            )
        ) ss


