-- Name: tableau.cs_desk_cases_test_1304
-- Created: 2015-09-08 13:59:10
-- Updated: 2015-09-08 13:59:10

create VIEW tableau.cs_desk_cases_test_1304
AS
SELECT
	ca."date" as "rep_date",
	COALESCE(a.new_cases,0) AS new_cases
FROM dwh.calendar ca
LEFT JOIN
(
	SELECT 
		cast(created_at as date) as "rep_date",
		count(distinct id) as new_cases 
	FROM "dwh.desk_raw_cases"
	GROUP BY 1
)a on a."rep_date"=ca."date"
WHERE ca."date" <= curdate()


