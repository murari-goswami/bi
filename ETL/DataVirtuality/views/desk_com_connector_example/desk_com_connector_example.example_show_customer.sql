-- Name: desk_com_connector_example.example_show_customer
-- Created: 2015-08-10 15:24:04
-- Updated: 2015-08-10 15:24:04

CREATE view desk_com_connector_example.example_show_customer as 
select
        *
    from
        (
            call "desk_com_connector.show_customer" (
                "in_customer_id" => '343206165'
            )
        ) ss


