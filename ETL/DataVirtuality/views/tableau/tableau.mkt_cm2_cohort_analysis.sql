-- Name: tableau.mkt_cm2_cohort_analysis
-- Created: 2015-04-24 18:24:57
-- Updated: 2015-09-30 11:52:52

CREATE VIEW tableau.mkt_cm2_cohort_analysis
AS

SELECT
	con.order_id,
	con.customer_id,
	con.order_state,
	con.revenue_state,
	con.payment_state,
	con.shipping_country,
	con.order_type,
	con.sales_sent,
	con.sales_kept,
	con.discount_total,
	con.billing_total,
	con.billing_net_sales,
	con.sales_kept * cogs.percentage_cost cost_kept_calc,
	CASE 
		WHEN CAST(con.date_invoiced as date) < '2014-01-01' THEN hdirc.historical_direct_cost
		ELSE dirc.cost_direct
	END AS cost_direct,
	con.cost_kept,
	co.first_box_type,
	co.first_saleschannel_completed,
	fo.first_marketing_channel,
	fo.first_order_referral,
	c.first_order_date_completed as date_created_first_order,
	cu.customer_age,
	con.date_invoiced,
	con.date_shipped,
	con.date_created,
	TIMESTAMPDIFF(SQL_TSI_DAY, c.first_order_date_completed, con.date_created)/30 as months_since_first_order
FROM bi.customer_order con
JOIN views.customer c on c.customer_id = con.customer_id
JOIN views.customer_order co on co.id = con.order_id

/* Dimensions related to a customer's first order */ 

LEFT JOIN
(
	SELECT 
		co.customer_id,
		CASE 
		 WHEN mc.marketing_channel is null THEN 'Untracked'
		 ELSE mc.marketing_channel
		END as first_marketing_channel,
		CASE
			WHEN rp.order_id is not null AND rp.discount_total = 20 THEN '20 euros'
			WHEN rp.order_id is not null AND rp.discount_total = 50 THEN '50 euros'
			ELSE 'no'
		END AS first_order_referral
	FROM bi.customer_order co
	LEFT JOIN
	(
		SELECT 
			order_id,
			marketing_channel
		FROM bi.marketing_contacts
		WHERE contact_count_asc = 1
	) mc ON mc.order_id = co.order_id 

	/* Referral Program Orders */

	LEFT JOIN
	(
		SELECT
			order_id,
			discount_total
		FROM bi.customer_order co
		LEFT JOIN bi.customer cu ON cu.customer_id = co.customer_id
		LEFT JOIN raw.discount_campaigns ca ON co.campaign_id = ca.campaign_id
		WHERE (discount_total = 50 OR discount_total = 20)
		AND ((LOWER(campaign_title) like '%referral%' AND LOWER(campaign_title) not like '%coop%' AND LOWER(campaign_title) not like '%mitarbeiter%')
		OR  (referred_by_id is null AND co.campaign_id is null))
	) rp ON rp.order_id = co.order_id
WHERE co.order_type = 'First Order'
) fo ON fo.customer_id = con.customer_id 

LEFT JOIN bi.customer cu on cu.customer_id = co.customer_id
JOIN /* Take COGs % from last 31 days. We will apply this to all orders, so that we are not biased against old cohorts due to high partner stock usage */
(
	SELECT
	shipping_country,
	sum(cost_kept)/sum(sales_kept) as percentage_cost
	FROM bi.customer_order co
	WHERE co.date_invoiced > TIMESTAMPADD(SQL_TSI_DAY, -31, CURDATE())
	GROUP BY 1
) cogs on cogs.shipping_country = co.shipping_country
LEFT JOIN /* Direct cost per order */
(
	SELECT
		date_invoiced,
		country,
		SUM(cost_per_order) as cost_direct
	FROM bi.company_costs_direct
	GROUP BY 1,2
) dirc on dirc.date_invoiced = CAST(con.date_invoiced as date) AND dirc.country = con.shipping_country
LEFT JOIN
(
	select
	country,
	SUM(cost_per_order) as historical_direct_cost
FROM bi.company_costs_direct
WHERE date_invoiced = (SELECT min(date_invoiced) from bi.company_costs_direct WHERE cost_per_order is not null)
GROUP BY 1
) hdirc ON hdirc.country = con.shipping_country

WHERE con.order_state_number >= 128 
AND con.order_state_number < 2048
AND con.is_real_order = 'Real Order'


/* This UNION SELECT adds in dummy data so that we can draw nice cohorts charts for old cohorts that have very sparse data */
UNION SELECT
	null as order_id,
	null as customer_id,
	'Completed' as order_state,
	'Final' as revenue_state,
	null as payment_state,
	shipping_country,
	null as order_type,
	null as sales_sent,
	null as sales_kept,
	null as discount_total,
	null as billing_total,
	null as billing_net_sales,
	null as cost_kept_calc,
	null as cost_direct,
	null as cost_kept,
	first_box_type,
	null as first_saleschannel_completed,
	z.first_marketing_channel,
	w.first_order_referral,
	fo.date as date_created_first_order,
	null as customer_age,
	null as date_invoiced,
	null as date_shipped,
	o.date as date_created,
	TIMESTAMPDIFF(SQL_TSI_DAY, fo.date, curdate())/30 as months_since_first_order
FROM dwh.calendar fo
JOIN dwh.calendar o on o.date > fo.date AND o.date < curdate()
CROSS JOIN (SELECT 'Call Box' as first_box_type UNION SELECT 'No Call Box' as first_box_type) x
CROSS JOIN (SELECT distinct shipping_country FROM bi.customer_order) y
CROSS JOIN (SELECT distinct marketing_channel as first_marketing_channel FROM bi.marketing_order_attribution_aggregated) z
CROSS JOIN (SELECT 'yes' as first_order_referral UNION SELECT '20 euros' as first_order_referral UNION SELECT '50 euros' as first_order_referral) w
WHERE fo.date > '2012-02' and fo.date < curdate()
AND fo.day_of_month = 1
AND o.day_of_month = 1


