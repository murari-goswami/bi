-- Name: desk_com_connector_example.example_get_list_users_mobile_devices
-- Created: 2015-08-10 15:24:26
-- Updated: 2015-08-10 15:24:26

create view "desk_com_connector_example"."example_get_list_users_mobile_devices" as select
        *
    from
        ( call "desk_com_connector.get_list_users_mobile_devices" ( "in_user_id" => '21674781' ) ) ee


