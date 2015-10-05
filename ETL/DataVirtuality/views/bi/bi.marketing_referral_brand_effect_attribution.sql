-- Name: bi.marketing_referral_brand_effect_attribution
-- Created: 2015-06-11 18:08:32
-- Updated: 2015-09-10 15:16:40

CREATE VIEW bi.marketing_referral_brand_effect_attribution
AS



SELECT 
	at.reporting_type,
   	at."date", 
   	at.domain,
	at.marketing_channel,

	SUM(CASE
		WHEN bf.marketing_channel_group = 'Paid' AND COALESCE(ab.incoming_orders_brand, 0) = 0 THEN at.incoming_orders_adjusted
		WHEN bf.marketing_channel_group = 'Paid' THEN at.incoming_orders_adjusted * bf.referral_factor * bf.brand_factor
		WHEN bf.marketing_channel_group = 'Brand' AND COALESCE(ab.incoming_orders_brand, 0) = 0 THEN 0
		WHEN bf.marketing_channel_group = 'Brand' AND COALESCE(ab.incoming_orders_paid, 0) = 0 THEN at.incoming_orders_adjusted
		WHEN bf.marketing_channel_group = 'Brand' THEN at.incoming_orders_adjusted-((ab.incoming_orders_paid_adjusted-ab.incoming_orders_paid)*(at.incoming_orders_adjusted/ab.incoming_orders_brand)) END) 
    as incoming_orders_adjusted,

	SUM(CASE
		WHEN bf.marketing_channel_group = 'Paid' AND COALESCE(ab.invoiced_orders_brand, 0) = 0 THEN at.invoiced_orders_adjusted
		WHEN bf.marketing_channel_group = 'Paid' THEN at.invoiced_orders_adjusted * bf.referral_factor * bf.brand_factor
		WHEN bf.marketing_channel_group = 'Brand' AND COALESCE(ab.invoiced_orders_brand, 0) = 0 THEN 0
		WHEN bf.marketing_channel_group = 'Brand' AND COALESCE(ab.invoiced_orders_paid, 0) = 0 THEN at.invoiced_orders_adjusted
		WHEN bf.marketing_channel_group = 'Brand' THEN at.invoiced_orders_adjusted-((ab.invoiced_orders_paid_adjusted-ab.invoiced_orders_paid)*(at.invoiced_orders_adjusted/ab.invoiced_orders_brand)) END) 
	as invoiced_orders_adjusted,

	SUM(CASE
		WHEN bf.marketing_channel_group = 'Paid' AND COALESCE(ab.sales_sent_brand, 0) = 0 THEN at.sales_sent_adjusted
		WHEN bf.marketing_channel_group = 'Paid' THEN at.sales_sent_adjusted * bf.referral_factor * bf.brand_factor
		WHEN bf.marketing_channel_group = 'Brand' AND COALESCE(ab.sales_sent_brand, 0) = 0 THEN 0
		WHEN bf.marketing_channel_group = 'Brand' AND COALESCE(ab.sales_sent_paid, 0) = 0 THEN at.sales_sent_adjusted
		WHEN bf.marketing_channel_group = 'Brand' THEN at.sales_sent_adjusted-((ab.sales_sent_paid_adjusted-ab.sales_sent_paid)*(at.sales_sent_adjusted/ab.sales_sent_brand)) END) 
	as sales_sent_adjusted,

	SUM(CASE
		WHEN bf.marketing_channel_group = 'Paid' AND COALESCE(ab.sales_kept_brand, 0) = 0 THEN at.sales_kept_adjusted
		WHEN bf.marketing_channel_group = 'Paid' THEN at.sales_kept_adjusted * bf.referral_factor * bf.brand_factor
		WHEN bf.marketing_channel_group = 'Brand' AND COALESCE(ab.sales_kept_brand, 0) = 0 THEN 0
		WHEN bf.marketing_channel_group = 'Brand' AND COALESCE(ab.sales_kept_paid, 0) = 0 THEN at.sales_kept_adjusted
		WHEN bf.marketing_channel_group = 'Brand' THEN at.sales_kept_adjusted-((ab.sales_kept_paid_adjusted-ab.sales_kept_paid)*(at.sales_kept_adjusted/ab.sales_kept_brand)) END) 
	as sales_kept_adjusted,

	SUM(CASE
		WHEN bf.marketing_channel_group = 'Paid' AND COALESCE(ab.billing_total_brand, 0) = 0 THEN at.billing_total_adjusted
		WHEN bf.marketing_channel_group = 'Paid' THEN at.billing_total_adjusted * bf.referral_factor * bf.brand_factor
		WHEN bf.marketing_channel_group = 'Brand' AND COALESCE(ab.billing_total_brand, 0) = 0 THEN 0
		WHEN bf.marketing_channel_group = 'Brand' AND COALESCE(ab.billing_total_paid, 0) = 0 THEN at.billing_total_adjusted
		WHEN bf.marketing_channel_group = 'Brand' THEN at.billing_total_adjusted-((ab.billing_total_paid_adjusted-ab.billing_total_paid)*(at.billing_total_adjusted/ab.billing_total_brand)) END) 
	as billing_total_adjusted,

	SUM(CASE
		WHEN bf.marketing_channel_group = 'Paid' AND COALESCE(ab.billing_net_sales_brand, 0) = 0 THEN at.billing_net_sales_adjusted
		WHEN bf.marketing_channel_group = 'Paid' THEN at.billing_net_sales_adjusted * bf.referral_factor * bf.brand_factor
		WHEN bf.marketing_channel_group = 'Brand' AND COALESCE(ab.billing_net_sales_brand, 0) = 0 THEN 0
		WHEN bf.marketing_channel_group = 'Brand' AND COALESCE(ab.billing_net_sales_paid, 0) = 0 THEN at.billing_net_sales_adjusted
		WHEN bf.marketing_channel_group = 'Brand' THEN at.billing_net_sales_adjusted-((ab.billing_net_sales_paid_adjusted-ab.billing_net_sales_paid)*(at.billing_net_sales_adjusted/ab.billing_net_sales_brand)) END) 
	as billing_net_sales_adjusted

