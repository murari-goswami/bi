-- Name: desk_com_connector_example.example_get_list_users_macros
-- Created: 2015-08-10 15:24:14
-- Updated: 2015-08-10 15:24:14

CREATE view "desk_com_connector_example"."example_get_list_users_macros" as select
        *
    from
        ( call "desk_com_connector.get_list_users_macros" ( "in_user_id" => '21674781' ) ) ee


