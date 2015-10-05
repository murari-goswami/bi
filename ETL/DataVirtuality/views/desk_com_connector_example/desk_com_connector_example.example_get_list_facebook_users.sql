-- Name: desk_com_connector_example.example_get_list_facebook_users
-- Created: 2015-08-10 15:24:21
-- Updated: 2015-08-10 15:24:21

CREATE view "desk_com_connector_example"."example_get_list_facebook_users" as select
        *
    from
        ( call "desk_com_connector.get_list_facebook_users" ( ) ) s


