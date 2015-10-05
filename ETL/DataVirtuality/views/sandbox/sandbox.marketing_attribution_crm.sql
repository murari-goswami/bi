-- Name: sandbox.marketing_attribution_crm
-- Created: 2015-06-02 16:00:05
-- Updated: 2015-06-05 18:27:13

CREATE view sandbox.marketing_attribution_crm
AS
SELECT  
	at.date_incoming, 
	at.domain, 
	at.reporting_type, 
	at.order_type, 
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
	 as invoiced_orders_adjusted
FROM sandbox.marketing_order_attribution_new at 
LEFT JOIN 
( 
 SELECT  
  ab.date_incoming, 
  ab.domain, 
  ab.order_type, 
  ab.reporting_type, 
  SUM(ab.invoiced_orders_adjusted) as invoiced_orders_total, 
  SUM(CASE WHEN bf.marketing_channel_group = 'CRM' THEN ab.invoiced_orders_adjusted ELSE 0 END) as invoiced_orders_crm,
  SUM(CASE WHEN bf.marketing_channel_group = 'Paid' THEN ab.invoiced_orders_adjusted ELSE 0 END) as invoiced_orders_paid,  
  SUM(ab.incoming_orders_adjusted) as incoming_orders_total, 
  SUM(CASE WHEN bf.marketing_channel_group = 'CRM' THEN ab.incoming_orders_adjusted ELSE 0 END) as incoming_orders_crm,
  SUM(CASE WHEN bf.marketing_channel_group = 'Paid' THEN ab.incoming_orders_adjusted ELSE 0 END) as incoming_orders_paid
 FROM sandbox.marketing_order_attribution_new ab 
 LEFT JOIN dwh.marketing_investor_reporting_brand_factors bf ON bf.domain=ab.domain AND bf.marketing_channel=ab.marketing_channel 
 GROUP  BY 1,2,3,4 
) tot ON tot.date_incoming = at.date_incoming AND tot.domain=at.domain AND tot.order_type=at.order_type AND tot.reporting_type = at.reporting_type 
LEFT JOIN dwh.marketing_investor_reporting_brand_factors bf ON bf.domain=at.domain AND bf.marketing_channel=at.marketing_channel 
GROUP BY 1,2,3,4,5


