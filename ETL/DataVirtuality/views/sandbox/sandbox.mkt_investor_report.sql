-- Name: sandbox.mkt_investor_report
-- Created: 2015-09-17 12:12:17
-- Updated: 2015-09-17 15:27:21

CREATE view sandbox.mkt_investor_report
AS


SELECT 
	at.reporting_type, 
	at."date", 
	at.domain,
	at.marketing_channel, 
	at.incoming_orders_adjusted,
	at.invoiced_orders_adjusted,
	ua.incoming_first_orders,
	ua.invoiced_first_orders,
	ua.sales_sent,
	ua.sales_kept,
	ua.billing_net_sales,
	ua.billing_total,
	CASE 
		WHEN COALESCE(at.incoming_orders_adjusted, 0) = 0 THEN 0
		ELSE ROUND(ua.incoming_first_orders, 3) / ROUND(at.incoming_orders_adjusted, 3) END as incoming_factor,
	CASE 
		WHEN COALESCE(at.invoiced_orders_adjusted, 0) = 0 THEN 0
		ELSE ROUND(ua.invoiced_first_orders, 3) / ROUND(at.invoiced_orders_adjusted, 3) END as invoiced_factor		
	
FROM bi.marketing_referral_brand_effect_attribution at
LEFT JOIN 
(
			SELECT
					reporting_type,
					"date",
					domain,
					marketing_channel,
					SUM(incoming_first_orders) as incoming_first_orders,
					SUM(invoiced_first_orders) as invoiced_first_orders,
					SUM(sales_sent) as sales_sent,
					SUM(sales_kept) as sales_kept,
					SUM(billing_net_sales) as billing_net_sales,
					SUM(billing_total) as billing_total
			FROM bi.marketing_order_attribution_aggregated
			GROUP BY 1,2,3,4
) ua ON ua.reporting_type = at.reporting_type AND
		ua."date" = at."date" AND
		ua.domain = at.domain AND
		ua.marketing_channel = at.marketing_channel


