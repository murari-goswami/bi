-- Name: desk_com_connector_example.example_get_list_user_preferences
-- Created: 2015-08-10 15:24:15
-- Updated: 2015-08-10 15:24:15

CREATE view "desk_com_connector_example"."example_get_list_user_preferences" as 
select
        *
    from
        (
            call "desk_com_connector.get_list_user_preferences" (
                "in_user_id" => '21674781'
            )
        ) ss


