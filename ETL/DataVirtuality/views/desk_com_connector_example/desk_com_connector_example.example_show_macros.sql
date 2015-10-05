-- Name: desk_com_connector_example.example_show_macros
-- Created: 2015-08-10 15:24:08
-- Updated: 2015-08-10 15:24:08

CREATE view "desk_com_connector_example"."example_show_macros" as select
        *
    from
        (
            call "desk_com_connector.show_macros" (
                "in_macros_id" => '1458957'
            )
        ) aa


