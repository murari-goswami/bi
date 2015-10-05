-- Name: sandbox.marketing_attribution_referral_brand_effect
-- Created: 2015-06-04 14:18:00
-- Updated: 2015-06-08 15:33:39

CREATE VIEW sandbox.marketing_attribution_referral_brand_effect
AS
SELECT 
	at.date_incoming, 
	at.domain,
	at.reporting_type, 
	at.order_type, 
	at.marketing_channel,
	SUM(CASE
			WHEN bf.marketing_channel = 'Facebook' OR bf.marketing_channel = 'TV' THEN at.incoming_orders_adjusted * bf.referral_factor * bf.brand_factor
			WHEN bf.marketing_channel_group = 'Paid' THEN at.incoming_orders_adjusted * bf.referral_factor
			WHEN bf.marketing_channel_group = 'Brand' THEN at.incoming_orders_adjusted-((ab.incoming_orders_paid_adjusted-ab.incoming_orders_paid)*(at.incoming_orders_adjusted/ab.incoming_orders_brand)) END) 
	as incoming_orders_adjusted,
		SUM(CASE
			WHEN bf.marketing_channel = 'Facebook' OR bf.marketing_channel = 'TV' THEN at.invoiced_orders_adjusted * bf.referral_factor * bf.brand_factor
			WHEN bf.marketing_channel_group = 'Paid' THEN at.invoiced_orders_adjusted * bf.referral_factor
			WHEN bf.marketing_channel_group = 'Brand' AND (ab.invoiced_orders_brand = 0 OR ab.invoiced_orders_brand is null) THEN null
			WHEN bf.marketing_channel_group = 'Brand' THEN at.invoiced_orders_adjusted-((ab.invoiced_orders_paid_adjusted-ab.invoiced_orders_paid)*(at.invoiced_orders_adjusted/ab.invoiced_orders_brand)) END) 
	as invoiced_orders_adjusted
FROM sandbox.marketing_attribution_crm at
LEFT JOIN dwh.marketing_investor_reporting_brand_factors bf ON bf.domain=at.domain AND bf.marketing_channel=at.marketing_channel
LEFT JOIN
(
	SELECT 
		at.date_incoming, 
		at.domain, 
		at.reporting_type, 
		at.order_type, 
		SUM(CASE WHEN bf.marketing_channel_group = 'Paid' THEN at.incoming_orders_adjusted * bf.referral_factor * bf.brand_factor ELSE null END) as incoming_orders_paid_adjusted,
		SUM(CASE WHEN bf.marketing_channel_group = 'Paid' THEN at.incoming_orders_adjusted ELSE null END) as incoming_orders_paid,
		SUM(CASE WHEN bf.marketing_channel_group = 'Brand' THEN at.incoming_orders_adjusted ELSE null END) as incoming_orders_brand,
		SUM(at.incoming_orders_adjusted) as incoming_orders_total,
		SUM(CASE WHEN bf.marketing_channel_group = 'Paid' THEN at.invoiced_orders_adjusted * bf.referral_factor * bf.brand_factor ELSE null END) as invoiced_orders_paid_adjusted,
		SUM(CASE WHEN bf.marketing_channel_group = 'Paid' THEN at.invoiced_orders_adjusted ELSE null END) as invoiced_orders_paid,
		SUM(CASE WHEN bf.marketing_channel_group = 'Brand' THEN at.invoiced_orders_adjusted ELSE null END) as invoiced_orders_brand,
		SUM(at.invoiced_orders_adjusted) as invoiced_orders_total		
	FROM sandbox.marketing_attribution_crm at
	LEFT JOIN dwh.marketing_investor_reporting_brand_factors bf ON bf.domain=at.domain AND bf.marketing_channel=at.marketing_channel
	GROUP BY 1,2,3,4
) ab on ab.date_incoming=at.date_incoming AND ab.domain=at.domain AND ab.reporting_type=at.reporting_type AND ab.order_type = at.order_type
GROUP BY 1,2,3,4,5


