-- Name: tableau.mkt_marketing_investor_reporting
-- Created: 2015-06-09 18:34:10
-- Updated: 2015-09-07 17:22:53

CREATE VIEW tableau.mkt_marketing_investor_reporting
AS

SELECT
	ab.reporting_type,
  	ab."date", 
  	ab.domain, 
  	ab.marketing_channel, 
  	ad.incoming_orders_adjusted, 
  	ad.invoiced_orders_adjusted,
  	ad.sales_sent_adjusted,
  	ad.sales_kept_adjusted,
  	ad.billing_total_adjusted,
  	ad.billing_net_sales_adjusted,
  	CASE 
		WHEN ab.reporting_type = 'date_incoming' THEN SUM(mc3.cost)
		WHEN ab.reporting_type = 'date_invoiced' AND (SUM(cmc.attributed_costs_total) is null OR SUM(cmc.attributed_costs_total) = 0) THEN null
	 	WHEN ab.reporting_type = 'date_invoiced' AND (SUM(amc.actual_costs_total) is null OR SUM(amc.actual_costs_total) = 0)  THEN null
	 	ELSE (SUM(mc3.cost)/SUM(amc.actual_costs_total))*SUM(cmc.attributed_costs_total)
  	END as cost  
FROM
(
  SELECT
		rt.reporting_type,
	 	c.date,
	 	x.domain,
	 	y.marketing_channel
  	FROM dwh.calendar c 
  	CROSS JOIN (SELECT domain FROM raw.ga_visits WHERE domain != 'ALL' GROUP BY 1) x
  	CROSS JOIN 
  	(
  	SELECT marketing_channel FROM dwh.marketing_sub_channels GROUP BY 1
  	) y
  	CROSS JOIN (SELECT 'date_incoming' as reporting_type UNION SELECT 'date_invoiced' as reporting_type) rt
  	WHERE c.date > '2012'
  	AND c.date < CURDATE()
) ab
LEFT JOIN bi.marketing_referral_brand_effect_attribution ad ON ad.reporting_type = ab.reporting_type AND ad."date"=ab."date" AND ad.domain=ab.domain AND ad.marketing_channel=ab.marketing_channel
LEFT JOIN
(
	SELECT
		mc2.date_created,
		 mc2.country,
		 mc2.marketing_channel,
		 SUM(mc2.cost) as cost    
	FROM raw.marketing_costs mc2
	GROUP BY 1,2,3
) mc3 ON ab."date" = mc3.date_created AND mc3.country = ab.domain AND mc3.marketing_channel = ab.marketing_channel
LEFT JOIN
(
 SELECT 
	 date_invoiced as "date",
	 country,
	 SUM(CAST(cost as decimal)*-1) as attributed_costs_total
  FROM bi.company_costs_marketing 
  GROUP BY 1,2
) cmc ON ab."date" = cmc."date" AND ab.domain = cmc.country
LEFT JOIN
(
  SELECT  
		 date_created as "date",
		country,
		SUM(CAST(cost as decimal)) as actual_costs_total
  FROM raw.marketing_costs
  GROUP BY 1,2  
) amc ON ab."date" = amc."date" AND ab.domain = amc.country
GROUP BY 1,2,3,4,5,6,7,8,9,10


