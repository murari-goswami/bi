-- Name: desk_com_connector_example.example_show_mailbox_inbound
-- Created: 2015-08-10 15:24:07
-- Updated: 2015-08-10 15:24:07

create view "desk_com_connector_example"."example_show_mailbox_inbound" as select
        *
    from
        (
            call "desk_com_connector.show_mailbox_inbound" (
                "in_mailbox_id" => '122661'
            )
        ) aa


