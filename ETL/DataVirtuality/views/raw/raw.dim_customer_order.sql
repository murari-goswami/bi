-- Name: raw.dim_customer_order
-- Created: 2015-09-22 14:35:25
-- Updated: 2015-09-22 14:35:25

/*******************************************************************
-- Author       Hemanth
-- Created      2015-07-01
-- Purpose      This view Gets the raw data from POSTGRES tables. This table has  
--              order information of customer 
--Tables        customer_order,address,voucher,order_position,doc_data_shipment_confirmation,
                preview,doc_data_manifest_shipping,order_cancellation,order_cancellation_reason
-------------------------------------------------------------------------------
-- Modification History
--Date          Author      Description
--2015-09-16    Hemanth     Added Comments to sub-queries
--2015-09-22    Hemanth     Added Billing address
*******************************************************************/

CREATE VIEW raw.dim_customer_order
AS

SELECT
  co.id as order_id,
  co.customer_id,
  co.parent_order_id,
  co.shipping_address_id,
  co.stylelist_id as stylist_id,
  CASE 
    WHEN co.payment_method = 1 THEN 'Invoice'
      WHEN co.payment_method = 2 THEN 'Credit Card'
      WHEN co.payment_method = 4 THEN 'Pre-pay'
      WHEN co.payment_method = 6 THEN 'Arvato'
      ELSE 'Ask BI'
  END as payment_type,
  co.sales_channel,
  co.state as order_state,

  co.date_created,
  pr.date_preview_created,
  co.phone_date as date_phone_call,
  /*Date Picked from amidala when stylist picks the articles, date_picked in customer_order when order is submitted to warehouse
  and invoice is printed*/
  COALESCE(op.date_stylist_picked,co.date_picked,dd_ms.date_shipped,co.date_shipped) as date_stylist_picked,
  /*date_invoiced is when invoice is printed and kept in the box which we get form shippiment comfirmation, it takes invoice date
  created if date in manifest shipping is null*/
  COALESCE(dd_sc.date_invoiced,inv.date_created) as date_invoiced,
  co.date_returned,
  /*date_shipped from doc_data is when label is printed, will be changed to aftership table when dhl scans the label*/
  COALESCE(dd_ms.date_shipped,co.date_shipped) as date_shipped,
  co.date_payed AS date_paid, /*date_paid for arvato customers can be get from dwh.arvato payments*/
  COALESCE(can.date_cancelled,co.date_canceled) as date_cancelled,
  can.cancellation_reason,

  co.marketing_campaign,
  co.discount_type,
  /* Be very careful here as the code for discounts is duplicated for the discount_total column */
  CASE 
    WHEN co.total_goodwill_credit IS NOT NULL THEN co.total_goodwill_credit ELSE 0 END
    +CASE WHEN co.total_amount_billed_discount IS NOT NULL THEN co.total_amount_billed_discount ELSE 0 END
    +CASE WHEN NOT (vou.credit_note = vou.credit_goodwill OR vou.credit_note = vou.credit_campaign) AND vou.credit_note IS NOT NULL THEN vou.credit_note ELSE 0 
  END as discount_total,

  CASE WHEN co.total_goodwill_credit IS NOT NULL THEN co.total_goodwill_credit ELSE 0 END as discount_goodwill,
  CASE WHEN co.total_amount_billed_discount IS NOT NULL THEN co.total_amount_billed_discount ELSE 0 END as discount_marketing,
  CASE WHEN (vou.credit_note <> vou.credit_goodwill OR vou.credit_note <> vou.credit_campaign) AND vou.credit_note IS NOT NULL THEN vou.credit_note ELSE 0 
  END as discount_paid_voucher,

  co.total_amount_payed,
  
  co.currency_code as country_code_iso,
  
  CASE 
    WHEN ship_add.country IN ('DE','AT','CH') THEN 'DACH'
    WHEN ship_add.country IN ('BE','NL','LU') THEN 'BENELUX'
    WHEN ship_add.country IN ('DK','SE') THEN 'Nordic'
  ELSE 'ASK BI'
  END AS shipping_region,
  INITCAP(ship_add.city) as shipping_city,
  ship_add.zip as shipping_zip,
  CASE 
    WHEN ship_add.country='A' THEN 'AT'
    WHEN ship_add.country='' THEN null
    ELSE ship_add.country 
  END as shipping_country,
  
  CASE 
    WHEN bill_add.country IN ('DE','AT','CH') THEN 'DACH'
    WHEN bill_add.country IN ('BE','NL','LU') THEN 'BENELUX'
    WHEN bill_add.country IN ('DK','SE') THEN 'Nordic'
  ELSE 'ASK BI'
  END AS billing_region,
  INITCAP(bill_add.city) as billing_city,
  bill_add.zip as billing_zip,
  CASE 
    WHEN bill_add.country='A' THEN 'AT'
    WHEN bill_add.country='' THEN null
    ELSE bill_add.country 
  END as billing_country,
  
  /*Call Box is set when order has phone date or else its is No Call box
    with TM, the definition will be changed Call Box (state change 4-8) and NoCall Box (4-12)*/
  CASE
    WHEN co.phone_date > '2012-05-10'
    AND co.phone_date < TIMESTAMPADD(SQL_TSI_MONTH, 2, curdate())
    AND co.phone_date >= co.date_created
    THEN 'Call Box'
    WHEN co.sales_channel = 'clubWithCall' THEN 'Call Box'
    ELSE 'No Call Box'
  END as box_type,

  CASE
    WHEN real_order.real_order_count = 1 AND co.parent_order_id is null THEN 'First Order'
    WHEN all_order.all_order_count = 2 AND co.parent_order_id is not null THEN 'First Order Follow-on'
    WHEN co.sales_channel like 'club%' THEN 'Outfittery Club Order'
    WHEN real_order.real_order_count > 1 AND co.parent_order_id is null THEN 'Repeat Order'
    WHEN all_order.all_order_count > 2 AND co.parent_order_id is not null THEN 'Repeat Order Follow-on'
    WHEN real_order.real_order_count = 1 AND co.id = co.parent_order_id THEN 'First Order'            /* to deal with bad data where order_id=parent_id */
  END as order_type
    
