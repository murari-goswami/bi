-- Name: desk_com_connector_example.example_show_case_attachment
-- Created: 2015-08-10 15:24:03
-- Updated: 2015-08-10 15:24:03

create view "desk_com_connector_example"."example_show_case_attachment" as select
        *
    from
        (
            call "desk_com_connector.show_case_attachment" (
                "in_case_id" => '1'
                ,"in_attachment_id" => '110193435'
            )
        ) ss


