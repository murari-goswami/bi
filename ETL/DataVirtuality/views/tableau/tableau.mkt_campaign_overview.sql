-- Name: tableau.mkt_campaign_overview
-- Created: 2015-04-24 18:20:10
-- Updated: 2015-08-27 13:58:12

CREATE VIEW tableau.mkt_campaign_overview
AS
SELECT
	co.order_id,
	co.date_invoiced,
	CASE
		  WHEN co.date_invoiced is not null then 1
          ELSE 0
	END as count_invoiced,
	CAST(co.date_incoming as date) as date_incoming,
	CAST(co.date_created as date) as date_created,
	co.shipping_country,
	co.box_type,
	co.order_type,
	co.payment_type,
	co.order_state,
	co.revenue_state,
	co.articles_sent,
	co.articles_kept,
	co.sales_sent,
	co.sales_kept,
	co.discount_total,
	co.billing_total,
	co.billing_vat,
	co.billing_net_sales,
	CAST(co.date_phone_call_current as date) as date_phone_call_current,
	CAST(co.date_phone_call_original as date) as date_phone_call_original,
	cam.code,
	CASE 
		WHEN co.not_reached = 'true' THEN 1
		ELSE null
	END AS not_reached,
	CASE 
		WHEN CAST(cam.date_end as date) <= CAST(CURRENT_DATE as date) THEN 'Running'
		ELSE 'Finished'
	END as campaign_status,
	cam.date_start,
	cam.date_end,
	cam.campaign_title,
	cam.discount_percentage,
	cam.discount_absolute,
	co.inactive_reasons,
	cu.customer_age,
	cu.phone_number,
	cu.occupation,
	cu.email,
	cu.date_of_birth
FROM "bi.customer_order" co
JOIN "views.campaign" cam ON co.campaign_id=cam.id
LEFT JOIN bi.customer cu ON cu.customer_id = co.customer_id
WHERE co.is_real_order = 'Real Order'
AND co.date_incoming IS NOT NULL


