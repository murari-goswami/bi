-- Name: sandbox.marketing_overview
-- Created: 2015-04-24 18:25:50
-- Updated: 2015-04-24 18:25:50

CREATE VIEW sandbox.marketing_overview
AS
SELECT
  pl.date as date_created,
  pl.domain,
  pl.marketing_channel,
  ab.incoming_first_orders,
  ab.invoiced_first_orders,
  inc.actual_invoiced_first_orders,
  ab.sales_sent,
  ab.sales_kept,
  ab.billing_net_sales,
  mc3.cost,
  CAST(cd.visits as BIGINT) as visits,
  amc.actual_costs_total
                               FROM
(
    SELECT
    c.date,
        x.domain,
        y.marketing_channel
    FROM dwh.calendar c 
    CROSS JOIN (SELECT domain FROM raw.ga_visits WHERE domain != 'ALL' GROUP BY 1) x
    CROSS JOIN 
    (
  SELECT marketing_channel FROM dwh.marketing_sub_channels GROUP BY 1
  ) y
    WHERE c.date > '2012'
    AND c.date < CURDATE()
    ) pl
    LEFT JOIN
    (
    SELECT 
      cast(co.date_incoming as date) as date_incoming,
      cu.default_domain,
      CASE
        WHEN oa.marketing_channel is null AND co.sales_channel like '%website%' THEN 'Website not tracked'
        WHEN oa.marketing_channel is null AND co.sales_channel not like '%website%' THEN 'Other not tracked'
        ELSE oa.marketing_channel
      END as marketing_channel,
      SUM(ROUND(oa.contact_weight,2)) as incoming_first_orders,
      SUM(CASE WHEN co.date_invoiced is not null AND co.order_state_number >= 16 THEN ROUND(oa.contact_weight,2) ELSE 0 END) as invoiced_first_orders,
      ROUND(SUM(oa.contact_weight*co.sales_sent),2) as sales_sent,
      ROUND(SUM(oa.contact_weight*co.sales_kept),2) as sales_kept,
      ROUND(SUM(oa.contact_weight*co.billing_net_sales),2) as billing_net_sales 
    FROM bi.customer_order co
    LEFT JOIN bi.marketing_order_attribution oa ON oa.order_id = co.order_id
    LEFT JOIN "bi.customer" cu ON cu.customer_id = co.customer_id
    WHERE co.date_incoming is not null
    AND co.is_real_order = 'Real Order'
    AND order_type = 'First Order'
    GROUP BY 1,2,3
) ab ON pl.date = ab.date_incoming AND ab.default_domain = pl.domain AND pl.marketing_channel = ab.marketing_channel
LEFT JOIN 
( 
      SELECT 
      cast(co.date_invoiced as date) as "date",
      cu.default_domain,
      CASE
        WHEN oa.marketing_channel is null AND co.sales_channel like '%website%' THEN 'Website not tracked'
        WHEN oa.marketing_channel is null AND co.sales_channel not like '%website%' THEN 'Other not tracked'
        ELSE oa.marketing_channel
      END as marketing_channel,
      SUM(ROUND(oa.contact_weight,2)) as actual_invoiced_first_orders
    FROM bi.customer_order co
    LEFT JOIN bi.marketing_order_attribution oa ON oa.order_id = co.order_id
    LEFT JOIN "bi.customer" cu ON cu.customer_id = co.customer_id
    WHERE co.date_invoiced is not null
    AND co.is_real_order = 'Real Order'
    AND order_type = 'First Order'
    AND co.order_state_number >= 16
    AND co.order_state_number < 2048 
    GROUP BY 1,2,3
) inc ON pl.date = inc.date AND inc.default_domain = pl.domain AND pl.marketing_channel = inc.marketing_channel
LEFT JOIN
(
     SELECT 
        date_created,
        domain,
        marketing_channel,
        SUM(visits) as visits
      FROM raw.ga_visits
      WHERE domain != 'ALL'
      GROUP BY 1,2,3
) cd ON cd.date_created = pl.date AND cd.domain = pl.domain AND cd.marketing_channel = pl.marketing_channel
LEFT JOIN
(
        SELECT
            mc2.date_created,
            mc2.country,
            mc2.marketing_channel,
            SUM(mc2.cost) as cost
        FROM
        (
            SELECT 
                mc.date_created,
                mc.country,
                CASE 
                  WHEN mc.channel = 'google gdn' THEN 'Display'
                  WHEN mc.channel = 'google sem' THEN 'SEM Non-brand'
                  WHEN mc.channel = 'display' THEN 'Display'
                  WHEN mc.channel = 'facebook' THEN 'Facebook'
                  WHEN mc.channel = 'affiliate' THEN 'Affiliate'
                  WHEN mc.channel = 'crm' THEN 'CRM'
                  WHEN mc.channel = 'kooperation' THEN 'Cooperations'
                  WHEN mc.channel = 'praemienprogramm' THEN 'Cooperations'
                  WHEN mc.channel = 'remarketing' THEN 'Remarketing'
                  WHEN mc.channel = 'seo/direct' THEN 'SEO'
                  WHEN mc.channel = 'tv' THEN 'TV'
                  WHEN mc.channel = 'twitter' THEN 'Social Media' 
                  WHEN mc.channel = 'youtube' THEN 'Social Media'
                  WHEN mc.channel = 'google sem brand' THEN 'SEM Brand'
                  WHEN mc.channel = 'google sem nobrand' THEN 'SEM Non-brand'
                  WHEN mc.channel = 'app download campaign' THEN 'App campaign'
                END as marketing_channel, 
                  mc.cost
            FROM raw.marketing_costs mc
      ) mc2
      GROUP BY 1,2,3
) mc3 ON pl.date = mc3.date_created AND mc3.country = pl.domain AND mc3.marketing_channel = pl.marketing_channel
/* LEFT JOIN
(
 SELECT 
	  date_invoiced as "date",
	  country,
	  SUM(cost*-1) as attributed_costs_total
  FROM bi.company_costs_marketing 
  GROUP BY 1,2
) cmc ON pl.date = cmc.date AND pl.domain = cmc.country */
 LEFT JOIN
  (
    SELECT  
	    date_created as "date",
    	country,
    	SUM(cost) as actual_costs_total
  FROM raw.marketing_costs
  GROUP BY 1,2  
) amc ON pl.date = amc.date AND pl.domain = amc.country


