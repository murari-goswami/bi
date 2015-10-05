-- Name: desk_com_connector_example.example_get_list_user_searches
-- Created: 2015-08-10 15:24:26
-- Updated: 2015-08-10 15:24:26

create view "desk_com_connector_example"."example_get_list_user_searches" as select
        *
    from
        ( call "desk_com_connector.get_list_user_searches" ( "in_user_id" => '21674781' ) ) dd


