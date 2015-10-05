-- Name: tableau.mkt_rt_order_performance
-- Created: 2015-08-04 15:28:26
-- Updated: 2015-08-04 17:44:22

CREATE VIEW tableau.mkt_rt_order_performance
AS
                                                     
SELECT
	fc."date",
	fc.country as country,
	SUM(co.invoiced_orders) as actual_invoiced_retention_orders_total,
	SUM(fc.daily_orders) as forecasted_retention_invoiced_orders,
	SUM(co.actual_invoiced_club_orders) as actual_club_repeat_orders,
	SUM(co.actual_invoiced_repeat_orders_other) as actual_invoiced_repeat_orders_other,
	SUM(actual_invoiced_magazine_orders) as actual_invoiced_magazine_orders,
	SUM(actual_invoiced_app_orders) as 	actual_invoiced_app_orders
FROM
(
	SELECT
		"date",
		ab.country,
		ab.daily_orders	
	FROM dwh.calendar c
	LEFT JOIN
	(
		SELECT
			go.year_month,
			go.country,
			CAST(go.invoiced_order_forecast as decimal) / ca.month_days as daily_orders
		FROM dwh.retention_marketing_order_goals go
		LEFT JOIN
		(
			SELECT
				year_month,
				COUNT(day_of_month) as month_days
			FROM dwh.calendar
			GROUP BY 1 
		) ca ON go.year_month = ca.year_month
	) ab ON c.year_month = ab.year_month
	WHERE "date" >= '2015-01-01'
	AND daily_orders is not null
) fc 
LEFT JOIN
(
	SELECT
		CAST(date_invoiced AS date) AS date_invoiced,
		shipping_country, 
		COUNT(order_id) as invoiced_orders,
		SUM(CASE WHEN order_type = 'Outfittery Club Order' THEN 1 ELSE 0 END) as actual_invoiced_club_orders,
		SUM(CASE WHEN order_type = 'Repeat Order' AND LOWER(sales_channel) not like '%app%' AND (LOWER(campaign_title) not like '%crm-magazin%' AND LOWER(campaign_title) not like '%crm magazin%' AND LOWER(campaign_title) not like '%magazin sommer%' OR campaign_title is null) THEN 1 ELSE 0 END)  as actual_invoiced_repeat_orders_other,
		SUM(CASE WHEN LOWER(sales_channel) like '%app%' THEN 1 ELSE 0 END) as actual_invoiced_app_orders,
		SUM(CASE WHEN LOWER(campaign_title) like '%crm-magazin%' OR LOWER(campaign_title) like '%crm magazin%' OR LOWER(campaign_title) like '%magazin sommer%' THEN 1 ELSE 0 END) as actual_invoiced_magazine_orders
	FROM "bi.customer_order" cu
	LEFT JOIN raw.discount_campaigns dc ON dc.campaign_id = cu.campaign_id
	WHERE order_type IN ('Outfittery Club Order', 'Repeat Order')
	AND is_real_order = 'Real Order'
	AND date_invoiced is not null
	AND order_state_number >= 16 
	AND order_state_number < 2048
	GROUP BY 1,2
) co ON fc."date" = co.date_invoiced AND fc.country = co.shipping_country
GROUP BY 1,2


