-- Name: desk_com_connector_example.example_show_case_history
-- Created: 2015-08-10 15:24:03
-- Updated: 2015-08-10 15:24:03

create view "desk_com_connector_example"."example_show_case_history" as select
        *
    from
        (
            call "desk_com_connector.show_case_history" (
                "in_case_id" => '1'
            )
        ) dd


