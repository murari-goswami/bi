-- Name: desk_com_connector_example.example_list_cases4
-- Created: 2015-08-10 15:24:28
-- Updated: 2015-08-10 15:24:28

CREATE view desk_com_connector_example.example_list_cases4 as 
select
        *
    from
        ( call "desk_com_connector.cases_dwh_update" ( "dwh_table" => 'dwh.table_list_cases4' ) ) ii


