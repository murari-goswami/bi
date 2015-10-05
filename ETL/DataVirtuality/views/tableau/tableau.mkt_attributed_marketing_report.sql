-- Name: tableau.mkt_attributed_marketing_report
-- Created: 2015-06-11 14:15:03
-- Updated: 2015-09-02 17:15:55

CREATE VIEW tableau.mkt_attributed_marketing_report
AS 


WITH agg AS
(
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
    SUM(CASE WHEN "date" < TIMESTAMPADD(SQL_TSI_DAY,-1,CURDATE()) THEN 1 ELSE 0 END) AS days_month_passed
  FROM dwh.calendar
  GROUP BY 1
) mo ON mo.year_month = c.year_month
WHERE c.date >= '2013-01-01'
AND last_day_of_month < TIMESTAMPADD(SQL_TSI_MONTH,1,CURDATE())
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
)





SELECT 
  at.reporting_type,
  at."date",
  at.forecast_or_actuals,
  CASE 
    WHEN at.year_week > YEAR(TIMESTAMPADD(SQL_TSI_DAY,-2,CURDATE()))||'-'||WEEK(TIMESTAMPADD(SQL_TSI_DAY,-2,CURDATE())) THEN 1
    ELSE 0
  END AS monthly_runrate,  
  at.domain,
  at.marketing_channel,
  SUM(CASE
    WHEN forecast_or_actuals = 'Actuals' THEN at.incoming_first_orders
    WHEN at.days_week_passed = 0 THEN mo.incoming_first_orders_monthly / at.days_month_passed
    ELSE we.incoming_first_orders_weekly / at.days_week_passed
  END) AS incoming_first_orders,
  SUM(CASE
    WHEN forecast_or_actuals = 'Actuals' THEN at.invoiced_first_orders
    WHEN at.days_week_passed = 0 THEN mo.invoiced_first_orders_monthly / at.days_month_passed
    ELSE we.invoiced_first_orders_weekly / at.days_week_passed
  END) AS invoiced_first_orders,
  SUM(CASE
    WHEN forecast_or_actuals = 'Actuals' THEN at.sales_kept
    WHEN at.days_week_passed = 0 THEN mo.sales_kept_monthly / at.days_month_passed
    ELSE we.sales_kept_weekly / at.days_week_passed
  END) AS sales_kept,
  SUM(CASE
    WHEN forecast_or_actuals = 'Actuals' THEN at.sales_sent
    WHEN at.days_week_passed = 0 THEN mo.sales_sent_monthly / at.days_month_passed
    ELSE we.sales_sent_weekly / at.days_week_passed
  END) AS sales_sent,
  SUM(CASE
    WHEN forecast_or_actuals = 'Actuals' THEN at.billing_net_sales
    WHEN at.days_week_passed = 0 THEN mo.billing_net_sales_monthly / at.days_month_passed
    ELSE we.billing_net_sales_weekly / at.days_week_passed
  END) AS billing_net_sales,
  SUM(CASE
    WHEN forecast_or_actuals = 'Actuals' THEN at.visits
    WHEN at.days_week_passed = 0 THEN mo.visits_monthly / at.days_month_passed
    ELSE we.visits_weekly / at.days_week_passed
  END) AS visits,
  SUM(CASE
    WHEN forecast_or_actuals = 'Actuals' THEN at.cost
    WHEN at.days_week_passed = 0 THEN mo.cost_monthly / at.days_month_passed
    ELSE we.cost_weekly / at.days_week_passed
  END) AS cost
FROM agg at
LEFT JOIN
(
  SELECT
    reporting_type,
    year_week,
    domain,
    marketing_channel,
    SUM(incoming_first_orders) as incoming_first_orders_weekly,
    SUM(invoiced_first_orders) as invoiced_first_orders_weekly,
    SUM(sales_sent) as sales_sent_weekly,
    SUM(sales_kept) as sales_kept_weekly,
    SUM(billing_net_sales) as billing_net_sales_weekly,
    SUM(visits) as visits_weekly,
    SUM(cost) as cost_weekly
  FROM agg
  GROUP BY 1,2,3,4
) we ON we.reporting_type = at.reporting_type AND we.year_week = at.year_week AND we.domain = at.domain AND we.marketing_channel = at.marketing_channel
LEFT JOIN
(
  SELECT
    reporting_type,
    year_month,
    domain,
    marketing_channel,
    SUM(incoming_first_orders) as incoming_first_orders_monthly,
    SUM(invoiced_first_orders) as invoiced_first_orders_monthly,
    SUM(sales_sent) as sales_sent_monthly,
    SUM(sales_kept) as sales_kept_monthly,
    SUM(billing_net_sales) as billing_net_sales_monthly,
    SUM(visits) as visits_monthly,
    SUM(cost) as cost_monthly
  FROM agg
  GROUP BY 1,2,3,4
) mo ON mo.reporting_type = at.reporting_type AND mo.year_month = at.year_month AND mo.domain = at.domain AND mo.marketing_channel = at.marketing_channel
GROUP BY 1,2,3,4,5,6


