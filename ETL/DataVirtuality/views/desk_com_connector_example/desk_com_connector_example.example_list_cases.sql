-- Name: desk_com_connector_example.example_list_cases
-- Created: 2015-08-10 15:24:01
-- Updated: 2015-08-10 15:24:01

CREATE view desk_com_connector_example.example_list_cases as select
        *
    from
        ( call "desk_com_connector.get_list_cases" ( "dwh_table" => 'dwh.table_list_cases4' ) ) ss


