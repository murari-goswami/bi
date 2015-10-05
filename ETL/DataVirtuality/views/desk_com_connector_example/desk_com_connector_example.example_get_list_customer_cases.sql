-- Name: desk_com_connector_example.example_get_list_customer_cases
-- Created: 2015-08-10 15:24:05
-- Updated: 2015-08-10 15:24:05

CREATE view desk_com_connector_example.example_get_list_customer_cases as select
        *
    from
        ( call "desk_com_connector.get_list_customer_cases" ( "in_customer_id" => '39852364' ) ) a


