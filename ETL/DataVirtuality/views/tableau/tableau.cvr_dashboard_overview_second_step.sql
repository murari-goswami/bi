-- Name: tableau.cvr_dashboard_overview_second_step
-- Created: 2015-08-11 16:06:49
-- Updated: 2015-09-28 17:25:49

CREATE VIEW tableau.cvr_dashboard_overview_second_step
AS

SELECT
   order_id,
   CAST(co.date_created as date) as date_created,
   shipping_country as country,
   order_type,
   box_type,
   sales_channel,
   cu.customer_age,
   cu.age_group,
   CASE 
      WHEN ga.device_category is null THEN 'unknown'
      ELSE ga.device_category
   END as device_category,

   CASE 
      WHEN date_incoming is not null 
         AND co.order_state_number >= 8
      THEN 1
      WHEN co.order_state_number >= 16 THEN 1
      ELSE 0 
   END as confirmed_opportunity,

   CASE 
      WHEN date_stylist_picked is not null
         AND co.order_state_number >= 16
         AND co.order_state_number < 2048 
      THEN 1 
      ELSE 0 
   END as stylist_picked_order,

   CASE 
      WHEN date_incoming is not null 
         AND date_stylist_picked is null 
         AND order_state_number = 2048 
      THEN 1
      ELSE 0 
   END as canceled_within_second_step,

   CASE 
      WHEN date_incoming is not null 
         AND date_stylist_picked is null 
         AND order_sales_stage = 'On hold' 
      THEN 1 
      ELSE 0 
   END as on_hold,

   CASE 
      WHEN date_incoming is not null   
         AND date_stylist_picked is null 
         AND ops_check IN ('Not Scored','NS') 
      THEN 1 
      ELSE 0 
   END as ops_check_not_scored,

   CASE 
      WHEN date_incoming is not null 
         AND preview_type = 'Showroom' 
      THEN 1
      ELSE 0 
   END as showroom_order,

   CASE 
      WHEN date_incoming is not null 
         AND preview_type = 'Topic Box' 
      THEN 1 
      ELSE 0 
   END as topic_box_order,

   CASE 
      WHEN date_incoming is not null 
         AND not_reached = 'true' 
      THEN 1 
      ELSE 0 
   END as not_reached,

   CASE 
      WHEN date_incoming is not null 
         AND wrong_phone_number = 'true' 
      THEN 1 
      ELSE 0 
   END as wrong_phone_number,

   CASE 
      WHEN date_incoming is not null 
         AND payment_type = 'Pre-pay' 
            THEN 1 
      ELSE 0 END as prepay_order,

   CASE 
      WHEN date_incoming is not null 
         AND box_type != 'Call Box' 
         AND order_state_number IN(8,12) 
         AND payment_type != 'Pre-pay' 
      THEN 1 
      WHEN date_incoming is not null AND box_type = 'Call Box' 
         AND CAST(date_phone_call_current as date)  >= CURDATE() 
         AND payment_type != 'Pre-pay' THEN 1
      ELSE 0 
   END as backlog

FROM bi.customer_order co
LEFT JOIN bi.previews pr ON co.preview_id = pr.preview_id
LEFT JOIN bi.customer cu ON cu.customer_id = co.customer_id
LEFT JOIN views.ga_information  ga ON co.order_id = ga.transaction_id
WHERE (date_incoming is not null AND co.order_state_number >= 8) OR co.order_state_number >= 16


