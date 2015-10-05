-- Name: bi.stylist_weighted_activity
-- Created: 2015-04-24 18:18:56
-- Updated: 2015-04-24 18:18:56

CREATE VIEW bi.stylist_weighted_activity 
AS
SELECT 
	s.stylist_id, 
	s.date_invoiced, 
	s.shipping_country as country, 
	s.orders_for_country, 
	c.orders_for_day,
	s.orders_for_country/CAST(c.orders_for_day AS DECIMAL) AS stylist_weighted_activity
FROM
(
	SELECT  
		CAST(co.date_invoiced AS DATE) AS date_invoiced, 
		co.stylist_id, 
		co.shipping_country, 
		COUNT(DISTINCT co.order_id) orders_for_country
	FROM raw.customer_order co
	GROUP BY 1,2,3
) s
JOIN
(
	SELECT  
		CAST(co.date_invoiced AS DATE) AS date_invoiced, 
		co.stylist_id, 
		COUNT(DISTINCT co.order_id) orders_for_day
	FROM raw.customer_order co
	GROUP BY 1,2
) c ON c.stylist_id = s.stylist_id AND c.date_invoiced = s.date_invoiced


