-- Name: desk_com_connector_example.example_get_list_filters
-- Created: 2015-08-10 15:24:05
-- Updated: 2015-08-10 15:24:05

CREATE view "desk_com_connector_example"."example_get_list_filters" as 
select
        *
    from
        (
            call "desk_com_connector.get_list_filters" ()) dd


