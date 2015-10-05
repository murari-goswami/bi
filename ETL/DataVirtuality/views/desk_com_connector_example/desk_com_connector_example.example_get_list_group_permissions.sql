-- Name: desk_com_connector_example.example_get_list_group_permissions
-- Created: 2015-08-10 15:24:06
-- Updated: 2015-08-10 15:24:06

CREATE view "desk_com_connector_example"."example_get_list_group_permissions" as select
        *
    from
        ( call "desk_com_connector.get_list_group_permissions" ( "in_group_id" => '357346' ) ) gg


