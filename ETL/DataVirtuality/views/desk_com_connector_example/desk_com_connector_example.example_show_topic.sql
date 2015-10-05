-- Name: desk_com_connector_example.example_show_topic
-- Created: 2015-08-10 15:24:10
-- Updated: 2015-08-10 15:24:10

create view desk_com_connector_example.example_show_topic as select
        *
    from
        (
            call "desk_com_connector.show_topic" (
                "in_topic_id" => '786247'
            )
        ) ff


