-- Name: tableau.callcenter_call_list
-- Created: 2015-08-12 16:35:11
-- Updated: 2015-08-12 17:59:47

CREATE VIEW tableau.callcenter_call_list
AS


SELECT
   cu.customer_id,
   cu.first_name,
   cu.last_name,
   cu.email,
   cu.phone_number,
   cu.date_created as account_creation_date,
   st.stylist,
   co.billing_total,
   co.shipping_city,
   co.shipping_country,
   co.shipping_street,
   bc.last_date_incoming,
   bc.last_date_invoiced,
   bc.last_date_phone_call,
   sf.date_last_contacted,
   CASE 
         WHEN bc.last_date_invoiced < '2014-07-31' THEN 1
         ELSE 0
   END AS no_order_after_08_14,
   CASE 
         WHEN co.not_reached = 'true' AND co.order_type_completed = 'Not Completed' THEN 1
         ELSE 0
      END AS not_reached
FROM bi.customer cu
LEFT JOIN raw.stylist st ON st.stylist_id = cu.new_stylist_id
LEFT JOIN raw.customer_salesforce sf ON sf.customer_id = cu.customer_id
LEFT JOIN
(
   SELECT
      customer_id,
      billing_total,
      shipping_city,
      shipping_country,
      shipping_street,
      not_reached,
      order_type_completed
   FROM
   (
      SELECT
         customer_id,
         billing_total,
         shipping_city,
         shipping_country,
         shipping_street,
         not_reached,
         order_type_completed,
         RANK() OVER (PARTITION BY customer_id ORDER BY date_incoming DESC) as order_count
      FROM bi.customer_order
      WHERE date_incoming is not null
      AND is_real_order = 'Real Order'
   ) ab
   WHERE ab.order_count = 1
) co ON co.customer_id = cu.customer_id
LEFT JOIN
(
SELECT
   customer_id,
   CAST(max(date_incoming) as date) as last_date_incoming,
   CAST(max(date_invoiced) as date) as last_date_invoiced,
   max(date_phone_call) as last_date_phone_call
FROM bi.customer_order
WHERE is_real_order = 'Real Order'
GROUP BY 1
) bc ON bc.customer_id = cu.customer_id
AND user_type = 'Real User'


