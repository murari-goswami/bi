-- Name: desk_com_connector_example.example_get_list_filter_cases
-- Created: 2015-08-10 15:24:21
-- Updated: 2015-08-10 15:24:21

CREATE view "desk_com_connector_example"."example_get_list_filter_cases" as select
        *
    from
        ( call "desk_com_connector.get_list_filter_cases" ( "in_filter_id" => '777', "dwh_table" => 'dwh.list_filter_cases' ) ) aa


