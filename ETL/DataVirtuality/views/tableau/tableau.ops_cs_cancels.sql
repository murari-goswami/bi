-- Name: tableau.ops_cs_cancels
-- Created: 2015-06-09 10:04:39
-- Updated: 2015-06-15 16:42:23

CREATE VIEW tableau.ops_cs_cancels AS

WITH cs AS
(
SELECT
	co.date_created,
	co.date_cancelled,
	CASE 
		WHEN cos.customer_support_reason =    'Datenlöschung' 					THEN 1
		WHEN cos.customer_support_reason LIKE 'Doch kein Bedarf mehr%' 			THEN 1
		WHEN cos.customer_support_reason LIKE 'Storno irrtümliche Bestellung%' 	THEN 1
	END AS cs_cancel
FROM
	raw.customer_order_salesforce AS cos
	JOIN
	bi.customer_order AS co
		ON cos.order_id = co.order_id
WHERE
	co.date_created >= '2014-01-01'
)

SELECT
	CAST(date_created AS DATE) AS date_created,
	COUNT(*) AS orders,
	SUM(cs_cancel) AS cs_cancels,
	SUM(CASE
			WHEN cs_cancel IS NOT NULL THEN TIMESTAMPDIFF(SQL_TSI_DAY,date_created,date_cancelled)
		END) AS total_days_to_cancel
FROM
	cs
GROUP BY 1


/*
SELECT
	CAST(co.date_created AS DATE) date_created,
	COUNT(*) AS orders,
	SUM(CASE 
			WHEN cos.customer_support_reason =    'Datenlöschung' 					THEN 1
			WHEN cos.customer_support_reason LIKE 'Doch kein Bedarf mehr%' 			THEN 1
			WHEN cos.customer_support_reason LIKE 'Storno irrtümliche Bestellung%' 	THEN 1
			ELSE 0
		END) AS cs_cancels
FROM 
	raw.customer_order_salesforce AS cos
	JOIN
	bi.customer_order AS co
		ON cos.order_id = co.order_id
GROUP BY 1
*/


