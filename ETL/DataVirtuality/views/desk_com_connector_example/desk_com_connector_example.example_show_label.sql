-- Name: desk_com_connector_example.example_show_label
-- Created: 2015-08-10 15:24:07
-- Updated: 2015-08-10 15:24:07

create view "desk_com_connector_example"."example_show_label" as select
        *
    from
        (
            call "desk_com_connector.show_label" (
                "in_label_id" => '2480512'
            )
        ) ff