FROM bi.marketing_crm_attribution at
LEFT JOIN dwh.marketing_investor_reporting_brand_factors bf ON bf.domain=at.domain AND bf.marketing_channel=at.marketing_channel
LEFT JOIN
(
  SELECT 
	at.reporting_type,
	at."date", 
	at.domain, 

	SUM(CASE WHEN bf.marketing_channel_group = 'Paid' THEN at.incoming_orders_adjusted * bf.referral_factor * bf.brand_factor ELSE null END) as incoming_orders_paid_adjusted,
	SUM(CASE WHEN bf.marketing_channel_group = 'Paid' THEN at.incoming_orders_adjusted ELSE null END) as incoming_orders_paid,
	SUM(CASE WHEN bf.marketing_channel_group = 'Brand' THEN at.incoming_orders_adjusted ELSE null END) as incoming_orders_brand,
	SUM(at.incoming_orders_adjusted) as incoming_orders_total,

	SUM(CASE WHEN bf.marketing_channel_group = 'Paid' THEN at.invoiced_orders_adjusted * bf.referral_factor * bf.brand_factor ELSE null END) as invoiced_orders_paid_adjusted,
	SUM(CASE WHEN bf.marketing_channel_group = 'Paid' THEN at.invoiced_orders_adjusted ELSE null END) as invoiced_orders_paid,
	SUM(CASE WHEN bf.marketing_channel_group = 'Brand' THEN at.invoiced_orders_adjusted ELSE null END) as invoiced_orders_brand,
	SUM(at.invoiced_orders_adjusted) as invoiced_orders_total,

	SUM(CASE WHEN bf.marketing_channel_group = 'Paid' THEN at.sales_sent_adjusted * bf.referral_factor * bf.brand_factor ELSE null END) as sales_sent_paid_adjusted,
	SUM(CASE WHEN bf.marketing_channel_group = 'Paid' THEN at.sales_sent_adjusted ELSE null END) as sales_sent_paid,
	SUM(CASE WHEN bf.marketing_channel_group = 'Brand' THEN at.sales_sent_adjusted ELSE null END) as sales_sent_brand,
	SUM(at.sales_sent_adjusted) as sales_sent_total,

	SUM(CASE WHEN bf.marketing_channel_group = 'Paid' THEN at.sales_kept_adjusted * bf.referral_factor * bf.brand_factor ELSE null END) as sales_kept_paid_adjusted,
	SUM(CASE WHEN bf.marketing_channel_group = 'Paid' THEN at.sales_kept_adjusted ELSE null END) as sales_kept_paid,
	SUM(CASE WHEN bf.marketing_channel_group = 'Brand' THEN at.sales_kept_adjusted ELSE null END) as sales_kept_brand,
	SUM(at.sales_kept_adjusted) as sales_kept_total,

	SUM(CASE WHEN bf.marketing_channel_group = 'Paid' THEN at.billing_total_adjusted * bf.referral_factor * bf.brand_factor ELSE null END) as billing_total_paid_adjusted,
	SUM(CASE WHEN bf.marketing_channel_group = 'Paid' THEN at.billing_total_adjusted ELSE null END) as billing_total_paid,
	SUM(CASE WHEN bf.marketing_channel_group = 'Brand' THEN at.billing_total_adjusted ELSE null END) as billing_total_brand,
	SUM(at.billing_total_adjusted) as billing_total_total,

	SUM(CASE WHEN bf.marketing_channel_group = 'Paid' THEN at.billing_net_sales_adjusted * bf.referral_factor * bf.brand_factor ELSE null END) as billing_net_sales_paid_adjusted,
	SUM(CASE WHEN bf.marketing_channel_group = 'Paid' THEN at.billing_net_sales_adjusted ELSE null END) as billing_net_sales_paid,
	SUM(CASE WHEN bf.marketing_channel_group = 'Brand' THEN at.billing_net_sales_adjusted ELSE null END) as billing_net_sales_brand,
	SUM(at.billing_net_sales_adjusted) as billing_net_sales_total

  FROM bi.marketing_crm_attribution at
  LEFT JOIN dwh.marketing_investor_reporting_brand_factors bf ON bf.domain=at.domain AND bf.marketing_channel=at.marketing_channel
  GROUP BY 1,2,3
) ab on ab."date"=at."date" AND ab.domain=at.domain AND ab.reporting_type=at.reporting_type
GROUP BY 1,2,3,4


