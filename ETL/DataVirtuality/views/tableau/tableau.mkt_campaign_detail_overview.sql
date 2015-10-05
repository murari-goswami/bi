-- Name: tableau.mkt_campaign_detail_overview
-- Created: 2015-07-10 15:24:57
-- Updated: 2015-07-23 10:21:30

CREATE view tableau.mkt_campaign_detail_overview
AS

SELECT
 	ca.campaign_title,
 	ca.country,
 	ca.promotion_start, 
 	ca.promotion_end, 
 	ca.cost_reporting_date, 
 	ca.promotion_runtime, 
 	ca.campaign_type, 
 	ca.marketing_channel, 
 	ca.cluster, 
 	ca.agency, 
 	ca.publisher,
 	ca.volume,
 	ca.cpm_print,
 	ca.cpm_publisher,
 	ca.envelope_costs,
 	ca.cpm_total,
 	ca.ad_costs,
 	ca.fixed_costs,
 	ca.cpo_publisher,
 	ca.cvr_forecast,
 	ca.total_costs_forecast,
 	ca.new_customer_invoiced_order_forecast,
 	ca.cac_forecast,
 	ca.daily_costs,
 	od.orders_incoming,
 	at.incoming_first_orders as attributed_orders_incoming,
 	od.orders_invoiced,
 	at.invoiced_first_orders as attributed_orders_invoiced,
 	od.articles_sent,
 	od.articles_kept,
 	od.sales_sent,
 	at.sales_sent as attributed_sales_sent,
 	od.sales_kept,
 	at.sales_kept as attributed_sales_kept,
 	od.discount_total,
 	od.billing_total,
 	od.billing_net_sales,
 	at.billing_net_sales as attributed_billing_net_sales,
 	mc.aggregated_costs,
 	mc.aggregated_spread 	
FROM raw.marketing_voucher_campaign_details ca
LEFT JOIN
(
SELECT
	RTRIM(LTRIM(cam.campaign_title)) as campaign_title,
	SUM(CASE WHEN co.date_incoming is not null then 1 ELSE null END) AS orders_incoming,
	SUM(CASE WHEN co.date_invoiced is not null then 1 ELSE null END) AS orders_invoiced,
	SUM(CASE WHEN co.revenue_state = 'Final' THEN co.articles_sent else null END) as articles_sent,
	SUM(CASE WHEN co.revenue_state = 'Final' THEN co.articles_kept else null END) as articles_kept,
	SUM(CASE WHEN co.revenue_state = 'Final' THEN co.sales_sent else null END) as sales_sent,
	SUM(CASE WHEN co.revenue_state = 'Final' THEN co.sales_kept else null END) as sales_kept,
	SUM(CASE WHEN co.revenue_state = 'Final' THEN co.discount_total else null END) as discount_total,
	SUM(CASE WHEN co.revenue_state = 'Final' THEN co.billing_total else null END) as billing_total,
	SUM(CASE WHEN co.revenue_state = 'Final' THEN co.billing_net_sales else null END) as billing_net_sales
FROM bi.customer_order co
LEFT JOIN raw.discount_campaigns cam ON co.campaign_id = cam.campaign_id
WHERE co.is_real_order = 'Real Order'
AND cam.campaign_title is not null
AND order_type = 'First Order'
GROUP BY 1
) od ON od.campaign_title = ca.campaign_title
LEFT JOIN
(
	SELECT 
		campaign_title,
		SUM(daily_costs) as aggregated_costs,
		SUM(daily_spread) as aggregated_spread
	FROM raw.marketing_costs_per_voucher_campaign
	WHERE date_created <= CURDATE() 
	GROUP BY 1
) mc ON mc.campaign_title = ca.campaign_title
LEFT JOIN
(
SELECT 
	marketing_campaign,
	SUM(incoming_first_orders) as incoming_first_orders,
	SUM(invoiced_first_orders) as invoiced_first_orders,
	SUM(sales_sent) as sales_sent,
	SUM(sales_kept) as sales_kept,
	SUM(billing_net_sales) as billing_net_sales
FROM bi.marketing_order_attribution_aggregated
WHERE reporting_type = 'date_incoming'
AND marketing_channel IN ('Inserts', 'Affiliate', 'Cooperations')
GROUP BY 1
) at ON LTRIM(RTRIM(at.marketing_campaign)) = ca.campaign_title


