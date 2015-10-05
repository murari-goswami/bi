-- Name: tableau.mkt_affiliate_order_check
-- Created: 2015-04-24 18:20:58
-- Updated: 2015-07-30 16:03:30

CREATE VIEW tableau.mkt_affiliate_order_check
AS

SELECT
	cast(co.date_created as date) as "date_created",
	co.order_id,
	co.customer_id,
	co.shipping_country,
	co.sales_channel,
	co.order_state,
	co.order_state_number,
	co.order_type,
	CAST(co.date_incoming as date) as date_incoming,
	CAST(co.date_invoiced as date) as date_invoiced,
	co.revenue_state,
	co.sales_sent,
	co.discount_total,
	co.billing_total,
	co.sales_kept,
	co.shipping_city,
	cu.customer_age,
	mo.marketing_channel,
	mo.marketing_channel_excluding_tv,
	dc.discount_code,
	dc.campaign_title
FROM bi.customer_order co
LEFT JOIN bi.customer cu ON co.customer_id = cu.customer_id
LEFT JOIN views.marketing_order mo ON co.order_id = mo.order_id
LEFT JOIN raw.discount_campaigns dc ON co.campaign_id = dc.campaign_id
WHERE co.date_incoming is not null
AND co.date_incoming >= '2014-01-01'


