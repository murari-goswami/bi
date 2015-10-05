-- Name: desk_com_connector_example.example_get_list_jobs
-- Created: 2015-08-10 15:24:22
-- Updated: 2015-08-10 15:24:22

CREATE view "desk_com_connector_example"."example_get_list_jobs" as select
        *
    from
        ( call "desk_com_connector.get_list_jobs" ( ) ) dd


