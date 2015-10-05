-- Name: desk_com_connector_example.example_get_list_case_replies
-- Created: 2015-08-10 15:24:02
-- Updated: 2015-08-10 15:24:02

CREATE view desk_com_connector_example.example_get_list_case_replies as 
select
        *
    from
        (
            call "desk_com_connector.get_list_case_replies" (
                "in_case_id" => '606'
            )
        ) ss


