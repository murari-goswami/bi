-- Name: tableau.stylist_overview_live
-- Created: 2015-07-09 11:58:01
-- Updated: 2015-09-02 15:31:24

CREATE VIEW tableau.stylist_overview_live
AS

SELECT
  co.id as order_id,
  co.stylelist_id as stylist_id,  
  CASE 
  WHEN s.role = 'Fake' AND s.stylist_id != 118566682 THEN 'Fake Stylist ' || s.team
  ELSE s.first_name || ' ' || s.last_name 
  END as stylist_name,
  s.team as stylist_team,
  s.role as stylist_role,
  co.customer_id,  
  co.sales_channel, 
  CASE
    WHEN real_order.real_order_count = 1 THEN 'First Order'
    WHEN co.sales_channel like 'club%' THEN 'Outfittery Club Order'
    WHEN real_order.real_order_count > 1 AND co.parent_order_id is null THEN 'Repeat Order'
    WHEN co.parent_order_id is not null THEN 'Follow-on Order'
  END as order_type,
  CASE 
    WHEN co.state = 4  THEN 'Initiated'
    WHEN co.state = 8  THEN 'Incoming'
    WHEN co.state = 16 THEN 'Stylist Picked'
    WHEN co.state = 20 THEN 'Purchase Order Created'
    WHEN co.state = 24 THEN 'Sales Order Submitted'
    WHEN co.state = 32 THEN 'Stocked'
    WHEN co.state = 64 THEN 'Placed'
    WHEN co.state = 128 THEN 'Sent'
    WHEN co.state = 256 THEN 'Arrived'
    WHEN co.state = 384 THEN 'Returned Online'
    WHEN co.state = 512 THEN 'Returned'
    WHEN co.state = 1024 THEN 'Completed'
    WHEN co.state = 2048 THEN 'Cancelled'
    ELSE 'Ask BI'
  END as order_state,
  CASE 
    WHEN co.payment_method = 1 THEN 'Invoice'
    WHEN co.payment_method = 2 THEN 'Credit Card'
    WHEN co.payment_method = 4 THEN 'Pre-pay'
    WHEN co.payment_method = 6 THEN 'Arvato'
    ELSE 'Ask BI'
  END as payment_type,
  
/* All dates */
  co.date_created as date_incoming,
  co.phone_date as date_phone_call,
  inv.date_created as date_invoiced,
  co.date_picked as date_stylist_picked,

  CASE 
    WHEN ship_add.country='A' THEN 'AT'
    WHEN ship_add.country='' THEN null
    ELSE ship_add.country 
  END as shipping_country,
  case when CAST(co.date_picked as DATE) = CURDATE() then 1 else null end as processed_today,
  case when CAST(phone_date as date)=curdate() and co.sales_channel != 'website' then 1 else null end as calls_today

FROM postgres.customer_order as co
JOIN postgres.address as ship_add on ship_add.id = co.shipping_address_id
LEFT JOIN postgres.voucher as inv on inv.order_id = co.id AND inv.voucher_type = 'INVOICE'
LEFT JOIN 
(
  SELECT 
    co1.id,
    rank() OVER(PARTITION BY co1.customer_id ORDER BY co1.id) as "real_order_count"
  FROM postgres.customer_order as co1
  WHERE co1.parent_order_id is null
  OR id=parent_order_id                   /* to deal with bad data where order_id=parent_id */
) as real_order on real_order.id = co.id
JOIN bi.stylist s on s.stylist_id = co.stylelist_id
AND s.enabled
where 
(CAST(co.date_picked as DATE) = CURDATE()
or CAST(phone_date as DATE)=CURDATE())
and co.state <> 2048


