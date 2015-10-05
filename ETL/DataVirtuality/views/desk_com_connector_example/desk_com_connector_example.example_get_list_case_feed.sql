-- Name: desk_com_connector_example.example_get_list_case_feed
-- Created: 2015-08-10 15:24:03
-- Updated: 2015-08-10 15:24:03

CREATE view "desk_com_connector_example"."example_get_list_case_feed" as 
select
        *
    from
        (
            call "desk_com_connector.get_list_case_feed"(
                "in_case_id" => '606'
            )) ss


