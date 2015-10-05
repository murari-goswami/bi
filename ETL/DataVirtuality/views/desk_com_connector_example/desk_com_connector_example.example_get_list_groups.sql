-- Name: desk_com_connector_example.example_get_list_groups
-- Created: 2015-08-10 15:24:06
-- Updated: 2015-08-10 15:24:06

CREATE view "desk_com_connector_example"."example_get_list_groups" as 
select
        *
    from
        ( call "desk_com_connector.get_list_groups" ( ) ) ss


