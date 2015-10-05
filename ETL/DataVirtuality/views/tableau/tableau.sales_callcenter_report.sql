-- Name: tableau.sales_callcenter_report
-- Created: 2015-09-15 11:10:44
-- Updated: 2015-09-15 16:52:16

CREATE view tableau.sales_callcenter_report
AS

SELECT
   cu.customer_id,
   sf.salesforce_account_status,
   cu.first_name,
   cu.last_name,
   cu.email,
   cu.phone_number,
   CAST(cu.date_created as date) as account_creation_date,
   st.stylist,
   st.team,
   lio.shipping_country,
   lio.shipping_street   || ' ' || lio.shipping_street_number || ' ' ||lio.shipping_zip || ' ' || lio.shipping_city as shipping_address,
   sf.date_last_contacted,
   CAST(sf.last_call_reactivation as date) as last_call_reactivation,
   cu.club_member,
   cu.customer_age,
   cu.formal,
   sf.club_member_offer,
   TIMESTAMPDIFF(SQL_TSI_DAY, cu.date_created, CURDATE()) as days_since_account_creation,
   lco.box_type as box_type_of_last_completed_order,
   lco.date_invoiced as date_invoiced_of_last_completed_order,
   TIMESTAMPADD(SQL_TSI_YEAR, +1, lco.date_invoiced) as date_invoiced_of_last_completed_order_plus_one_year,
   lco.articles_kept as articles_kept_of_last_completed_order,
   lco.sales_kept as sales_kept_of_last_completed_order,
   lco.billing_net_sales as billing_net_sales_of_last_completed_order,
   lco.order_type as order_type_of_last_completed_order,
   lco.has_preview as has_preview_of_last_completed_order, 
   lco.ops_check as ops_check_of_last_completed_order,
   lio.payment_type as payment_type_last_incoming_order,
   lio.order_type as order_type_last_incoming_order,
   lio.cancelled as cancelled_last_incoming_order,
   lio.call_date_tomorrow as call_date_tomorrow,
   lio.order_state as orders_state_last_incoming_order,
   lio.box_type as box_type_last_incoming_order,
   lio.not_reached,
   lio.has_preview as last_incoming_order_incoming_order, 
   bc.completed_orders,
   bc.last_date_incoming,
   bc.last_date_invoiced,
   bc.first_date_incoming,
   bc.last_date_phone_call as last_phone_call,
   bc.highest_kept_gross_basket,
   sf.vip_customer,
   cu.subscribe_status,
   sf.wrong_phone_number,
   cu.subscribed_to_sms,
   cu.subscribed_to_stylist_emails
   
FROM bi.customer cu
LEFT JOIN raw.stylist st ON st.stylist_id = cu.new_stylist_id
LEFT JOIN raw.customer_salesforce sf ON sf.customer_id = cu.customer_id

/* Data related to a customer's last incoming order*/

LEFT JOIN
(
   SELECT
      customer_id,
      billing_total,
      shipping_city,
      shipping_country,
      shipping_street,
      shipping_street_number,
      shipping_zip,
      not_reached,
      order_type_completed,
      payment_type,
      order_type,
      call_date_tomorrow,
      cancelled,
      order_state,
      has_preview,
      box_type
   FROM
   (
      SELECT
         customer_id,
         billing_total,
         shipping_city,
         shipping_country,
         shipping_street,
         shipping_street_number,
         not_reached,
         order_type_completed,
         payment_type,
         order_type,
         shipping_zip,
         order_state,
         box_type,
         CASE WHEN CAST(TIMESTAMPADD(SQL_TSI_DAY, 1, CURDATE()) as date) = CAST(date_phone_call_current as date) THEN 'yes' ELSE 'no' END as call_date_tomorrow,
         CASE WHEN date_cancelled is not null THEN 'yes' ELSE 'no' END as cancelled,
         CASE WHEN preview_id is not null THEN 'yes' ELSE 'no' END as has_preview,
         RANK() OVER (PARTITION BY customer_id ORDER BY date_incoming DESC) as order_count
      FROM bi.customer_order
      WHERE date_incoming is not null
      AND is_real_order = 'Real Order'
   ) ab
   WHERE ab.order_count = 1
) lio ON lio.customer_id = cu.customer_id

/* Data related to a customer's last completed order*/

LEFT JOIN
(
   SELECT
      customer_id,
      box_type,
      date_invoiced,
      articles_kept,
      sales_kept,
      billing_net_sales,
      order_type,
      has_preview,
      ops_check
   FROM
   (
      SELECT
         customer_id,
         box_type,
         CAST(date_invoiced as date) as date_invoiced,
         articles_kept,
         sales_kept,
         billing_net_sales,
         order_type,
         CASE WHEN preview_id is not null THEN 'yes' ELSE 'no' END as has_preview,
         RANK() OVER (PARTITION BY customer_id ORDER BY date_incoming DESC) as order_count,
         ops_check
      FROM bi.customer_order
      WHERE order_state = 'Completed'
      AND is_real_order = 'Real Order'
   ) ab
   WHERE ab.order_count = 1
) lco ON lco.customer_id = cu.customer_id

/*  customer order count */

LEFT JOIN
(
   SELECT
      customer_id,
      SUM(CASE WHEN order_state = 'Completed' THEN 1 ELSE 0 END)  as completed_orders,
      CAST(max(date_incoming) as date) as last_date_incoming,
      CAST(min(date_incoming) as date) as first_date_incoming,
      CAST(max(date_invoiced) as date) as last_date_invoiced,
      max(date_phone_call) as last_date_phone_call,
      MAX(sales_kept) as highest_kept_gross_basket
   FROM bi.customer_order
   WHERE is_real_order = 'Real Order'
   GROUP BY 1
) bc ON bc.customer_id = cu.customer_id

/* fixed filters (for all reports) */

WHERE cu.phone_number is not null
AND cu.user_type = 'Real User'
AND (cu.subscribed_to_sms = 1 OR cu.subscribed_to_stylist_emails = 1)


