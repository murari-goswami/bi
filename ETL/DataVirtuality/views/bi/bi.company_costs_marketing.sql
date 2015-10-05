-- Name: bi.company_costs_marketing
-- Created: 2015-04-24 18:20:56
-- Updated: 2015-04-24 18:20:56

/* Past costs from the marketing team are entered via Deathstar and then here 
are converted into a cost per order for the current number of real orders in each month */

CREATE VIEW bi.company_costs_marketing
AS
SELECT
	od.date_invoiced,
	m.country,
	m.cost*-1/ow.num_orders_weekly*od.num_orders_daily as cost,
	m.cost*-1/ow.num_orders_weekly as cost_per_order
FROM
(
	SELECT
		c.year_week,
		mc.country,
		SUM(mc.cost) as cost
	FROM raw.marketing_costs mc
	JOIN dwh.calendar c on c.date = mc.date_created
	GROUP BY 1,2
) m
JOIN
(
	SELECT 
		c.year_week,
		co.shipping_country as country,
		COUNT(*) as num_orders_weekly
	FROM bi.customer_order co
	JOIN dwh.calendar c on c.date = CAST(co.date_invoiced as date)
	WHERE co.is_real_order = 'Real Order'
	AND co.order_state_number >= 16
	GROUP BY 1,2
) ow on m.year_week = ow.year_week AND ow.country = m.country
JOIN
(
	SELECT 
		c.year_week,
		c.date as date_invoiced,
		co.shipping_country as country,
		COUNT(*) as num_orders_daily
	FROM bi.customer_order co
	JOIN dwh.calendar c on c.date = CAST(co.date_invoiced as date)
	WHERE co.is_real_order = 'Real Order'
	AND co.order_state_number >= 16
	GROUP BY 1,2,3
) od on m.year_week = od.year_week AND m.country = od.country


