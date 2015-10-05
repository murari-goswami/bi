-- Name: tableau.mkt_campaigns_attribution_ratio
-- Created: 2015-08-27 10:32:39
-- Updated: 2015-08-27 11:54:20

CREATE VIEW tableau.mkt_campaigns_attribution_ratio
AS

SELECT
	od.date_incoming,
	od.domain,
 	od.campaign_title,
 	od.marketing_channel,
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
 	at.billing_net_sales as attributed_billing_net_sales	
FROM
(
SELECT
	CAST(co.date_incoming as date) as date_incoming,
	RTRIM(LTRIM(cam.campaign_title)) as campaign_title,
	cu.default_domain as domain,
	ca.marketing_channel,
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
LEFT JOIN bi.customer cu ON cu.customer_id = co.customer_id
LEFT JOIN
(
	SELECT 
		LTRIM(RTRIM(marketing_campaign)) as campaign_title, 
		marketing_channel 
	FROM "raw.marketing_contacts_discounts"
	WHERE marketing_channel IN ('Inserts', 'Affiliate', 'Cooperations')
	GROUP BY 1,2		
) ca ON ca.campaign_title = RTRIM(LTRIM(cam.campaign_title))	
WHERE co.is_real_order = 'Real Order'
AND cam.campaign_title is not null
AND order_type = 'First Order'
AND ca.campaign_title is not null
GROUP BY 1,2,3,4
) od 
LEFT JOIN
(
SELECT 
	"date" as date_incoming,
	domain,
	RTRIM(LTRIM(marketing_campaign)) as marketing_campaign,
	SUM(incoming_first_orders) as incoming_first_orders,
	SUM(invoiced_first_orders) as invoiced_first_orders,
	SUM(sales_sent) as sales_sent,
	SUM(sales_kept) as sales_kept,
	SUM(billing_net_sales) as billing_net_sales
FROM bi.marketing_order_attribution_aggregated
WHERE reporting_type = 'date_incoming'
AND marketing_channel IN ('Inserts', 'Affiliate', 'Cooperations')
GROUP BY 1,2,3
) at ON od.date_incoming = at.date_incoming AND at.marketing_campaign = od.campaign_title AND od.domain = at.domain


