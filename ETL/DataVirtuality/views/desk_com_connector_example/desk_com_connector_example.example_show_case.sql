-- Name: desk_com_connector_example.example_show_case
-- Created: 2015-08-10 15:24:02
-- Updated: 2015-08-10 15:24:02

create view desk_com_connector_example.example_show_case as select
        *
    from
        (
            call "desk_com_connector.show_case" (
                "in_case_id" => '1'
            )
        ) ss


