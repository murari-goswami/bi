-- Name: tableau.mkt_incoming_and_invoiced_orders_orders
-- Created: 2015-04-24 18:20:09
-- Updated: 2015-06-05 15:59:54

CREATE VIEW tableau.mkt_incoming_and_invoiced_orders_orders
AS
SELECT
co.order_id,
co.date_invoiced,
co.date_incoming,
co.customer_id,
CASE 
	WHEN co.order_type in ('Outfittery Club Order', 'First Order Follow-on', 'Repeat Order Follow-on') THEN '(not set)'
	WHEN mo.marketing_channel is null THEN '(not set)' ELSE mo.marketing_channel 
END as marketing_channel,
co.shipping_country,
co.sales_channel,
c.default_domain as domain,
COALESCE(co.order_type, 'First Order') as order_type,
co.box_type,
CASE 
	WHEN co.pre_pay = 1 AND co.payment_type = 'Pre-pay' THEN 'Pre-pay (Now)' 
	WHEN co.pre_pay = 1 THEN 'Pre-pay (Past)' 
	ELSE 'Never Pre-pay' 
END as pre_pay,
co.order_state,
co.revenue_state,
CASE 
	WHEN co.sales_channel_special = 'Outfit' AND CAST(co.date_incoming as date) < '2015-04-26' THEN 'Ready Outfit'
	ELSE 'No Ready Outfit'
END as ready_outfit,
CASE WHEN co.date_stylist_picked is not null THEN 1 ELSE 0 END as picked_by_stylist,
co.articles_sent,
co.articles_kept,
co.articles_picked,
co.sales_sent,
co.sales_kept,
co.sales_picked,
co.discount_total,
co.billing_total,
co.billing_vat,
co.billing_net_sales
FROM bi.customer_order co
JOIN bi.customer c on c.customer_id = co.customer_id
LEFT JOIN views.marketing_order mo on mo.order_id = co.order_id
WHERE co.is_real_order = 'Real Order'
AND co.date_incoming IS NOT NULL


