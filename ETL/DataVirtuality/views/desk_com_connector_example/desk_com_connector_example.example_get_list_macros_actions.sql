-- Name: desk_com_connector_example.example_get_list_macros_actions
-- Created: 2015-08-10 15:24:22
-- Updated: 2015-08-10 15:24:22

create view "desk_com_connector_example"."example_get_list_macros_actions" as 
select
        *
    from
        (
            call "desk_com_connector.get_list_macros_actions" (
                "in_macros_id" => '973715'
            )
        ) aa


