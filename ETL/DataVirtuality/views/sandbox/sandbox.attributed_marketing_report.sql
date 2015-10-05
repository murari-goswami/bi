-- Name: sandbox.attributed_marketing_report
-- Created: 2015-08-07 14:09:40
-- Updated: 2015-08-07 16:15:11

CREATE VIEW sandbox.attributed_marketing_report
AS


SELECT
  ab.reporting_type,
  ab.date,
  CASE
  	WHEN ab."date" < CURDATE() THEN 'Actuals'
  	ELSE 'Forecast'
  END AS forecast_or_actuals,
  ab.year_month,
  ab.year_week,
  ab.domain,
  ab.marketing_channel,
  ab.days_in_week,
  ab.days_week_passed,
  ab.days_in_month,
  ab.days_month_passed,   
  at.incoming_first_orders,
  at.invoiced_first_orders,
  at.sales_sent,
  at.sales_kept,
  at.billing_net_sales,
  SUM(vi.visits) as visits,
  SUM(CASE WHEN ab.reporting_type = 'date_incoming' THEN mc2.cost_date_incoming ELSE mc2.cost_date_invoiced END) AS cost
FROM
(
SELECT
    rt.reporting_type,
    c.date,
    c.year_month,
    c.year_week,
    x.domain,
    y.marketing_channel,
    we.days_in_week,
    we.days_week_passed,
    mo.days_in_month,
    mo.days_month_passed    
FROM dwh.calendar c 
CROSS JOIN (SELECT domain FROM raw.ga_visits WHERE domain != 'ALL' GROUP BY 1) x
CROSS JOIN 
(
  SELECT marketing_channel FROM dwh.marketing_sub_channels GROUP BY 1
) y
CROSS JOIN 
(
  SELECT 'date_incoming' as reporting_type UNION SELECT 'date_invoiced' as reporting_type) rt
LEFT JOIN
(
  SELECT
    year_week,
    COUNT("date") AS days_in_week,
    SUM(CASE WHEN "date" < CURDATE() THEN 1 ELSE 0 END) AS days_week_passed
  FROM dwh.calendar
  GROUP BY 1
) we ON we.year_week = c.year_week
LEFT JOIN
(
  SELECT
    year_month,
    COUNT("date") AS days_in_month,
    SUM(CASE WHEN "date" <= TIMESTAMPADD(SQL_TSI_DAY,-1,CURDATE()) THEN 1 ELSE 0 END) AS days_month_passed
  FROM dwh.calendar
  GROUP BY 1
) mo ON mo.year_month = c.year_month
WHERE c.date >= '2013-01-01'
AND last_day_of_week < TIMESTAMPADD(SQL_TSI_DAY,7,CURDATE())
) ab
LEFT JOIN 
(
  SELECT
    reporting_type,
    "date",
    domain,
    marketing_channel,
    SUM(incoming_first_orders) as incoming_first_orders,
    SUM(invoiced_first_orders) as invoiced_first_orders,
    SUM(sales_sent) as sales_sent,
    SUM(sales_kept) as sales_kept,
    SUM(billing_net_sales) as billing_net_sales
  FROM bi.marketing_order_attribution_aggregated
  GROUP BY 1,2,3,4
) at ON at.reporting_type = ab.reporting_type AND ab.date = at.date AND ab.domain = at.domain AND ab.marketing_channel = at.marketing_channel 
LEFT JOIN
(
  SELECT 
    date_created,
    domain,
    marketing_channel,
    SUM(visits) as visits
  FROM raw.daily_visits
  GROUP BY 1,2,3
) vi ON vi.date_created = ab.date AND vi.domain = ab.domain AND vi.marketing_channel = ab.marketing_channel
LEFT JOIN
(
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
    WHERE CAST(date_created AS DATE) < CURDATE()
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
    WHERE CAST(date_created AS DATE) < CURDATE()
    GROUP BY 1,2  
  ) amc ON mc.date_created = amc.date AND mc.country = amc.country
) mc2 ON mc2.date_created = ab."date" AND mc2.country = ab.domain AND mc2.marketing_channel = ab.marketing_channel
GROUP BY 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16


