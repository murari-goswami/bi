-- Name: tableau.mkt_magazine_performance
-- Created: 2015-04-24 18:24:20
-- Updated: 2015-04-24 18:24:20

CREATE VIEW tableau.mkt_magazine_performance
AS
SELECT
	CAST(co.date_incoming as date) "date",
	co.customer_id,
	co.order_id,
	dc2.campaign_id,
	dc2.discount_code,
	dc2.campaign_title, 
	co.order_type,
	co.box_type,
	co.shipping_country,
	co.shipping_city,
	CASE WHEN co.date_incoming is not null THEN 1 ELSE 0 END as incoming_orders,
	CASE WHEN co.date_invoiced is not null AND co.order_state_number >= 16 THEN 1 ELSE 0 END as invoiced_orders,
	co.sales_sent,
	co.sales_kept,
	co.billing_total,
	cl.marketing_cluster,
	cu.age_group,
	CASE WHEN cu.club_member = 'true' THEN 1 ELSE 0 END as club_member	
FROM bi.customer_order co 
RIGHT JOIN 
(
	SELECT 
		dc.campaign_id,
		dc.discount_code,
		dc.campaign_title 
	FROM "raw.discount_campaigns" dc
	WHERE dc.discount_code = 'MG15AA'
	OR dc.discount_code = 'MG15AAO'	
	OR dc.discount_code = 'MG15CL'	
	OR dc.discount_code = 'MG15CLP'
	OR dc.discount_code = 'MGL36'
	OR dc.discount_code = 'KTL34'
) dc2 ON dc2.campaign_id = co.campaign_id
LEFT JOIN bi.customer cu on cu.customer_id = co.customer_id
LEFT JOIN raw.customer_brand_cluster cl on cl.customer_id = co.customer_id
WHERE co.is_real_order = 'Real Order'
AND co.date_incoming is not null


