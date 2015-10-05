-- Name: desk_com_connector_example.example_list_company_customers
-- Created: 2015-08-10 15:24:04
-- Updated: 2015-08-10 15:24:04

CREATE view desk_com_connector_example.example_list_company_customers as 
select
        *
    from
        (
            call "desk_com_connector.get_list_company_customers" (
                "in_company_id" => '39852364'
            )
        ) dd


