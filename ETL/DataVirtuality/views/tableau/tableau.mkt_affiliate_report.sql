-- Name: tableau.mkt_affiliate_report
-- Created: 2015-04-24 18:20:11
-- Updated: 2015-04-24 18:20:11

CREATE VIEW tableau.mkt_affiliate_report
AS
SELECT
	co.order_id,
	co.date_invoiced,
	CASE
		  WHEN co.date_invoiced is not null then 1
          ELSE 0
	END as count_invoiced,
	co.date_incoming,
	co.shipping_country,
	co.box_type,
	co.order_type,
	co.order_state,
	co.articles_sent,
	co.articles_kept,
	co.sales_sent,
	co.sales_kept,
	co.discount_total,
	co.billing_total,
	co.billing_vat,
	co.billing_net_sales,
	mo.marketing_channel
FROM "bi.customer_order" co
LEFT JOIN views.marketing_order mo ON mo.order_id = co.order_id
WHERE co.is_real_order = 'Real Order'
AND co.date_incoming IS NOT NULL
AND marketing_channel = 'affiliate'


