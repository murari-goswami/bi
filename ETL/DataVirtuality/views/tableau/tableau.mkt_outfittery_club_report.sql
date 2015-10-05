-- Name: tableau.mkt_outfittery_club_report
-- Created: 2015-04-24 18:20:57
-- Updated: 2015-09-01 15:35:52

CREATE VIEW tableau.mkt_outfittery_club_report
AS
SELECT
  ab.date,
  ab.country,
  ab.box_type,
  CASE
    WHEN ab.club_order_quantity = 1 THEN '1st'
    WHEN ab.club_order_quantity = 2 THEN '2nd'
    WHEN ab.club_order_quantity = 3 THEN '3rd'
    WHEN ab.club_order_quantity = 4 THEN '4th'
    WHEN ab.club_order_quantity = 5 THEN '5th'
    WHEN ab.club_order_quantity = 6 THEN '6th'
    WHEN ab.club_order_quantity = 7 THEN '7th'
    WHEN ab.club_order_quantity = 8 THEN '8th'
    WHEN ab.club_order_quantity = 9 THEN '9th'
    WHEN ab.club_order_quantity = 10 THEN '10th'
  END AS club_order_quantity,
  inc.orders_incoming,
  inc.orders_invoiced,
  inc.sales_sent,
  inc.sales_kept,
  inc.billing_net_sales,
  inv.orders_invoiced_actual,
  inv.sales_sent_actual,
  inv.sales_kept_actual,
  inv.billing_net_sales_actual,
  inv.full_returns
FROM
(
  SELECT
    c.date,
    x.country,
    x.box_type,
    z.club_order_quantity
  FROM dwh.calendar c 
  CROSS JOIN (SELECT shipping_country as country, box_type  FROM bi.customer_order WHERE sales_kept > 0 GROUP BY 1,2) x
  CROSS JOIN (SELECT 1 as club_order_quantity UNION 
              SELECT 2 as club_order_quantity UNION 
              SELECT 3 as club_order_quantity UNION
              SELECT 4 as club_order_quantity UNION
              SELECT 5 as club_order_quantity UNION
              SELECT 6 as club_order_quantity UNION
              SELECT 7 as club_order_quantity UNION 
              SELECT 8 as club_order_quantity UNION 
              SELECT 9 as club_order_quantity UNION 
              SELECT 10 as club_order_quantity ) z
  WHERE c.date >= '2014-09'
  AND c.date < CURDATE()
) ab
LEFT JOIN
(
  SELECT 
    cast(co.date_incoming as date) as "date",
    co.shipping_country,
    co.box_type,
    rk.club_order_quantity,
    count(co.order_id) as orders_incoming,
    SUM(CASE WHEN co.date_invoiced is not null AND co.order_state_number >= 16 THEN 1 ELSE 0 END) as orders_invoiced,
    SUM(co.sales_sent) as sales_sent,
    SUM(co.sales_kept) as sales_kept,
    SUM(co.billing_net_sales) as billing_net_sales
  FROM bi.customer_order co
  LEFT JOIN
  (
    SELECT 
      order_id,
      RANK() OVER (Partition BY customer_id ORDER BY date_created ASC) as club_order_quantity
    FROM bi.customer_order
    WHERE order_type = 'Outfittery Club Order'
    ORDER BY 1
  ) rk ON rk.order_id = co.order_id
  WHERE co.order_type = 'Outfittery Club Order'
  GROUP BY 1,2,3,4
) inc ON inc.date = ab.date AND inc.shipping_country = ab.country and inc.box_type = ab.box_type AND inc.club_order_quantity = ab.club_order_quantity
LEFT JOIN
(
  SELECT 
    cast(co.date_invoiced as date) as "date",
    co.shipping_country,
    co.box_type,
    rk.club_order_quantity,
    count(co.order_id) as orders_invoiced_actual,
    sum(co.sales_sent) as sales_sent_actual,
    SUM(co.sales_kept) as sales_kept_actual,
    SUM(co.billing_net_sales) as billing_net_sales_actual,
    SUM(full_return) as full_returns
  FROM bi.customer_order co
  LEFT JOIN
  (
     SELECT 
      order_id,
      RANK() OVER (Partition BY customer_id ORDER BY date_created ASC) as club_order_quantity,
      CASE
        WHEN sales_kept = 0 THEN 1
        ELSE 0
     END AS full_return   
    FROM bi.customer_order
    WHERE order_type = 'Outfittery Club Order'
    ORDER BY 1
  ) rk ON rk.order_id = co.order_id
  WHERE co.order_type = 'Outfittery Club Order'
  AND co.order_state_number >= 16
  AND co.date_invoiced is not null
  GROUP BY 1,2,3,4
) inv ON inv.date = ab.date AND inv.shipping_country = ab.country and inv.box_type = ab.box_type AND inv.club_order_quantity = ab.club_order_quantity
WHERE inc.orders_incoming is not null