FROM postgres.customer_order co
LEFT JOIN postgres.address as ship_add on ship_add.id = co.shipping_address_id
LEFT JOIN postgres.address as bill_add on bill_add.id = co.shipping_address_id
LEFT JOIN postgres.voucher inv on inv.order_id = co.id AND inv.voucher_type = 'INVOICE'
LEFT JOIN
(
  SELECT
    order_id,
    MAX(date_picked) as date_stylist_picked
  FROM postgres.order_position
  GROUP BY 1
)op on op.order_id=co.id
/*date_invoiced is when invoice is kept in box i.e., shipment confirmation*/
LEFT JOIN  
(
  SELECT 
    ss.orderid as order_id, 
    parsedate(min(ss.shipping_date), 'yyyyMMdd') as date_invoiced 
  FROM postgres.doc_data_shipment_confirmation ss
  GROUP BY 1
) dd_sc on dd_sc.order_id = co.id

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

/*get the date shipped from doc_data_manifest_shipping*/
LEFT JOIN  
(
  SELECT 
    ss.orderid as order_id,
    parsedate(min(ss.shipping_date), 'yyyyMMdd') as date_shipped
  FROM postgres.doc_data_manifest_shipping ss
  GROUP BY 1
) dd_ms on dd_ms.order_id = co.id

/*Get vouchers Information*/
LEFT JOIN 
(
  SELECT
    v.order_id, 
    sum(CASE WHEN v.voucher_type = 'CREDIT_GOODWILL' THEN -v.amount ELSE 0 END) as credit_goodwill,
    sum(CASE WHEN v.voucher_type = 'CREDIT_CAMPAIGN' THEN -v.amount ELSE 0 END) as credit_campaign,
    sum(CASE WHEN v.voucher_type = 'CREDIT_NOTE' THEN -v.amount ELSE 0 END) as credit_note
  FROM postgres.voucher v 
  GROUP BY 1
) vou on vou.order_id = co.id

/* Rank of order within all non-follow-on orders by this customer */
LEFT JOIN 
(
  SELECT 
    c_2.id,
    rank() OVER(PARTITION BY c_2.customer_id ORDER BY c_2.id) as "real_order_count"
  FROM postgres.customer_order as c_2
  WHERE c_2.parent_order_id IS NULL
  OR c_2.id=c_2.parent_order_id       /* to deal with bad data where id=parent_order_id */
) as real_order on real_order.id = co.id

/* Rank of order within all orders by this customer */
LEFT JOIN
(
  SELECT
    c_3.id,
    rank() OVER(PARTITION BY c_3.customer_id ORDER BY c_3.id) as "all_order_count"
  FROM postgres.customer_order as c_3
) as all_order on all_order.id = co.id
/*This table has cancellation information if order is cancelled by customer support or by 
script if there is no state in 60 days and last_updated date <10 days*/
LEFT JOIN
(
  SELECT  
    oc.order_id,
    oc.date_created AS date_cancelled,
    ocr.reason AS cancellation_reason
  FROM postgres.order_cancellation oc
  LEFT JOIN postgres.order_cancellation_reason ocr ON oc.order_cancellation_reason_id=ocr.id
)can on can.order_id=co.id


