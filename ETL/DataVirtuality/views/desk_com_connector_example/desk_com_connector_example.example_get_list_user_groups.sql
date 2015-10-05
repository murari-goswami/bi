-- Name: desk_com_connector_example.example_get_list_user_groups
-- Created: 2015-08-10 15:24:16
-- Updated: 2015-08-10 15:24:16

CREATE view desk_com_connector_example.example_get_list_user_groups as select
        *
    from
        (
            call "desk_com_connector.get_list_user_groups" (
                "in_user_id" => '23129264'
            )
        ) ss


