-- Name: desk_com_connector_example.example_get_list_snippets
-- Created: 2015-08-10 15:24:10
-- Updated: 2015-08-10 15:24:10

CREATE view desk_com_connector_example.example_get_list_snippets as 
select
        *
    from
        (
            call "desk_com_connector.get_list_snippets" ()) kk


