-- Name: desk_com_connector_example.example_get_list_labels
-- Created: 2015-08-10 15:24:07
-- Updated: 2015-08-10 15:24:07

CREATE view desk_com_connector_example.example_get_list_labels as 
select
        *
    from
        (
            call "desk_com_connector.get_list_labels" ()) ss

