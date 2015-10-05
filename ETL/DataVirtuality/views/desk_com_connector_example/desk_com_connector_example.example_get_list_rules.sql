-- Name: desk_com_connector_example.example_get_list_rules
-- Created: 2015-08-10 15:24:23
-- Updated: 2015-08-10 15:24:23

CREATE view "desk_com_connector_example"."example_get_list_rules" as select
        *
    from
        ( call "desk_com_connector.get_list_rules" ( ) ) ff


