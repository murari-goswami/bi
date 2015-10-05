-- Name: desk_com_connector_example.get_list_cases_wo_pagination
-- Created: 2015-08-10 15:24:18
-- Updated: 2015-08-10 15:24:18

CREATE view desk_com_connector_example.get_list_cases_wo_pagination as select
        *
    from
        (
            call "desk_com_connector.get_list_cases_wo_pagination" (
                "in_pade_num" => 1
                ,"in_page_size" => 100
            )
        ) ii


