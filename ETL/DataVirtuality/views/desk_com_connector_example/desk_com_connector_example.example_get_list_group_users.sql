-- Name: desk_com_connector_example.example_get_list_group_users
-- Created: 2015-08-10 15:24:27
-- Updated: 2015-08-10 15:24:27

create view "desk_com_connector_example"."example_get_list_group_users" as select
        *
    from
        ( call "desk_com_connector.get_list_group_users" ( "in_group_id" => '357346' ) ) ss


