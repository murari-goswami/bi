-- Name: tableau.mkt_linkedin_overview
-- Created: 2015-06-02 12:15:06
-- Updated: 2015-07-16 18:16:30

CREATE VIEW tableau.mkt_linkedin_overview
AS
SELECT
	ga.date_created, 
	CAST(co.date_incoming as date) as date_incoming,
	CAST(co.date_invoiced as date) as date_invoiced,
	co.shipping_country,
	ga.transaction_id,
	CASE
		WHEN LOWER(ga.source) LIKE '%linkedin%' THEN 'LinkedIn'
		WHEN LOWER(ga.source) like'%xing%' THEN 'Xing'
	END AS channel,
	ga.source, 
	ga.medium, 
	ga.campaign, 
	ga.country,
	co.customer_id,
	cu.customer_age,
	co.sales_sent,
	co.sales_kept,
	co.order_state,
	co.payment_type,
	co.revenue_state
FROM(
SELECT DISTINCT date_created, transaction_id, source, medium, campaign, country FROM "dwh.ga_information_utm"
WHERE lower(source) like '%linkedin%' OR lower(source) like '%xing%'
AND date_created >= '2015-04-01'
) ga
LEFT JOIN bi.customer_order co ON co.order_id = ga.transaction_id
LEFT JOIN bi.customer cu ON co.customer_id = cu.customer_id
WHERE co.date_incoming is not null 
AND co.is_real_order = 'Real Order'


