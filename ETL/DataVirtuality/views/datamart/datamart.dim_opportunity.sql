-- Name: datamart.dim_opportunity
-- Created: 2015-09-22 14:46:10
-- Updated: 2015-09-22 14:46:10

/********************************************************************************
-- Author       Hemanth
-- Created      2015-07-01
-- Purpose      This view joins tables from raw schema, this view has information
                opportunities before it is converted.
-- Tables       raw.dim_customer_order, raw.dim_case,raw.customer_order_salesforce,
                raw.customer_order_details__audit_log
-------------------------------------------------------------------------------
-- Modification History

-- Date          Author      Description
-- 2015-09-16    Hemanth     Corrected the defintion for date_incoming, since task
                             manager has running with no problems
-- 2015-09-21    Hemanth     Renamed column names according to KPI bilble                             
**********************************************************************************/

CREATE VIEW "datamart"."dim_opportunity"
AS

SELECT 

  co.order_id as opp_id,
  dc.case_id,
  co.customer_id,
  
  co.order_type as opp_type,
  
  /*Address Details*/
  co.shipping_region as opp_shipping_region,
  co.shipping_city as opp_shipping_city,
  co.shipping_country as opp_shipping_country,
  co.shipping_zip as opp_shipping_zip,
  
  co.billing_region as opp_billing_region,
  co.billing_city as opp_billing_city,
  co.billing_country as opp_billing_country,
  co.billing_zip as opp_billing_zip,

  CASE WHEN co.date_stylist_picked IS NULL THEN co.cancellation_reason END AS opp_cancellation_reason,
  cos.ops_check as ops_check_status,
  CASE 
    WHEN co.date_stylist_picked IS NOT NULL THEN 'Converted'
    WHEN co.order_state=2048 OR co.date_cancelled IS NOT NULL THEN 'Cancelled'
    ELSE 'Open'
  END as opp_conversion_status,
  co.payment_type as opp_payment_type,
  co.box_type as opp_sales_channel_1,
  REPLACE(REPLACE(REPLACE(REPLACE(co.sales_channel,'WithoutDate',''),'WithDate',''),'WithCall',''),'WithoutCall','') as opp_sales_channel_2,
  
  /*All Dates related to opportunity*/
  co.date_created as date_opp_created,
  CASE
  	/* Orders with sales_channel = 'website' and websiteWithoutDateAndPendingConfirmation are not real orders, hence exclude date_created should be set to null */ 
    WHEN (co.sales_channel = 'website' AND co.order_state in ('Incoming', 'Cancelled') AND NOT (co.date_preview_created is not null OR cu.phone_number is not   null))
    OR co.sales_channel = 'websiteWithoutDateAndPendingConfirmation' THEN null
    WHEN co.sales_channel = 'website' AND co.date_preview_created > co.date_created THEN co.date_preview_created
    WHEN CAST(co.date_created as date)<'2015-07-21' THEN COALESCE(cod.date_incoming, co.date_created)
    /*Because of task manager job all old orders in state 4 is changed to 8*/
   	WHEN CAST(co.date_created as date)>='2015-07-21' THEN COALESCE(cod.date_incoming,date_incoming_no_call)
  END date_opp_confirmed,
  CASE WHEN co.date_stylist_picked IS NOT NULL THEN co.date_stylist_picked END AS date_opp_closed,
  co.date_cancelled as date_opp_cancelled,
  CASE WHEN cod.date_incoming IS NOT NULL OR cod.date_incoming_no_call IS NOT NULL THEN 1 ELSE 0 END AS opp_confirmation_status

FROM raw.dim_customer_order co
LEFT JOIN raw.dim_customer cu on cu.customer_id=co.customer_id
LEFT JOIN raw.dim_case dc on dc.order_id=co.order_id
LEFT JOIN raw.customer_order_salesforce cos ON cos.order_id=co.order_id
LEFT JOIN raw.customer_order_details__audit_log cod on cod.order_id = co.order_id


