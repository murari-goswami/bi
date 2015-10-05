-- Name: tableau.ops_time_between_stylist_picked_submitted
-- Created: 2015-04-29 18:51:10
-- Updated: 2015-04-29 18:51:10

CREATE VIEW tableau.ops_time_between_stylist_picked_submitted
AS

SELECT
	PARSETIMESTAMP(a.date || ' ' || b.hh, 'yyyy-MM-dd HH') as day_hour,
	COALESCE(c.orders_picked_by_stylist, 0) as orders_picked_by_stylist,
	COALESCE(d.orders_invoiced,0) as orders_invoiced,
	COALESCE(c.time_to_submit,0) as time_to_submit
FROM 
(
	SELECT 
		c.date
	FROM dwh.calendar c 
	WHERE c.date > TIMESTAMPADD(SQL_TSI_DAY, -30, CURDATE()) 
	AND c.date < CURDATE()
) a 
CROSS JOIN (SELECT DISTINCT substring(date_created, 12, 2) as hh FROM bi.customer_order co) b
LEFT JOIN
(
	SELECT 
		PARSETIMESTAMP(LEFT(date_stylist_picked, 13), 'yyyy-MM-dd HH') as day_hour,
		COUNT(order_id) as orders_picked_by_stylist,
		AVG(TIMESTAMPDIFF(SQL_TSI_MINUTE, date_stylist_picked, date_invoiced)) as time_to_submit
	FROM bi.customer_order 
	WHERE date_stylist_picked > TIMESTAMPADD(SQL_TSI_DAY, -30, CURDATE())
	GROUP BY 1
) c on c.day_hour = PARSETIMESTAMP(a.date || ' ' || b.hh, 'yyyy-MM-dd HH')
LEFT JOIN
(
	SELECT 
		PARSETIMESTAMP(LEFT(date_invoiced, 13), 'yyyy-MM-dd HH')  as day_hour,
		COUNT(order_id) as orders_invoiced
	FROM bi.customer_order
	WHERE date_invoiced > TIMESTAMPADD(SQL_TSI_DAY, -30, CURDATE())
	GROUP BY 1
) d on d.day_hour = PARSETIMESTAMP(a.date || ' ' || b.hh, 'yyyy-MM-dd HH')


