-- Name: bi.marketing_crm_attribution
-- Created: 2015-06-11 17:39:58
-- Updated: 2015-09-07 16:48:05

CREATE VIEW bi.marketing_crm_attribution
AS

SELECT  
	at."date", 
	at.domain, 
	at.reporting_type, 
	at.marketing_channel, 
	SUM(CASE 
		WHEN at.marketing_channel = 'CRM' THEN null 
		WHEN bf.marketing_channel_group = 'Brand' THEN at.incoming_orders_adjusted 
		WHEN bf.marketing_channel_group = 'Paid' AND tot.incoming_orders_total is null THEN null 
		WHEN bf.marketing_channel_group = 'Paid' AND tot.incoming_orders_crm is null THEN at.incoming_orders_adjusted 
		WHEN bf.marketing_channel_group = 'Paid' AND tot.incoming_orders_total is null THEN at.incoming_orders_adjusted 
		WHEN bf.marketing_channel_group = 'Paid' AND tot.incoming_orders_paid is null OR tot.incoming_orders_paid = 0 THEN at.incoming_orders_adjusted 
		ELSE at.incoming_orders_adjusted+((at.incoming_orders_adjusted/tot.incoming_orders_paid)*tot.incoming_orders_crm) END) 
	 as incoming_orders_adjusted,
		
	SUM(CASE 
		WHEN at.marketing_channel = 'CRM' THEN null 
		WHEN bf.marketing_channel_group = 'Brand' THEN at.invoiced_orders_adjusted 
		WHEN bf.marketing_channel_group = 'Paid' AND tot.invoiced_orders_total is null THEN null 
		WHEN bf.marketing_channel_group = 'Paid' AND tot.invoiced_orders_crm is null THEN at.invoiced_orders_adjusted 
		WHEN bf.marketing_channel_group = 'Paid' AND tot.invoiced_orders_total is null THEN at.invoiced_orders_adjusted 
		WHEN bf.marketing_channel_group = 'Paid' AND tot.invoiced_orders_paid is null OR tot.invoiced_orders_paid = 0 THEN at.invoiced_orders_adjusted 
		ELSE at.invoiced_orders_adjusted+((at.invoiced_orders_adjusted/tot.invoiced_orders_paid)*tot.invoiced_orders_crm) END) 
	as invoiced_orders_adjusted,

	SUM(CASE 
		WHEN at.marketing_channel = 'CRM' THEN null 
		WHEN bf.marketing_channel_group = 'Brand' THEN at.sales_kept_adjusted 
		WHEN bf.marketing_channel_group = 'Paid' AND tot.sales_kept_total is null THEN null 
		WHEN bf.marketing_channel_group = 'Paid' AND tot.sales_kept_crm is null THEN at.sales_kept_adjusted 
		WHEN bf.marketing_channel_group = 'Paid' AND tot.sales_kept_total is null THEN at.sales_kept_adjusted 
		WHEN bf.marketing_channel_group = 'Paid' AND tot.sales_kept_paid is null OR tot.sales_kept_paid = 0 THEN at.sales_kept_adjusted 
		ELSE at.sales_kept_adjusted+((at.sales_kept_adjusted/tot.sales_kept_paid)*tot.sales_kept_crm) END) 
	as sales_kept_adjusted,

	SUM(CASE 
		WHEN at.marketing_channel = 'CRM' THEN null 
		WHEN bf.marketing_channel_group = 'Brand' THEN at.sales_sent_adjusted 
		WHEN bf.marketing_channel_group = 'Paid' AND tot.sales_sent_total is null THEN null 
		WHEN bf.marketing_channel_group = 'Paid' AND tot.sales_sent_crm is null THEN at.sales_sent_adjusted 
		WHEN bf.marketing_channel_group = 'Paid' AND tot.sales_sent_total is null THEN at.sales_sent_adjusted 
		WHEN bf.marketing_channel_group = 'Paid' AND tot.sales_sent_paid is null OR tot.sales_sent_paid = 0 THEN at.sales_sent_adjusted 
		ELSE at.sales_sent_adjusted+((at.sales_sent_adjusted/tot.sales_sent_paid)*tot.sales_sent_crm) END) 
	as sales_sent_adjusted,

	SUM(CASE 
		WHEN at.marketing_channel = 'CRM' THEN null 
		WHEN bf.marketing_channel_group = 'Brand' THEN at.billing_total_adjusted 
		WHEN bf.marketing_channel_group = 'Paid' AND tot.billing_total_total is null THEN null 
		WHEN bf.marketing_channel_group = 'Paid' AND tot.billing_total_crm is null THEN at.billing_total_adjusted 
		WHEN bf.marketing_channel_group = 'Paid' AND tot.billing_total_total is null THEN at.billing_total_adjusted 
		WHEN bf.marketing_channel_group = 'Paid' AND tot.billing_total_paid is null OR tot.billing_total_paid = 0 THEN at.billing_total_adjusted 
		ELSE at.billing_total_adjusted+((at.billing_total_adjusted/tot.billing_total_paid)*tot.billing_total_crm) END) 
	as billing_total_adjusted,

	SUM(CASE 
		WHEN at.marketing_channel = 'CRM' THEN null 
		WHEN bf.marketing_channel_group = 'Brand' THEN at.billing_net_sales_adjusted 
		WHEN bf.marketing_channel_group = 'Paid' AND tot.billing_net_sales_total is null THEN null 
		WHEN bf.marketing_channel_group = 'Paid' AND tot.billing_net_sales_crm is null THEN at.billing_net_sales_adjusted 
		WHEN bf.marketing_channel_group = 'Paid' AND tot.billing_net_sales_total is null THEN at.billing_net_sales_adjusted 
		WHEN bf.marketing_channel_group = 'Paid' AND tot.billing_net_sales_paid is null OR tot.billing_net_sales_paid = 0 THEN at.billing_net_sales_adjusted 
		ELSE at.billing_net_sales_adjusted+((at.billing_net_sales_adjusted/tot.billing_net_sales_paid)*tot.billing_net_sales_crm) END) 
	as billing_net_sales_adjusted

