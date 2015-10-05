-- Name: tableau.cvr_dashboard_overview
-- Created: 2015-08-10 16:02:16
-- Updated: 2015-08-21 16:50:52

CREATE VIEW tableau.cvr_dashboard_overview
AS

SELECT 
  CAST(co.date_created as date) as date_created,
  shipping_country as country,
  order_type,
  box_type,
  sales_channel,
  cu.customer_age,
  cu.age_group,
  SUM(CASE WHEN date_incoming is not null THEN 1 ELSE 0 END) as incoming_orders,
  SUM(CASE WHEN date_stylist_picked is not null THEN 1 ELSE 0 END) as stylist_picked_orders,
  SUM(CASE WHEN date_incoming is not null AND date_stylist_picked is null AND  order_state_number = 2048 THEN 1 ELSE 0 END) as canceled_within_second_step,
  SUM(CASE WHEN date_incoming is not null AND date_stylist_picked is null AND  order_sales_stage = 'On hold' THEN 1 ELSE 0 END) as on_hold,
  SUM(CASE WHEN date_incoming is not null AND date_stylist_picked is null AND  ops_check IN ('Not Scored','NS') THEN 1 ELSE 0 END) as ops_check_not_scored,
  SUM(CASE WHEN date_incoming is not null AND preview_type = 'Showroom' THEN 1 ELSE 0 END) as showroom_orders,
  SUM(CASE WHEN date_incoming is not null AND preview_type = 'Topic Box' THEN 1 ELSE 0 END) as topic_box_orders,
  SUM(CASE WHEN date_incoming is not null AND not_reached = 'true' THEN 1 ELSE 0 END) as not_reached,
  SUM(CASE WHEN date_incoming is not null AND wrong_phone_number = 'true' THEN 1 ELSE 0 END) as wrong_phone_number,
  SUM(CASE WHEN date_incoming is not null AND payment_type = 'Pre-pay' THEN 1 ELSE 0 END) as prepay_orders,
  SUM(CASE 
        WHEN date_incoming is not null AND box_type != 'Call Box' AND order_state_number IN(8,12) AND payment_type != 'Pre-pay' THEN 1 
        WHEN date_incoming is not null AND box_type = 'Call Box' AND CAST(date_phone_call_current as date)  >= CURDATE() AND payment_type != 'Pre-pay' THEN 1
        ELSE 0 
      END) as backlog
FROM bi.customer_order co
LEFT JOIN bi.previews pr ON co.preview_id = pr.preview_id
LEFT JOIN bi.customer cu ON cu.customer_id = co.customer_id
GROUP BY 1,2,3,4,5,6,7
ORDER BY 1 desc


