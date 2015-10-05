-- Name: desk_com_connector_example.example_get_list_twitter_users
-- Created: 2015-08-10 15:24:25
-- Updated: 2015-08-10 15:24:25

CREATE view desk_com_connector_example.example_get_list_twitter_users as select
        *
    from
        ( call "desk_com_connector.get_list_twitter_users" ( ) ) ss


