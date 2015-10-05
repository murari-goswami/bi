-- Name: desk_com_connector_example.example_show_macros_action
-- Created: 2015-08-10 15:24:08
-- Updated: 2015-08-10 15:24:08

create view "desk_com_connector_example"."example_show_macros_action" as select
        *
    from
        (
            call "desk_com_connector.show_macros_action" (
                "in_macros_id" => '1406171'
                ,"in_action_id" => '49795431'
            )
        ) d


