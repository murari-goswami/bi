-- Name: sandbox.mc2
-- Created: 2015-06-26 15:55:38
-- Updated: 2015-06-26 16:12:23

CREATE view sandbox.mc2 as


  SELECT
    mc.date_created,
    mc.country,
    mc.marketing_channel,
    mc.cost as cost_date_incoming,
    CASE WHEN amc.actual_costs_total is null OR amc.actual_costs_total = 0 THEN null
    ELSE mc.cost/amc.actual_costs_total*cmc.attributed_costs_total END as cost_date_invoiced
  FROM
  ( 
    SELECT
      date_created,
      country,
      marketing_channel,
      SUM(CAST(cost as decimal)) as cost    
    FROM raw.marketing_costs
    GROUP BY 1,2,3
  ) mc
  LEFT JOIN
  (
   SELECT 
      date_invoiced as "date",
      country,
      SUM(CAST(cost as decimal)*-1) as attributed_costs_total
    FROM bi.company_costs_marketing 
    GROUP BY 1,2
  ) cmc ON mc.date_created = cmc.date AND mc.country = cmc.country
  LEFT JOIN
    (
      SELECT  
        date_created as "date",
        country,
        SUM(CAST(cost as decimal)) as actual_costs_total
    FROM raw.marketing_costs
    GROUP BY 1,2  
  ) amc ON mc.date_created = amc.date AND mc.country = amc.country