FROM bi.marketing_untracked_attribution at 
LEFT JOIN 
( 
	SELECT  
		ab."date", 
		ab.domain, 
		ab.reporting_type, 

		SUM(ab.invoiced_orders_adjusted) as invoiced_orders_total, 
		SUM(CASE WHEN bf.marketing_channel_group = 'CRM' THEN ab.invoiced_orders_adjusted ELSE 0 END) as invoiced_orders_crm,
		SUM(CASE WHEN bf.marketing_channel_group = 'Paid' THEN ab.invoiced_orders_adjusted ELSE 0 END) as invoiced_orders_paid,  
		
		SUM(ab.incoming_orders_adjusted) as incoming_orders_total, 
		SUM(CASE WHEN bf.marketing_channel_group = 'CRM' THEN ab.incoming_orders_adjusted ELSE 0 END) as incoming_orders_crm,
		SUM(CASE WHEN bf.marketing_channel_group = 'Paid' THEN ab.incoming_orders_adjusted ELSE 0 END) as incoming_orders_paid,

		SUM(ab.sales_kept_adjusted) as sales_kept_total, 
		SUM(CASE WHEN bf.marketing_channel_group = 'CRM' THEN ab.sales_kept_adjusted ELSE 0 END) as sales_kept_crm,
		SUM(CASE WHEN bf.marketing_channel_group = 'Paid' THEN ab.sales_kept_adjusted ELSE 0 END) as sales_kept_paid,

		SUM(ab.sales_sent_adjusted) as sales_sent_total, 
		SUM(CASE WHEN bf.marketing_channel_group = 'CRM' THEN ab.sales_sent_adjusted ELSE 0 END) as sales_sent_crm,
		SUM(CASE WHEN bf.marketing_channel_group = 'Paid' THEN ab.sales_sent_adjusted ELSE 0 END) as sales_sent_paid,

		SUM(ab.billing_total_adjusted) as billing_total_total, 
		SUM(CASE WHEN bf.marketing_channel_group = 'CRM' THEN ab.billing_total_adjusted ELSE 0 END) as billing_total_crm,
		SUM(CASE WHEN bf.marketing_channel_group = 'Paid' THEN ab.billing_total_adjusted ELSE 0 END) as billing_total_paid,

		SUM(ab.billing_net_sales_adjusted) as billing_net_sales_total, 
		SUM(CASE WHEN bf.marketing_channel_group = 'CRM' THEN ab.billing_net_sales_adjusted ELSE 0 END) as billing_net_sales_crm,
		SUM(CASE WHEN bf.marketing_channel_group = 'Paid' THEN ab.billing_net_sales_adjusted ELSE 0 END) as billing_net_sales_paid

	FROM bi.marketing_untracked_attribution ab 
 	LEFT JOIN dwh.marketing_investor_reporting_brand_factors bf ON bf.domain=ab.domain AND bf.marketing_channel=ab.marketing_channel 
 	GROUP  BY 1,2,3
) tot ON tot."date" = at."date" AND tot.domain=at.domain AND tot.reporting_type = at.reporting_type 
LEFT JOIN dwh.marketing_investor_reporting_brand_factors bf ON bf.domain=at.domain AND bf.marketing_channel=at.marketing_channel 
GROUP BY 1,2,3,4


