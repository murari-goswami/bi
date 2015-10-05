-- Name: tableau.mkt_rt_performance_vs_plan
-- Created: 2015-08-05 17:25:45
-- Updated: 2015-09-28 16:32:54

CREATE VIEW tableau.mkt_rt_performance_vs_plan
AS


/*This report only concerns invoiced orders*/
WITH act AS(
SELECT
  CAST(date_invoiced AS date) AS date_invoiced,
  CASE
    WHEN CAST(date_invoiced AS date) < CURDATE() THEN 'Actual' 
    ELSE 'Forecast'
  END AS order_state,
  shipping_country,
  SUBSTRING(date_invoiced,1,4)||'-'||SUBSTRING(date_invoiced,6,2) as year_month, 
  COUNT(order_id) as invoiced_orders,
  SUM(CASE WHEN order_type = 'Outfittery Club Order' THEN 1 ELSE 0 END) as actual_invoiced_club_orders,
  SUM(CASE WHEN order_type = 'Repeat Order' THEN 1 ELSE 0 END) as actual_invoiced_repeat_orders,
  SUM(CASE WHEN order_type = 'Repeat Order' AND LOWER(sales_channel) not like '%app%' AND (LOWER(campaign_title) not like '%crm-magazin%' AND LOWER(campaign_title) not like '%crm magazin%' AND LOWER(campaign_title) not like '%magazin sommer%' OR campaign_title is null) THEN 1 ELSE 0 END)  as actual_invoiced_repeat_orders_other,
  SUM(CASE WHEN LOWER(sales_channel) like '%app%' THEN 1 ELSE 0 END) as actual_invoiced_app_orders,
  SUM(CASE WHEN LOWER(campaign_title) like '%crm-magazin%' OR LOWER(campaign_title) like '%crm magazin%' OR LOWER(campaign_title) like '%magazin sommer%' THEN 1 ELSE 0 END) as actual_invoiced_magazine_orders
FROM "bi.customer_order" cu
LEFT JOIN raw.discount_campaigns dc ON dc.campaign_id = cu.campaign_id
WHERE order_type IN ('Outfittery Club Order', 'Repeat Order')
AND is_real_order = 'Real Order'
AND date_invoiced is not null
AND order_state_number >= 16 
AND order_state_number < 2048
GROUP BY 1,2,3,4
)


SELECT
  fc."date",
  fc.country as country,
  SUM(CASE 
    WHEN fc.days_month_passed = 0 THEN null
    WHEN fc.days_month_passed < fc.month_days THEN CAST(mo.actual_invoiced_repeat_orders_month/fc.days_month_passed as decimal)
    ELSE act.actual_invoiced_repeat_orders
  END) AS real_repeat_orders_forecast,
  SUM(CASE 
    WHEN fc.days_month_passed = 0 THEN null
    ELSE act.actual_invoiced_club_orders
  END) AS club_orders,
  SUM(fc.daily_orders) as invoiced_order_goal,
  SUM(act.actual_invoiced_club_orders) as actual_club_repeat_orders,
  SUM(act.actual_invoiced_repeat_orders) as actual_real_repeat_orders,
  SUM(act.actual_invoiced_repeat_orders_other) as actual_invoiced_repeat_orders_other,
  SUM(actual_invoiced_magazine_orders) as actual_magazine_orders,
  SUM(actual_invoiced_app_orders) as  actual_app_orders
FROM
(
  SELECT
    CAST(c."date" as date) as "date",
    c.year_month,
    ab.month_days,
    ab.days_month_passed,
    ab.country,
    ab.daily_orders 
  FROM dwh.calendar c
  LEFT JOIN
  (
    SELECT
      go.year_month,
      go.country,
      ca.month_days,
      ca.days_month_passed,
      CAST(go.invoiced_order_forecast as decimal) / ca.month_days as daily_orders
    FROM dwh.retention_marketing_order_goals go
    LEFT JOIN
    (
      SELECT
        year_month,
        COUNT(day_of_month) as month_days,
        SUM(CASE WHEN "date" < CURDATE() THEN 1 ELSE 0 END) AS days_month_passed
      FROM dwh.calendar
      GROUP BY 1 
    ) ca ON go.year_month = ca.year_month
  ) ab ON c.year_month = ab.year_month
  WHERE "date" >= '2015-01-01'
  AND daily_orders is not null
) fc 
LEFT JOIN act ON fc."date" = act.date_invoiced AND fc.country = act.shipping_country
LEFT JOIN
(
  SELECT
    year_month,
    shipping_country,
    SUM(CASE WHEN order_state = 'Actual' THEN 1 ELSE 0 END) AS month_day_passed,
    SUM(actual_invoiced_club_orders) as actual_invoiced_club_orders_month,
    SUM(actual_invoiced_repeat_orders) as actual_invoiced_repeat_orders_month
  FROM act
  GROUP BY 1,2
) mo ON mo.year_month = fc.year_month AND fc.country = mo.shipping_country
GROUP BY 1,2


