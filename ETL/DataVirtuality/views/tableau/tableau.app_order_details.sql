-- Name: tableau.app_order_details
-- Created: 2015-08-04 10:44:55
-- Updated: 2015-08-04 11:31:22

CREATE VIEW tableau.app_order_details
AS

SELECT
	co.order_id,
	co.date_incoming,
	co.date_invoiced,
	co.shipping_country,
	co.sales_channel,
	co.sales_sent,
	co.sales_kept,
	co.billing_total,
	CASE
		WHEN at.device is not null THEN at.device
		ELSE 'Unkown'
	END AS device	
FROM
(
	SELECT
		order_id,
		CAST(date_incoming as date) as date_incoming,
		CAST(date_invoiced as date) as date_invoiced,
		shipping_country,
		sales_channel,
		sales_sent,
		sales_kept,
		billing_total	
	FROM bi.customer_order
	WHERE LOWER(sales_channel) like '%app%'
	AND date_incoming is not null
) co
LEFT JOIN
(
/*Device by order id */
SELECT 
	order_id, 
	device
FROM dwh.apptracking
GROUP BY 1,2
) at ON at.order_id = co.order_id


