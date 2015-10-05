-- Name: raw.desk_com_update_list_cases_inc_dwh
-- Created: 2015-06-25 21:22:30

CREATE VIRTUAL PROCEDURE raw.desk_com_update_list_cases_inc_dwh(
) 
AS 
BEGIN
EXEC desk_com_connector.get_list_cases (
    in_since_id => (
        select
                max (id)
            from
                dwh.desk_raw_cases
    )
    ,dwh_table => 'dwh.desk_raw_cases'
);
END


