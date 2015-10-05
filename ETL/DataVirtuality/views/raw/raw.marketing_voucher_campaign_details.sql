-- Name: raw.marketing_voucher_campaign_details
-- Created: 2015-07-07 12:28:44
-- Updated: 2015-07-29 16:43:58

CREATE VIEW raw.marketing_voucher_campaign_details
AS


WITH
def AS (
SELECT
	campaign_title, 
	country, 
	CAST(promotion_start as date) as promotion_start, 
	CAST(promotion_end as date) as promotion_end, 
	CAST(TIMESTAMPADD(SQL_TSI_DAY, 28, CAST(promotion_end as timestamp)) as date) as cost_reporting_date,
	TIMESTAMPDIFF(SQL_TSI_DAY, CAST(promotion_start as timestamp), CAST(promotion_end as timestamp)) + 1 as promotion_runtime,
	TIMESTAMPDIFF(SQL_TSI_DAY, CAST(promotion_start as timestamp), TIMESTAMPADD(SQL_TSI_DAY, 28, CAST(promotion_end as timestamp))) + 1 as reporting_runtime,
	campaign_type, 
	CASE 
		WHEN campaign_type = 'Inserts' OR campaign_type = 'Barter' THEN 'Inserts'
		WHEN campaign_type = 'Affiliate' THEN 'Affiliate'
		ELSE 'Cooperations'
	END AS marketing_channel,
	cluster, 
	agency, 
	publisher, 
	volume,
	cpm_print, 
	cpm_publisher, 
	envelope_costs,
	ifnull(cpm_print,0)+ifnull(cpm_publisher,0)+ifnull(envelope_costs,0) as cpm_total,
	ad_costs, 
	volume/1000 * (ifnull(cpm_print,0)+ifnull(cpm_publisher,0)+ifnull(envelope_costs,0)) + ifnull(ad_costs, 0) as fixed_costs, 
	cpo_publisher,
	cvr_forecast,
	volume * cvr_forecast  as	new_customer_invoiced_order_forecast
FROM dwh.marketing_voucher_campaign_details
)


SELECT
	def.campaign_title,
	country,
	promotion_start,
	promotion_end,
	cost_reporting_date,
	dc.date_discount_end,
	dc.date_discount_start,
	promotion_runtime,
	reporting_runtime,
	TIMESTAMPDIFF(SQL_TSI_DAY, promotion_start, dc.date_discount_end) AS discount_runtime,
	campaign_type,
	marketing_channel,
	cluster,
	agency,
	publisher,
	volume,
	CASE 
		WHEN promotion_runtime is null OR promotion_runtime = 0 then volume
		ELSE volume / promotion_runtime 
	END as daily_spread,
	cpm_print,
	cpm_publisher,
	envelope_costs,
	cpm_total,
	fixed_costs,
	ad_costs,
	cpo_publisher,
	fixed_costs + ifnull(new_customer_invoiced_order_forecast * ifnull(cpo_publisher,0),0) as total_costs_forecast,
	cvr_forecast,
	new_customer_invoiced_order_forecast,
	CASE 
		WHEN new_customer_invoiced_order_forecast is null OR new_customer_invoiced_order_forecast = 0 THEN 0
		ELSE (fixed_costs + ifnull(new_customer_invoiced_order_forecast * ifnull(cpo_publisher,0),0)) / new_customer_invoiced_order_forecast 
	END as cac_forecast,
	CASE 
		WHEN reporting_runtime is null OR reporting_runtime = 0 THEN 0
		ELSE (fixed_costs + ifnull(new_customer_invoiced_order_forecast * ifnull(cpo_publisher,0),0)) / reporting_runtime 
	END as daily_costs
FROM def
LEFT JOIN
(
	SELECT
		campaign_title,
		MAX(CAST(date_discount_end as date)) as date_discount_end,
		MAX(CAST(date_discount_start as date)) as date_discount_start
	FROM raw.discount_campaigns
	GROUP BY 1
) dc ON dc.campaign_title = def.campaign_title


