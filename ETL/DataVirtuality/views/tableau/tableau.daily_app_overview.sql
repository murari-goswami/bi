-- Name: tableau.daily_app_overview
-- Created: 2015-08-04 10:37:18
-- Updated: 2015-08-31 17:36:54

CREATE VIEW tableau.daily_app_overview
AS

SELECT
	co.date_incoming,
	co.shipping_country,
	co.incoming_app_orders,
	dl.app_installs,
	co.invoiced_orders,
	co.sales_sent_call,
	co.sales_sent_no_call
FROM
(
	SELECT
		CAST(date_incoming as date) as date_incoming,
		shipping_country,
		COUNT(order_id) as incoming_app_orders,
		COUNT(DISTINCT CASE WHEN date_invoiced IS NOT NULL THEN order_id ELSE NULL END) as invoiced_orders,
		SUM(CASE WHEN revenue_state='Final' AND box_type='Call Box' THEN sales_sent ELSE 0 END) as sales_sent_call,
		SUM(CASE WHEN revenue_state='Final' AND box_type='No Call Box' THEN sales_sent ELSE 0 END) as sales_sent_no_call
	FROM bi.customer_order
	WHERE LOWER(sales_channel) like '%app%'
	AND date_incoming is not null
	GROUP BY 1,2
	ORDER BY 1 desc
) co
LEFT JOIN
(
/*Number of app installs per display */
SELECT
	CAST(date_created as date) as date_created,
	CASE
		WHEN country = 'de' THEN 'DE'
		WHEN country = 'at' THEN 'AT'
		WHEN country = 'ch' THEN 'CH'
		WHEN country = 'nl' THEN 'NL'
		WHEN country = 'be' THEN 'BE'
		WHEN country = 'lu' THEN 'lu'
		WHEN country = 'se' THEN 'SE'
		WHEN country = 'dk' THEN 'DK'
		ELSE 'Other'
	END AS country,
	SUM(installs) as app_installs
FROM dwh.appdownloads
GROUP BY 1,2	
) dl ON dl.date_created = co.date_incoming AND dl.country = co.shipping_country


