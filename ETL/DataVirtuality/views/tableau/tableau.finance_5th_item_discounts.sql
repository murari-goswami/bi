-- Name: tableau.finance_5th_item_discounts
-- Created: 2015-04-24 18:20:04
-- Updated: 2015-04-24 18:20:04

CREATE view tableau.finance_5th_item_discounts
AS
SELECT
  c.first_name,
  c.last_name,
  c.email,
  co.order_id,
  CAST(co.date_created as date) as date_created,
  co.date_shipped,
  v.sales_kept*(1-(co.discount_total/co.sales_kept)) as "5th_item_discount_to_give_in_eur",
  co.articles_kept,
  co.discount_total,
  v.sales_kept as "5th_item_retail_price_eur",
  co.sales_kept,
  co.discount_total/co.sales_kept as percentage_discount
FROM bi.customer_order co
JOIN bi.customer c on c.customer_id = co.customer_id
JOIN
(
  SELECT
    coa.order_id,
    coa.sales_kept,
    row_number() over (partition by coa.order_id order by coa.sales_kept desc) as "rnum"
  FROM bi.customer_order_articles coa
  WHERE coa.sales_kept > 0
)as v on v.order_id = co.order_id and v.rnum = 5
WHERE co.articles_kept >= 5
AND 
(
  (cast(co.date_created as date) >= '2014-12-15' AND cast(co.date_created as date) <= '2015-01-18')
  OR
  (cast(co.date_shipped as date) >= '2014-12-15' AND cast(co.date_shipped as date) <= '2015-01-18')
)
AND co.is_real_order = 'Real Order' and co.shipping_country='DE'


