-- Name: desk_com_connector_example.example_show_site_setting
-- Created: 2015-08-10 15:24:09
-- Updated: 2015-08-10 15:24:09

CREATE view desk_com_connector_example.example_show_site_setting as select
        *
    from
        (
            call "desk_com_connector.show_site_setting" (
                "in_site_setting_id" => '25696881'
            )
        ) dd


