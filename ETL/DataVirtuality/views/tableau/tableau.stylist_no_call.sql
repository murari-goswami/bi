-- Name: tableau.stylist_no_call
-- Created: 2015-06-24 18:19:40
-- Updated: 2015-07-03 09:04:38

CREATE view tableau.stylist_no_call
AS

SELECT  
  co.order_id,
  co.date_created,
  st_c.stylist as customer_stylist,
  st_c.team as customer_stylist_team, 
  co.order_sales_stage
FROM bi.customer_order co
LEFT JOIN bi.stylist st_c on st_c.stylist_id = co.stylist_id
LEFT JOIN raw.customer_order_salesforce cos on cos.order_id=co.order_id
LEFT JOIN
(
  SELECT 
    customer_id,
    count(*) as nb_orders
  FROM bi.customer_order 
  GROUP BY 1
)f_order on f_order.customer_id=co.customer_id
WHERE nb_orders=1
AND co.date_phone_call is null
AND cos.ops_check='OK'
AND cos.preview_not_liked='false'


