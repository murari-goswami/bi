-- Name: tableau.billing_all_order_paid_creditcard_entry
-- Created: 2015-04-24 18:23:07
-- Updated: 2015-07-30 17:58:41

CREATE view tableau.billing_all_order_paid_creditcard_entry
AS
SELECT
  co.id,
  co.customer_id,
  co.date_created,
  co.shipping_country,
  co.order_type,
  co.payment_method,
  co.state,
  a.date_credit_card_entered,
  op.date_amidala_checkout
FROM
(
  /*This join is to get all customers who has entered cc details*/
  SELECT 
    distinct bd.customer_id,
    bd.date_credit_card_entered
  FROM views.billing_data bd
  WHERE customer_id is not null
  GROUP BY 1,2
)a
LEFT JOIN views.customer_order co on co.customer_id=a.customer_id
LEFT JOIN
(
    /*this join gets date_created for last orderline created in order_position table*/
    SELECT 
  order_id,
  max(date_created) as date_amidala_checkout
FROM views.order_position
GROUP BY 1
)op on op.order_id=co.id
WHERE co.state between 16 and 1024


