-- Name: tableau.mkt_crm_club_customers
-- Created: 2015-06-01 15:26:13
-- Updated: 2015-09-09 12:22:22

CREATE VIEW tableau.mkt_crm_club_customers 
AS

SELECT
  cu.customer_id,
  cu.new_stylist_id as stylist_id,
  cu.first_name,
  cu.last_name,
  cu.phone_number,
  cu.email,
  cu.token,
  cu.default_domain,
  cu.subscribe_status,
  cu.subscribed_to_sms,
  CASE WHEN cu.gender = 'Male' THEN 'Herr' ELSE 'Frau' END as anrede,
  cu.formal as du_sie,
  case
    when cu.gender= 'Male' THEN 'Lieber'
    when cu.gender= 'Female' THEN 'Liebe'
  end AS "begruessung",
  co.articles_kept,
  co.completed_orders,
  co.billing_total,
  co.billing_recieved_total,
  co.first_order_date,
  co.last_order_date,
  co.avg_billing_total,
  co.last_delivery_date,
  co.nb_orders,
  clo.articles_kept_club,
  clo.nb_club_orders,
  clo.completed_orders_club,
  clo.billing_total_club,
  clo.billing_recieved_total_club,
  clo.avg_billing_total_club,
  clo.first_order_date_club,
  clo.last_order_date_club,
  clo.last_delivery_date_club,
  cu.club_membership_type,
  cu.club_customer_feedback,
  cu.date_first_club_box,
  cu.club_member_offer,
  sal.debt_collection,
  st.stylist,
  ci.city,
  ci.zip,
  ci.shipping_country,
  co.non_club_orders_picked,
  co.date_last_non_club_order,
  co.avg_basket_kept,
  CASE WHEN co.sales_sent=0 then 0 else co.sales_returned/co.sales_sent end as return_rate,
  CASE
        WHEN TIMESTAMPDIFF (SQL_TSI_DAY, co.last_order_date, CURDATE ()) <= 75 THEN 0
        ELSE 1
    END AS wo_order_last_75_days
    
FROM bi.customer cu
JOIN 
(
  SELECT
    customer_id,
    sum(articles_kept) articles_kept,
    COUNT(DISTINCT order_id) as nb_orders,
    COUNT(DISTINCT CASE WHEN sales_channel NOT LIKE 'club%' then order_id end) as non_club_orders_picked,
    max(DISTINCT CASE WHEN sales_channel NOT LIKE 'club%' then date_created end) as date_last_non_club_order,
    COUNT(DISTINCT CASE WHEN order_state= 'Completed' THEN order_id ELSE NULL END) as completed_orders,
    SUM(CASE WHEN order_state= 'Completed' THEN billing_total ELSE NULL END) as billing_total,
    SUM(CASE WHEN order_state= 'Completed' THEN billing_received ELSE NULL END) as billing_recieved_total,
    SUM(CASE WHEN order_state= 'Completed' THEN billing_total ELSE NULL END) /COUNT(DISTINCT CASE WHEN order_state= 'Completed' THEN order_id ELSE NULL END) as avg_billing_total,
    SUM(CASE WHEN order_state= 'Completed' THEN sales_kept ELSE NULL END) /COUNT(DISTINCT order_id) as avg_basket_kept,
    SUM(CASE WHEN order_state= 'Completed' THEN sales_returned ELSE NULL END) as sales_returned,
    SUM(CASE WHEN order_state= 'Completed' THEN sales_sent ELSE NULL END) as sales_sent,
    min(date_created) as first_order_date,
    max(date_created) as last_order_date,
    max(date_shipped) as last_delivery_date
  FROM bi.customer_order
  GROUP BY 1
) co on cu.customer_id=co.customer_id
LEFT JOIN raw.customer_salesforce sal on sal.customer_id=cu.customer_id
LEFT JOIN bi.stylist st on st.stylist_id=cu.new_stylist_id
LEFT JOIN
(
  SELECT
    ab.customer_id,
    ab.shipping_city as city,
    ab.shipping_zip as zip,
    ab.shipping_country as shipping_country
  FROM
  (
    SELECT 
      co.customer_id,
      co.shipping_city,
      co.shipping_zip,
      co.shipping_country,
      rank() OVER (PARTITION BY co.customer_id ORDER BY co.date_created DESC) as rank
    FROM bi.customer_order co
    WHERE date_invoiced is not null
  ) ab
  WHERE rank = 1
) ci ON ci.customer_id = cu.customer_id
LEFT JOIN 
(
  SELECT
    customer_id,
    sum(articles_kept) articles_kept_club,
    COUNT(DISTINCT order_id) as nb_club_orders,
    COUNT(DISTINCT CASE WHEN order_state= 'Completed' THEN order_id ELSE NULL END) as completed_orders_club,
    SUM(CASE WHEN order_state= 'Completed' THEN billing_total ELSE NULL END) as billing_total_club,
    SUM(CASE WHEN order_state= 'Completed' THEN billing_received ELSE NULL END) as billing_recieved_total_club,
    SUM(CASE WHEN order_state= 'Completed' THEN billing_total ELSE NULL END) /COUNT(DISTINCT CASE WHEN order_state= 'Completed' THEN order_id ELSE NULL END) as avg_billing_total_club,
    min(date_created) as first_order_date_club,
    max(date_created) as last_order_date_club,
    max(date_shipped) as last_delivery_date_club
  FROM bi.customer_order
  WHERE order_type = 'Outfittery Club Order'
  GROUP BY 1
) clo on cu.customer_id=clo.customer_id
WHERE cu.club_member= 'true'
AND cu.user_type != 'Test User'


