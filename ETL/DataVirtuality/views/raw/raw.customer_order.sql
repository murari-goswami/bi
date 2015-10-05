-- Name: raw.customer_order
-- Created: 2015-04-24 18:17:16
-- Updated: 2015-09-28 18:20:17

CREATE VIEW raw.customer_order 
AS 

SELECT
  co.id as order_id,
  co.parent_order_id,
  co.customer_id,
  pr.preview_id,
  pr.customer_preview_id,
  co.campaign_id,
  co.stylelist_id as stylist_id,
  inv.reference_number as invoice_number, 
  co.sales_channel,  /* sales_channel data is a mess, we should probably put a fix in sometime to clean it up */
  CASE
    WHEN real_order.real_order_count = 1 AND co.parent_order_id is null THEN 'First Order'
    WHEN all_order.all_order_count = 2 AND co.parent_order_id is not null THEN 'First Order Follow-on'
    WHEN co.sales_channel like 'club%' THEN 'Outfittery Club Order'
    WHEN real_order.real_order_count > 1 AND co.parent_order_id is null THEN 'Repeat Order'
    WHEN all_order.all_order_count > 2 AND co.parent_order_id is not null THEN 'Repeat Order Follow-on'
    WHEN real_order.real_order_count = 1 AND co.id = co.parent_order_id THEN 'First Order'            /* to deal with bad data where order_id=parent_id */
  END as "order_type",
  CASE
    WHEN real_order_completed.real_order_count_completed is null THEN 'Not Completed'
    WHEN real_order_completed.real_order_count_completed = 1 AND co.parent_order_id is null THEN 'First Order'
    WHEN all_order_completed.all_order_count_completed = 2 AND co.parent_order_id is not null THEN 'First Order Follow-on'
    WHEN co.sales_channel like 'club%' THEN 'Outfittery Club Order'
    WHEN real_order_completed.real_order_count_completed > 1 AND co.parent_order_id is null THEN 'Repeat Order'
    WHEN all_order_completed.all_order_count_completed > 2 AND co.parent_order_id is not null THEN 'Repeat Order Follow-on'
    WHEN real_order_completed.real_order_count_completed = 1 AND co.id = co.parent_order_id THEN 'First Order'  /* to deal with bad data where order_id=parent_id */
  END as "order_type_completed",
  CASE 
    WHEN co.state = 4  THEN 'Initiated'
    WHEN co.state = 8  THEN 'Incoming'
    WHEN co.state = 12 THEN 'Checkout Enabled'
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
  co.state as order_state_number,

/* Currency, Payment and Discount data. Note: Final prices are calculated from articles, so are not in this view. */
  co.currency_code, 
  CASE 
    WHEN co.payment_method = 1 THEN 'Invoice'
    WHEN co.payment_method = 2 THEN 'Credit Card'
    WHEN co.payment_method = 4 THEN 'Pre-pay'
    WHEN co.payment_method = 6 THEN 'Arvato'
    ELSE 'Ask BI'
  END as payment_type,
  CASE 
    WHEN co.payment_state = 8 THEN 'Pending'
    WHEN co.payment_state = 16 THEN 'Authorised'
    WHEN co.payment_state = 32 THEN 'Captured'
    WHEN co.payment_state = 48 THEN 'Factored'
    WHEN co.payment_state = 64 THEN 'Paid'
    WHEN co.payment_state = 2048 THEN 'Cancelled'
    ELSE 'Ask BI' 
  END as payment_state,
  co.discount_type,  /* Need to create a CASE statement lookup for this sometime */
  can.cancellation_reason, /*This information is filled by CS /warehouse when order is cancelled manually*/

