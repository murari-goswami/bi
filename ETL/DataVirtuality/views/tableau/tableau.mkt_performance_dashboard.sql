-- Name: tableau.mkt_performance_dashboard
-- Created: 2015-09-03 17:41:42
-- Updated: 2015-09-11 17:01:50

CREATE VIEW tableau.mkt_performance_dashboard
AS


/*This report only concerns invoiced orders*/
WITH act AS
(
SELECT
  c."date" as date_invoiced,
  x.country,
  CASE
    WHEN c."date" < CURDATE() THEN 'Actual' 
    ELSE 'Forecast'
  END AS order_state,
  SUBSTRING(c."date",1,4)||'-'||SUBSTRING(c."date",6,2) as year_month,
  invoiced_orders,
  invoiced_orders_final, 
  billing_total_final, 
  billing_total,
  mc.costs  
FROM dwh.calendar c 
CROSS JOIN (SELECT shipping_country as country FROM bi.customer_order WHERE shipping_country is not null AND  shipping_country != 'GB' GROUP BY 1) x
LEFT JOIN
(
  SELECT
    CAST(date_invoiced AS date) as date_invoiced,
    shipping_country,
    COUNT(order_id) as invoiced_orders,
    SUM(billing_total) as billing_total,
    SUM(CASE WHEN revenue_state = 'Final' THEN billing_total ELSE null END) as billing_total_final, 
    SUM(CASE WHEN revenue_state = 'Final' THEN 1 ELSE null END) as invoiced_orders_final 
  FROM bi.customer_order  
  WHERE order_type = 'First Order'
  AND is_real_order = 'Real Order'
  AND date_invoiced is not null
  AND order_state_number >= 16 
  AND order_state_number < 2048
  GROUP BY 1,2
) co ON c."date" = co.date_invoiced AND co.shipping_country = x.country
LEFT JOIN 
  (
    SELECT 
      date_created,
      country,
      SUM(cost) as costs
      FROM raw.marketing_costs
      WHERE date_created < CURDATE()
      GROUP BY 1,2
  ) mc ON c."date" = mc.date_created AND mc.country = x.country
)


SELECT
  fc.date_invoiced,
  act.order_state,
  fc.country as country,
  CAST(go.invoiced_order_goal as decimal) / CAST(fc.month_days  as decimal) as invoiced_order_goal,
  go.cac_goal * CAST(go.invoiced_order_goal as decimal) / CAST(fc.month_days  as decimal) as daily_cost_goal,
  go.average_basket_value_goal * CAST(go.invoiced_order_goal as decimal) / CAST(fc.month_days  as decimal) as daily_sales_goal,
  SUM(CASE 
    WHEN fc.days_month_passed = 0 THEN null
    WHEN (act.order_state = 'Forecast' AND fc.working_days = 1) THEN CAST(mo.actual_invoiced_orders/fc.working_days_passed as decimal)
    ELSE act.invoiced_orders
  END) AS invoiced_orders,
  SUM(CASE 
    WHEN fc.days_month_passed = 0 THEN null
    WHEN (act.order_state = 'Forecast' AND fc.working_days = 1) THEN CAST(mo.actual_billing_total/fc.working_days_passed as decimal)
    ELSE act.billing_total
  END) AS billing_total,
  SUM(CASE 
    WHEN fc.days_month_passed = 0 THEN null
    WHEN act.order_state = 'Forecast' THEN CAST(mo.actual_costs/fc.days_month_passed as decimal)
    ELSE act.costs
  END) AS costs,
  SUM(act.invoiced_orders_final) as invoiced_orders_final, 
  SUM(act.billing_total_final) as billing_total_final 
FROM
(
  SELECT
    CAST(c."date" as date) as date_invoiced,
    c.working_days,
    c.year_month,
    ca.month_days,
    x.country,
    ca.days_month_passed,
    ca.working_days as working_days_month,
    ca.working_days_passed
  FROM dwh.calendar c
  CROSS JOIN (SELECT shipping_country as country FROM bi.customer_order WHERE shipping_country is not null AND  shipping_country != 'GB' GROUP BY 1) x
  LEFT JOIN
  (
      SELECT
        year_month,
        COUNT(day_of_month) as month_days,
        SUM(working_days) as working_days,
        SUM(CASE WHEN "date" < CURDATE() THEN 1 ELSE 0 END) AS days_month_passed,
        SUM(CASE WHEN "date" < CURDATE() THEN working_days ELSE 0 END) as working_days_passed
      FROM dwh.calendar
      GROUP BY 1 
   ) ca ON ca.year_month = c.year_month
  WHERE c."date" >= '2015-01-01'
  AND last_day_of_month < TIMESTAMPADD(SQL_TSI_MONTH, 1, TIMESTAMPADD(SQL_TSI_DAY, -1, CURDATE()))
) fc
LEFT JOIN act ON fc.date_invoiced = act.date_invoiced AND fc.country = act.country
LEFT JOIN
(
  SELECT
    year_month,
    country,
    SUM(CASE WHEN order_state = 'Actual' THEN 1 ELSE 0 END) AS month_day_passed,
    SUM(invoiced_orders) as actual_invoiced_orders,
    SUM(billing_total) as actual_billing_total,
    SUM(costs) as actual_costs
  FROM act
  GROUP BY 1,2
) mo ON mo.year_month = fc.year_month AND fc.country = mo.country
LEFT JOIN dwh.marketing_new_customer_order_goals  go ON go.year_month = fc.year_month AND go.country = fc.country
GROUP BY 1,2,3,4,5,6


