-- Name: desk_com_connector_example.example_show_filter
-- Created: 2015-08-10 15:24:06
-- Updated: 2015-08-10 15:24:06

create view "desk_com_connector_example"."example_show_filter" as select
        *
    from
        (
            call "desk_com_connector.show_filter" (
                "in_filter_id" => '2368287'
            )
        ) aa


