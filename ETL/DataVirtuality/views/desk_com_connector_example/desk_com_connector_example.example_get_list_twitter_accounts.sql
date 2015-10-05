-- Name: desk_com_connector_example.example_get_list_twitter_accounts
-- Created: 2015-08-10 15:24:25
-- Updated: 2015-08-10 15:24:25

CREATE view desk_com_connector_example.example_get_list_twitter_accounts as select
        *
    from
        ( call "desk_com_connector.get_list_twitter_accounts" ( ) ) ss


