-- Name: desk_com_connector_example.example_list_companies
-- Created: 2015-08-10 15:24:18
-- Updated: 2015-08-10 15:24:18

CREATE view desk_com_connector_example.example_list_companies as 
select
        *
    from
        ( call "desk_com_connector.get_list_companies" ( ) ) df