/* Be very careful here as the code for discounts is duplicated for the discount_total column */
  CASE WHEN co.total_goodwill_credit is not null THEN co.total_goodwill_credit ELSE 0 END
    +CASE WHEN co.total_amount_billed_discount is not null THEN co.total_amount_billed_discount ELSE 0 END
    +CASE WHEN NOT (vou.credit_note = vou.credit_goodwill OR vou.credit_note = vou.credit_campaign) AND vou.credit_note is not null THEN vou.credit_note ELSE 0 END as discount_total_in_local_currency,
  CASE WHEN co.total_goodwill_credit is not null THEN co.total_goodwill_credit ELSE 0 END as discount_goodwill_in_local_currency,
  CASE WHEN co.total_amount_billed_discount is not null THEN co.total_amount_billed_discount ELSE 0 END as discount_marketing_in_local_currency,
  CASE WHEN NOT (vou.credit_note = vou.credit_goodwill OR vou.credit_note = vou.credit_campaign) AND vou.credit_note is not null THEN vou.credit_note ELSE 0 END as discount_paid_voucher_in_local_currency,

  co.max_total_amount_billed_retail_gross as sales_maximum_in_local_currency,
  co.max_total_amount_billed_retail_gross_origin as sales_maximum_type, 
  CASE WHEN co.payment_method != 6 THEN co.total_amount_payed ELSE null END as billing_received_in_local_currency,  /* Data for Arvato orders is incorrect, so set it to null */
  
/* All dates */
  co.date_created,
  pr.date_preview_created,
  co.date_canceled as date_cancelled,
  co.phone_date as date_phone_call,
  /* As most financial reporting is based on date_invoiced and we want to do historical reporting, we need to fill in the gaps from 2012/2013, hence this CASE statement */
  CASE 
    WHEN inv.date_created is not null THEN inv.date_created
    WHEN co.date_billed is not null THEN co.date_billed
    WHEN co.state >=16 AND co.state <=1024 THEN COALESCE(co.date_picked, co.date_shipped, co.date_created)   
  END as date_invoiced,
  COALESCE(co.date_picked,co.date_shipped) as date_stylist_picked,
  co.date_submitted,
  CASE
    WHEN co.date_shipped is not null THEN co.date_shipped
    WHEN co.state >=128 AND co.state <=1024 THEN COALESCE(inv.date_created, co.date_billed, co.date_submitted, co.date_picked, co.date_created)        
  END as date_shipped_internal,
  co.date_return_reminder,
  co.date_returned_online,
  co.date_return_registration,
  COALESCE(co.date_returned, op.date_returned) as date_returned,
  co.date_completed,
  co.date_first_reminder,
  co.date_first_dunning as date_first_warning,
  co.date_second_dunning as date_second_warning,
  co.date_third_dunning as date_third_warning,
  co.date_encashment as date_given_to_debt_collection,
  CASE WHEN co.state = 2048 THEN NULL ELSE co.date_payed END as date_paid,  /* There should be nothing paid if the order was cancelled */

/* Address details */ 
  co.shipping_address_meets_billing_address,
  INITCAP(ship_add.city) as shipping_city,
  CASE 
    WHEN ship_add.country='A' THEN 'AT'
    WHEN ship_add.country='' THEN null
    ELSE ship_add.country 
  END as shipping_country,
  INITCAP(ship_add.street) as shipping_street,
  ship_add.street_number as shipping_street_number,
  ship_add.zip as shipping_zip,
  INITCAP(ship_add.first_name) as shipping_first_name,
  INITCAP(ship_add.last_name) as shipping_last_name,
  INITCAP(ship_add.co) as shipping_co,
  INITCAP(bill_add.city) as billing_city,
  CASE
    WHEN bill_add.country='A' then 'AT'
    WHEN bill_add.country='' THEN null
    ELSE bill_add.country 
  END as billing_country,
  INITCAP(bill_add.street) as billing_street,
  bill_add.street_number as billing_street_number,
  bill_add.zip as billing_zip,
  INITCAP(bill_add.first_name) as billing_first_name,
  INITCAP(bill_add.last_name) as billing_last_name,
  INITCAP(bill_add.co) as billing_co,

  co.marketing_campaign, /*this field is used by stylist to add direct feedback call if customer is reached*/
/* Position of the order within the customer's order history */  
  all_order.all_order_count,
  real_order.real_order_count,
  follow_on.follow_on_count,
  real_order_completed.real_order_count_completed,
  all_order_completed.all_order_count_completed,

  co.customer_message_content

