-- Name: bi.customer_order_2nd_step_conversion_forecast
-- Created: 2015-04-24 18:19:59
-- Updated: 2015-04-24 18:19:59

CREATE VIEW bi.customer_order_2nd_step_conversion_forecast
AS
SELECT 
	a.days_from_incoming,
	b.box_type,
	b.pre_pay,
	CAST(SUM(proc.processed_orders) as float)/avg(tot.total_incoming_orders) as conversion_rate
FROM
(
	SELECT 
		TIMESTAMPDIFF(SQL_TSI_DAY, c.date, CURDATE()) as days_from_incoming
	FROM dwh.calendar c
	WHERE c.date > TIMESTAMPADD(SQL_TSI_DAY, -61, CURDATE())
	AND c.date <= CURDATE()
) a
CROSS JOIN 
(
	SELECT 'Call Box' as box_type, 0 as pre_pay 
	UNION SELECT 'Call Box' as box_type, 1 as pre_pay 
	UNION SELECT 'No Call Box' as box_type, 0 as pre_pay 
	UNION SELECT 'No Call Box' as box_type, 1 as pre_pay 
) b
LEFT JOIN 
(
	SELECT
		box_type,
		pre_pay,
		count(*) as total_incoming_orders
	FROM bi.customer_order co 
	WHERE order_type = 'First Order'
	AND date_incoming > TIMESTAMPADD(SQL_TSI_DAY, -120, CURDATE())
	AND date_incoming < TIMESTAMPADD(SQL_TSI_DAY, -60, CURDATE())
	GROUP BY 1,2
) tot on tot.box_type = b.box_type and tot.pre_pay = b.pre_pay
LEFT JOIN
(
	SELECT
		TIMESTAMPDIFF(SQL_TSI_DAY, date_incoming, date_stylist_picked) as days_from_incoming,
		box_type,
		pre_pay,
		count(*) as processed_orders
	FROM bi.customer_order co 
	WHERE order_type = 'First Order'
	AND date_incoming > TIMESTAMPADD(SQL_TSI_DAY, -120, CURDATE())
	AND date_incoming < TIMESTAMPADD(SQL_TSI_DAY, -60, CURDATE())
	AND date_stylist_picked > date_incoming
	GROUP BY 1,2,3
) proc on proc.days_from_incoming >= a.days_from_incoming AND proc.box_type = b.box_type AND proc.pre_pay = b.pre_pay
GROUP BY 1,2,3


