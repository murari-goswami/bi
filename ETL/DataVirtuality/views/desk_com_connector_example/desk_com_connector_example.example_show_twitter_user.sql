-- Name: desk_com_connector_example.example_show_twitter_user
-- Created: 2015-08-10 15:24:11
-- Updated: 2015-08-10 15:24:11

CREATE view desk_com_connector_example.example_show_twitter_user as select
        *
    from
        (
            call "desk_com_connector.show_twitter_user" (
                "in_twitter_user_id" => '18249755'
            )
        ) dd


