-- Name: desk_com_connector_example.example_get_list_customers
-- Created: 2015-08-10 15:24:19
-- Updated: 2015-08-10 15:24:19

CREATE view desk_com_connector_example.example_get_list_customers as 
select
        *
    from
        ( call "desk_com_connector.get_list_customers" ( ) ) oo


