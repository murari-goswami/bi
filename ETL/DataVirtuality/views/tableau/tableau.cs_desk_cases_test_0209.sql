-- Name: tableau.cs_desk_cases_test_0209
-- Created: 2015-09-02 16:40:12
-- Updated: 2015-09-02 16:40:35

CREATE VIEW tableau.cs_desk_cases_test_0209
AS
SELECT
	ca."date",
	COALESCE(a.new_cases,0) AS new_cases,
	COALESCE(b.first_resolved,0) AS first_resolved,
	COALESCE(c.cases_resolved,0) AS cases_resolved
FROM dwh.calendar ca
LEFT JOIN
(
	SELECT 
		cast(created_at as date) as "date",
		count(distinct id) as new_cases 
	FROM "dwh.desk_raw_cases"
	GROUP BY 1
)a on a."date"=ca."date"
/*1st resolved*/
LEFT JOIN
(
	SELECT 
		cast(first_resolved_at as date) as "date",
		count(distinct id) as first_resolved 
	FROM "dwh.desk_raw_cases"
	GROUP BY 1
)b on b."date"=ca."date"
/*Cases Resolved*/
LEFT JOIN
(
	SELECT 
		cast(resolved_at as date) as "date",
		count(distinct id) as cases_resolved 
	FROM "dwh.desk_raw_cases"
	GROUP BY 1
)c on c."date"=ca."date"
WHERE ca."date"<=curdate()


