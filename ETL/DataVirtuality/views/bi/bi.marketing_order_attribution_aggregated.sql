-- Name: bi.marketing_order_attribution_aggregated
-- Created: 2015-06-11 10:54:37
-- Updated: 2015-09-08 10:08:38

CREATE VIEW bi.marketing_order_attribution_aggregated
AS

SELECT
	 'date_incoming' as reporting_type,
	cast(co.date_incoming as date) as "date",
	cu.default_domain as domain,
	oa.marketing_channel,
	oa.marketing_subchannel,
	oa.source,
	oa.medium,
	oa.marketing_campaign,
	oa.term,
	SUM(oa.contact_weight) as incoming_first_orders,
	SUM(CASE WHEN co.date_invoiced is not null AND co.order_state_number >= 16 AND co.order_state_number < 2048 AND co.date_stylist_picked is not null THEN oa.contact_weight ELSE 0 END) as invoiced_first_orders,
	SUM(oa.contact_weight*co.sales_sent) as sales_sent,
	SUM(oa.contact_weight*co.sales_kept) as sales_kept,
	SUM(oa.contact_weight*co.billing_net_sales) as billing_net_sales,
	SUM(oa.contact_weight*co.billing_total) as billing_total
FROM bi.customer_order co
LEFT JOIN bi.marketing_order_attribution oa ON oa.order_id = co.order_id
LEFT JOIN "bi.customer" cu ON cu.customer_id = co.customer_id
WHERE co.date_incoming is not null
AND co.is_real_order = 'Real Order'
AND order_type = 'First Order'
GROUP BY 1,2,3,4,5,6,7,8,9
UNION ALL
SELECT
	'date_invoiced' as reporting_type,
	cast(co.date_invoiced as date) as "date",
	cu.default_domain as domain,
	oa.marketing_channel,
	oa.marketing_subchannel,
	oa.source,
	oa.medium,
	oa.marketing_campaign,
	oa.term,
	null as incoming_first_orders,
	SUM(oa.contact_weight) as invoiced_first_orders,
	SUM(oa.contact_weight*co.sales_sent) as sales_sent,
	SUM(oa.contact_weight*co.sales_kept) as sales_kept,
	SUM(oa.contact_weight*co.billing_net_sales) as billing_net_sales,
	SUM(oa.contact_weight*co.billing_total) as billing_total
FROM bi.customer_order co
LEFT JOIN bi.marketing_order_attribution oa ON oa.order_id = co.order_id
LEFT JOIN "bi.customer" cu ON cu.customer_id = co.customer_id
WHERE co.date_invoiced is not null
AND co.is_real_order = 'Real Order'
AND order_type = 'First Order'
AND co.order_state_number >= 16
AND co.order_state_number < 2048
GROUP BY 1,2,3,4,5,6,7,8,9


