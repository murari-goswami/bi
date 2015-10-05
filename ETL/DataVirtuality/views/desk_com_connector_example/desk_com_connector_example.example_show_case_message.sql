-- Name: desk_com_connector_example.example_show_case_message
-- Created: 2015-08-10 15:24:02
-- Updated: 2015-08-10 15:24:02

CREATE view desk_com_connector_example.example_show_case_message as select
        *
    from
        (
            call "desk_com_connector.show_case_message" (
                "in_case_id" => '2'
            )
        ) ww


