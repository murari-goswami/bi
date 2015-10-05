-- Name: desk_com_connector_example.example_show_rule
-- Created: 2015-08-10 15:24:08
-- Updated: 2015-08-10 15:24:08

create view "desk_com_connector_example"."example_show_rule" as select
        *
    from
        (
            call "desk_com_connector.show_rule" (
                "in_rules_id" => '2910966'
            )
        ) ff


