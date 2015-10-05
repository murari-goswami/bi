-- Name: tableau.mkt_tv_performance
-- Created: 2015-04-24 18:25:44
-- Updated: 2015-08-07 10:48:53

CREATE view tableau.mkt_tv_performance
AS
SELECT 
	CAST(co.date_incoming as date) as "date",
	co.order_id as order_id,
	tv.program_after,
	tv.program_before,
	tv.spotname,
	tv.spotstation,
	tv.airingtime,
	CASE WHEN co.date_invoiced is not null THEN 1 ELSE 0 END AS orders_invoiced,
	at.contact_weight,
	co.shipping_country,
	co.shipping_zip,
	co.shipping_city,
	co.payment_type,
	co.sales_channel,
	co.date_invoiced,
	co.order_state,
	cu.default_domain,
	co.sales_sent,
	co.sales_kept,
	co.billing_total
FROM bi.customer_order co
LEFT JOIN bi.marketing_order_attribution at ON at.order_id = co.order_id
LEFT JOIN dwh.marketing_tv tv ON tv.order_id = co.order_id
LEFT JOIN bi.customer cu on cu.customer_id=co.customer_id
WHERE at.marketing_channel = 'TV'


