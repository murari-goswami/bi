-- Name: datamart.dim_order
-- Created: 2015-09-22 15:00:39
-- Updated: 2015-09-22 15:00:39

/**********************************************************************************************
-- Author       Hemanth
-- Created      2015-07-01
-- Purpose      This view joins tables from raw and datamartschema, this view has information
                when opportunities is converted by Stylist
-- Tables       raw.dim_customer_order,raw.dim_case,datamart.dim_opportunity,datamart.fact_order
--------------------------------------------------------------------------------------------------
-- Modification History

-- Date          Author      Description
-- 2015-09-16    Hemanth     Corrected the defintion for date_incoming, since task
                             manager has running with no problems
-- 2015-09-21    Hemanth     Renamed column names according to KPI bilble  
**************************************************************************************************/

CREATE VIEW datamart.dim_order
AS

SELECT

    co.order_id,
    dc_1.case_id,
    co.customer_id,
    co.parent_order_id,

    co.order_type,
    co.payment_type as payment_method,

    co.shipping_region AS order_shipping_region,
    co.shipping_city AS order_shipping_city,
    co.shipping_country AS order_shipping_country,
    co.shipping_zip AS order_shipping_zip,

    /*Address Details*/
    co.billing_region as order_billing_region,
    co.billing_city as order_billing_city,
    co.billing_country as order_billing_country,
    co.billing_zip as order_billing_zip,

    /*Order Process/Status*/
    CASE 
        WHEN fo.billing_total<=fo.billing_received THEN 'Closed'
        WHEN co.order_state=2048 THEN 'Cancelled'
        ELSE 'Open'
    END AS order_status,

    CASE
        WHEN fo.itb4ret=fo.itret THEN 'Fully'
        WHEN fo.itb4ret<>fo.itret AND fo.itret > 0 THEN 'Partly'
        WHEN fo.itb4ret = fo.itexp  THEN 'Not Cancelled'
    END AS order_return_status,

    CASE
        WHEN fo.itb4canc=fo.itcan THEN 'Fully'
        WHEN fo.itcan>=1 THEN 'Partly'
        ELSE 'No Returns yet'
    END AS order_cancellation_status,

    CASE 
        WHEN fo.billing_total<=fo.billing_received THEN 'Settled'
        ELSE 'Open'
    END AS status_balance,
  
    co.date_stylist_picked as date_order_created,
    co.date_invoiced as date_order_invoiced,
    dc.date_completed as date_order_completed,
    co.date_cancelled as date_order_cancelled,
    co.date_shipped as date_order_shipped,
    co.date_returned as date_order_returned,

    co.box_type as order_sales_channel_1,
    REPLACE(REPLACE(REPLACE(REPLACE(sales_channel,'WithoutDate',''),'WithDate',''),'WithCall',''),'WithoutCall','') as order_sales_channel_2,

    co.marketing_campaign as after_order_sales_channel

FROM raw.dim_customer_order co
LEFT JOIN datamart.fact_order fo on fo.order_id=co.order_id
LEFT JOIN raw.dim_case dc_1 on dc_1.order_id=co.order_id
LEFT JOIN 
(
    SELECT 
        fo_1.order_id,
            CASE
                WHEN fo_1.billing_total<=fo_1.billing_received AND co_1.date_returned<=date_amount_paid THEN date_amount_paid
                WHEN fo_1.billing_total<=fo_1.billing_received AND co_1.date_returned>=date_amount_paid THEN co_1.date_returned
                WHEN fo_1.itb4ret=fo_1.itret THEN co_1.date_returned
                ELSE NULL
            END
        AS date_completed
    FROM datamart.fact_order fo_1
    JOIN raw.dim_customer_order co_1 on co_1.order_id=fo_1.order_id
)dc on dc.order_id=co.order_id
WHERE co.date_stylist_picked IS NOT NULL


