-- Name: desk_com_connector_example.example_list_articles
-- Created: 2015-08-10 15:24:19
-- Updated: 2015-08-10 15:24:19

CREATE view desk_com_connector_example.example_list_articles as select
        *
    from
        ( call "desk_com_connector.get_list_articles" ( "dwh_table" => 'dwh.table_list_articles' ) ) df