FROM postgres.customer_order as co
JOIN postgres.address as ship_add on ship_add.id = co.shipping_address_id
LEFT JOIN postgres.address as bill_add on bill_add.id = co.billing_address_id
LEFT JOIN postgres.voucher as inv on inv.order_id = co.id AND inv.voucher_type = 'INVOICE'

LEFT JOIN 
(
  SELECT
    op.order_id,
    MIN(op.date_returned) as date_returned
  FROM postgres.order_position op 
  GROUP BY 1
) as op on op.order_id = co.id

/* Rank of order within all orders by this customer */
LEFT JOIN 
(
  SELECT 
    co3.id,
    rank() OVER(PARTITION BY co3.customer_id ORDER BY co3.id) as "all_order_count"
  FROM postgres.customer_order as co3
) as all_order on all_order.id = co.id

/* Rank of order within all non-follow-on orders by this customer */
LEFT JOIN 
(
  SELECT 
    co1.id,
    rank() OVER(PARTITION BY co1.customer_id ORDER BY co1.id) as "real_order_count"
  FROM postgres.customer_order as co1
  WHERE co1.parent_order_id is null
  OR id=parent_order_id                   /* to deal with bad data where order_id=parent_id */
) as real_order on real_order.id = co.id

/* Rank of order within all follow-on orders by this customer */
LEFT JOIN 
(
  SELECT 
    co2.id,
    rank() OVER(PARTITION BY co2.customer_id ORDER BY co2.id) as "follow_on_count"
  FROM postgres.customer_order as co2
  WHERE co2.parent_order_id is not null
) as follow_on on follow_on.id = co.id

/* Rank of order within all completed non-follow-on orders by this customer */
LEFT JOIN 
(
  SELECT 
    co5.id,
    rank() OVER(PARTITION BY co5.customer_id ORDER BY co5.id) as "real_order_count_completed"
  FROM postgres.customer_order as co5
  WHERE (co5.parent_order_id is null AND co5.state = 1024)
  OR (id=parent_order_id AND co5.state = 1024 )       /* to deal with bad data where order_id=parent_id */
) as real_order_completed on real_order_completed.id = co.id

/* Rank of order within all completed orders by this customer */
LEFT JOIN 
(
  SELECT 
    co6.id,
    rank() OVER(PARTITION BY co6.customer_id ORDER BY co6.id) as "all_order_count_completed"
  FROM postgres.customer_order as co6
  WHERE co6.state = 1024
) as all_order_completed on all_order_completed.id = co.id

/* Get the last clicked on showroom / preview / topic box (and its parent) by ordering by date_created */
LEFT JOIN 
(
  SELECT 
    pd.order_id,
    pd.preview_id,
    pd.customer_preview_id,
    pd.date_preview_created
  FROM
  (
    SELECT 
      pr1.preview_id,
      pr1.id as customer_preview_id,
      pr1.date_created as date_preview_created,
      pr1.order_id,
      row_number() over (partition by pr1.order_id order by pr1.date_created desc) as "rnum"
    FROM postgres.preview pr1
  ) pd
  WHERE pd.rnum = '1'
) pr on pr.order_id = co.id

/* Get vouchers */
LEFT JOIN 
(
  SELECT
  v.order_id, 
  sum(CASE WHEN v.voucher_type = 'CREDIT_GOODWILL' THEN -v.amount ELSE 0 END) as credit_goodwill,
  sum(CASE WHEN v.voucher_type = 'CREDIT_CAMPAIGN' THEN -v.amount ELSE 0 END) as credit_campaign,
  sum(CASE WHEN v.voucher_type = 'CREDIT_NOTE' THEN -v.amount ELSE 0 END) as credit_note
  FROM postgres.voucher v 
  GROUP BY v.order_id
) vou on vou.order_id = co.id

/*Get Cancellation reason*/
LEFT JOIN
(
select 
  oc.order_id,
  ocr.reason as cancellation_reason
 from "postgres.order_cancellation" oc
 LEFT JOIN "postgres.order_cancellation_reason" ocr ON oc.order_cancellation_reason_id=ocr.id
) can on can.order_id=co.id


