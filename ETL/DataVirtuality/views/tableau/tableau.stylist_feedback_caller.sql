-- Name: tableau.stylist_feedback_caller
-- Created: 2015-05-28 17:38:11
-- Updated: 2015-08-26 09:15:31

CREATE VIEW tableau.stylist_feedback_caller
AS

SELECT 
  /*Customer Order details*/
  co.order_id,
  cu.customer_id,
  co.shipping_first_name,
  co.shipping_last_name,
  co.shipping_country,
  co.date_paid,
  co.order_state,
  co.shipping_zip,
  co.box_type,
  case when co.sales_sent=0 then 0 else co.sales_returned/co.sales_sent end as return_rate,
  co.billing_total,
  /*Customer Details*/
  cu.first_name,
  cu.last_name,
  cu.phone_number,
  cu.email,
  cu.formal as formal_or_informal,
  cu.customer_status,
  cu.club_member,
  cu.club_membership_type,
  cu.vip_customer,
  st.stylist,
  /*Salesforce Opportunity*/
  cos.date_feedback_call,
  cos.wrong_phone_number,
  cos.feedback_status,
  /*Salesforce Account*/
  cs.club_member_offer,
  cs.last_reactivation_result,
  cs.feedback_call_poll,
  cs.feedback_caller,
  cs.stylist_lead,
  cs.customer_source,

  a.nb_orders,
  a.last_delivery_date,
  a.customer_return_rate,

  b.first_order_date,
  b.first_order_date_completed

FROM bi.customer_order co
LEFT JOIN bi.customer cu on cu.customer_id=co.customer_id
LEFT JOIN raw.customer_order_salesforce cos on cos.order_id = co.order_id 
LEFT JOIN raw.customer_salesforce cs on cs.customer_id=co.customer_id
LEFT JOIN bi.stylist st on st.stylist_id=cu.new_stylist_id
LEFT JOIN 
(
  SELECT 
    customer_id,
    count(order_id) as nb_orders,
    max(date_shipped) as last_delivery_date,
    case when sum(sales_sent)=0 then 0 else sum(sales_returned)/sum(sales_sent) end as customer_return_rate
  FROM bi.customer_order
  GROUP BY 1
) a on a.customer_id = co.customer_id
LEFT JOIN (
  SELECT 
    co.customer_id,
    min(co.date_created) as first_order_date,
    min(CASE WHEN co.order_state = 'Completed' THEN co.date_created ELSE null END) as first_order_date_completed
  FROM bi.customer_order co 
  GROUP BY co.customer_id
) b on b.customer_id = co.customer_id
where co.order_state_number in (512,1024)


