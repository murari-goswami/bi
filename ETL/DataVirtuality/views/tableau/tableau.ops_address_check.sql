-- Name: tableau.ops_address_check
-- Created: 2015-09-09 14:51:22
-- Updated: 2015-09-09 14:53:01

CREATE VIEW tableau.ops_address_check
as

SELECT 
  ca_1.*,
  co.order_id,
  co.shipping_first_name, 
  co.shipping_last_name, 
  co.shipping_co,
  co.shipping_street, 
  co.shipping_street_number, 
  co.shipping_zip,
  co.shipping_city,
  co.shipping_country,
  co.order_state
FROM raw.customer_address ca_1 
LEFT JOIN
(
    SELECT * FROM
  (
  SELECT
    rank() over(partition by customer_id order by date_created desc) as rank,
    order_id,
    customer_id,
    order_state,
    order_state_number,  
    shipping_first_name, 
    shipping_last_name, 
    shipping_co,
    shipping_street, 
    shipping_street_number, 
    shipping_zip,
    shipping_city,
    shipping_country
  FROM bi.customer_order
  )a WHERE rank=1
)co on co.customer_id=ca_1.customer_id
WHERE order_state_number> 16 and order_state_number<1024


