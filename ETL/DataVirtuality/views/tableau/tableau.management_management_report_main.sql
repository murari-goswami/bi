-- Name: tableau.management_management_report_main
-- Created: 2015-04-24 18:24:12
-- Updated: 2015-09-08 18:13:11

CREATE view tableau.management_management_report_main
as

SELECT
  a.date,
  a.country,
  a.revenue_state,
  a.order_type,
  a.working_days,
  inc.orders_incoming,
  inv.orders_invoiced,
  inc.orders_incoming_repeat,
  prc.orders_processed,
  inv.sales_sent,
  inv.sales_kept,
  inv.sales_returned,
  inv.billing_total,
  inv.billing_net_sales,
  inv.cost_kept * -1 as cost_kept,
  inv.cost_underway_at_month_end,
  inv.own_stock_sales_kept,
  inv.own_stock_cost_kept,
  inv.partner_sales_kept,
  inv.partner_cost_kept,
  inv.own_stock_sales_kept_wo_ph,
  inv.own_stock_cost_kept_wo_ph,
  inv.paul_hunter_sales_kept,
  inv.paul_hunter_cost_kept,
  inv.orders_invoiced * dir.cost_per_order as cost_direct,
  inv.orders_invoiced * dir.payment_cost as payment_cost,
  inv.orders_invoiced * dir.logistics_cost as logistics_cost,
  inv.orders_invoiced * dir.service_cost as service_cost,
  inv.orders_invoiced * mar.cost_per_order as cost_marketing,
  sty.stylists,
  vi.visits,
  ph.nb_of_calls,
  ph.call_orders_invoiced
FROM 
(
  SELECT
    c.date,
    c.working_days,
    x.country,
    x.revenue_state,
    x.order_type
  FROM dwh.calendar c 
  CROSS JOIN (SELECT shipping_country as country, revenue_state, order_type FROM bi.customer_order WHERE sales_kept > 0 GROUP BY 1,2,3) x
  WHERE c.date > '2014'
  AND c.date < CURDATE()
) a
LEFT JOIN 
(
  SELECT
    CAST(co.date_invoiced as date) as "date",
    co.shipping_country as country,
    co.order_type,
    COALESCE(co.revenue_state, 'Final') as revenue_state,
    COUNT(*) as orders_invoiced,
    SUM(COALESCE(co.sales_sent, co.sales_picked)) as sales_sent,
    SUM(co.sales_kept) as sales_kept,
    SUM(co.sales_returned) as sales_returned,
    SUM(co.billing_total) as billing_total,
    SUM(co.billing_net_sales) as billing_net_sales,
    SUM(co.cost_kept) as cost_kept,
    SUM(
      CASE 
        WHEN (
          (LEFT(co.date_returned,7) != LEFT(co.date_invoiced,7) AND co.date_returned > co.date_invoiced)
          OR co.date_returned is null) and co.order_state_number<1024
          THEN co.cost_sent
        ELSE 0
      END
    ) as cost_underway_at_month_end,
    SUM(co.own_stock_sales_kept) as own_stock_sales_kept,
    SUM(co.own_stock_cost_kept) as own_stock_cost_kept,
    SUM(co.partner_sales_kept) as partner_sales_kept,
    SUM(co.partner_cost_kept) as partner_cost_kept,
    SUM(own_stock_sales_kept_wo_ph) as own_stock_sales_kept_wo_ph,
    SUM(own_stock_cost_kept_wo_ph) as own_stock_cost_kept_wo_ph,
    SUM(co.paul_hunter_sales_kept) as paul_hunter_sales_kept,
    SUM(co.paul_hunter_cost_kept) as paul_hunter_cost_kept
  FROM bi.customer_order co
  WHERE co.is_real_order = 'Real Order'
  AND co.date_invoiced is not null
  AND co.date_invoiced > '2014'
  AND co.order_state_number >= 16 
  AND co.order_state_number < 2048
  GROUP BY 1,2,3,4
) inv on inv.date = a.date AND inv.country = a.country AND inv.revenue_state = a.revenue_state AND inv.order_type = a.order_type
LEFT JOIN 
(
  SELECT
    CAST(co.date_stylist_picked as date) as "date",
    co.shipping_country as country,
    co.order_type,
    COUNT(*) as orders_processed
  FROM bi.customer_order co
  WHERE co.is_real_order = 'Real Order'
  AND co.date_stylist_picked is not null
  AND co.date_stylist_picked > '2014'
  AND co.order_state_number >= 16
  AND co.order_state_number < 2048 
  GROUP BY 1,2,3
) prc on prc.date = a.date AND prc.country = a.country AND a.revenue_state = 'Final' AND prc.order_type = a.order_type
LEFT JOIN
(
  SELECT  
    CAST(co.date_incoming as date) as "date", 
    co.shipping_country as country, 
    COUNT(case when co.order_type = 'First Order' then order_id else null end) as orders_incoming, 
    COUNT(case when co.order_type in ('Repeat Order','Outfittery Club Order') then order_id else null end) as orders_incoming_repeat 
  FROM bi.customer_order co 
  WHERE co.is_real_order = 'Real Order' 
  AND co.date_created > '2014'
  GROUP BY 1,2
) inc on inc.date = a.date AND inc.country = a.country AND a.revenue_state = 'Final' AND a.order_type = 'First Order'
LEFT JOIN
(
  SELECT
    ccd.date_invoiced as "date",
    ccd.country,
    SUM(CASE WHEN ccd.cost_type='payment' then ccd.cost_per_order ELSE NULL END) AS payment_cost,
    SUM(CASE WHEN ccd.cost_type='service' then ccd.cost_per_order ELSE NULL END) AS service_cost,
    SUM(CASE WHEN ccd.cost_type='logistics' then ccd.cost_per_order ELSE NULL END) AS logistics_cost,
    SUM(ccd.cost_per_order) as cost_per_order
  FROM bi.company_costs_direct ccd 
  GROUP BY 1,2
) dir on dir.date = a.date AND dir.country = a.country
LEFT JOIN bi.company_costs_marketing mar on mar.date_invoiced = a.date AND mar.country = a.country
LEFT JOIN 
(
  SELECT
    swa.date_invoiced as "date",
    swa.country,
    sum(stylist_weighted_activity) as stylists
  FROM bi.stylist_weighted_activity swa
  JOIN raw.stylist s on s.stylist_id = swa.stylist_id
  WHERE s.real_stylist = true
  AND s.role = 'Stylist' 
  GROUP BY 1,2
) sty on sty.date = a.date AND sty.country = a.country AND a.revenue_state = 'Final' AND a.order_type = 'First Order'
LEFT JOIN
(
  SELECT 
    date_created  as "date",
    domain as country,
    sum(visits) as visits 
  FROM "bi.marketing_funnel_by_date_domain_channel_device"
  group by 1,2
) vi on vi."date" = a."date" AND vi.country = a.country AND a.revenue_state = 'Final' AND a.order_type = 'First Order'
LEFT JOIN
(
  SELECT 
      cast(date_phone_call_current as date) as "date",
      shipping_country as country,
      count(distinct order_id) as nb_of_calls,
      count(case when date_invoiced is not null then order_id else null end) as call_orders_invoiced
    FROM bi.customer_order
    group by 1,2
)ph on ph."date" = a."date" AND ph.country = a.country AND a.revenue_state = 'Final' AND a.order_type = 'First Order'


