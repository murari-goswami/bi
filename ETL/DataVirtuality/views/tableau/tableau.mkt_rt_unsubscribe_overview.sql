-- Name: tableau.mkt_rt_unsubscribe_overview
-- Created: 2015-08-18 12:57:49
-- Updated: 2015-08-25 16:57:57

CREATE VIEW tableau.mkt_rt_unsubscribe_overview
AS

SELECT
	cu.default_domain as country,
	SUM(CASE WHEN cu.subscribe_status = 'Unsubscribed' THEN 1 ELSE null END) AS unsubscribed_count_total,
	SUM(CASE WHEN cu.subscribe_status = 'Unsubscribed' AND phone_number is not null THEN 1 ELSE null END) AS unsubscribed_with_phone_number,
	SUM(CASE WHEN cu.subscribe_status = 'Subscribed'  THEN 1 ELSE null END) AS subscribed_count_total,
	SUM(CASE WHEN cu.subscribe_status = 'Unsubscribed' AND ab.customer_id_invoiced_order is not null THEN 1 ELSE null END) AS unsubscribed_with_invoiced_order,
	SUM(CASE WHEN cu.subscribe_status = 'Subscribed' AND ab.customer_id_invoiced_order is not null THEN 1 ELSE null END) AS subscribed_with_invoiced_order,
	SUM(CASE WHEN cu.subscribe_status = 'Unsubscribed' AND bc.customer_id_created_order is not null THEN 1 ELSE null END) AS unsubscribed_with_created_order,
	SUM(CASE WHEN cu.subscribe_status = 'Subscribed' AND bc.customer_id_created_order is not null THEN 1 ELSE null END) AS subscribed_with_created_order
FROM bi.customer cu 
LEFT JOIN 
(
	SELECT	
		DISTINCT
		customer_id as customer_id_invoiced_order
	FROM bi.customer_order
	WHERE is_real_order = 'Real Order'
	AND date_invoiced is not null
	GROUP BY 1
) ab ON ab.customer_id_invoiced_order = cu.customer_id
LEFT JOIN 
(
	SELECT	
		DISTINCT
		customer_id as customer_id_created_order
	FROM bi.customer_order
	WHERE is_real_order = 'Real Order'
	AND date_created is not null
	GROUP BY 1
) bc ON bc.customer_id_created_order = cu.customer_id
GROUP BY 1


