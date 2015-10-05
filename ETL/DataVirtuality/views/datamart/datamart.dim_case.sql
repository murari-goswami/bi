-- Name: datamart.dim_case
-- Created: 2015-09-22 15:01:39
-- Updated: 2015-09-22 15:01:39

/**********************************************************************************************
-- Author       Hemanth
-- Created      2015-07-01
-- Purpose      This view joins tables from raw and datamartschema, this view has information
                about every case created by customer.
-- Tables       datamart.dim_opportunity,datamart.dim_order,raw.customer,raw.dim_case
--------------------------------------------------------------------------------------------------
-- Modification History

-- Date          Author      Description
-- 2015-09-16    Hemanth     Added Headers to view
-- 2015-09-21    Hemanth     Renamed column names according to KPI bilble  
**************************************************************************************************/

CREATE VIEW datamart.dim_case
AS

WITH c_order AS 
(
    SELECT 
    RANK() OVER(PARTITION BY op.customer_id ORDER BY op.date_opp_created DESC) AS "opportunity_rank", 
    op.opp_id,
    op.case_id,
    op.customer_id, 
    co.parent_order_id, 
    op.opp_sales_channel_1,
    op.opp_sales_channel_2,
    op.date_opp_created, 
    co.date_order_created, 
    op.date_opp_cancelled, 
    co.date_order_completed,
    cu.date_of_birth,
    op.opp_shipping_region, 
    op.opp_shipping_city, 
    op.opp_shipping_zip,
    op.opp_shipping_country,
    op.opp_billing_region, 
    op.opp_billing_city, 
    op.opp_billing_zip,
    op.opp_billing_country
  FROM datamart.dim_opportunity op 
  LEFT JOIN datamart.dim_order co on co.order_id=op.opp_id
  LEFT JOIN raw.customer cu on cu.customer_id=op.customer_id  
  )

SELECT

  ac.case_id,
  a.customer_id,
  
  ac.case_no,
  CASE 
    WHEN ac.case_no=1 then 'First Case'  
    ELSE 'Repeat Case'  
  END AS case_type,
   
  d.opp_shipping_region as case_shipping_region,
  d.opp_shipping_city as case_shipping_city,  
  d.opp_shipping_zip as case_shipping_zip,
  d.opp_shipping_country as case_shipping_country,

  d.opp_billing_region as case_billing_region,
  d.opp_billing_city as case_billing_city,  
  d.opp_billing_zip as case_billing_zip,
  d.opp_billing_country as case_billing_country,
  
  d.opp_sales_channel_1 as case_sales_channel_1,
  d.opp_sales_channel_2 as case_sales_channel_2,

  CASE   
    WHEN c.nb_orders=c.nb_cancel_orders THEN '1'  
    ELSE '0'  
  END AS case_cancellation_status,
  CASE
    WHEN d.date_order_completed IS NOT NULL THEN 'Closed'
    WHEN d.date_opp_cancelled IS NULL AND d.date_order_created IS NULL THEN 'Open Opportunity'
    WHEN (d.date_order_completed IS NULL OR d.date_opp_cancelled IS NULL) AND d.date_order_created IS NOT NULL THEN 'Open Order' 
    WHEN c.nb_orders=c.nb_cancel_orders OR d.date_opp_cancelled IS NOT NULL THEN 'Cancelled'
  END AS case_status,
  
  ac.case_date_created as date_case_created,
  TIMESTAMPDIFF(SQL_TSI_YEAR, cast(a.date_of_birth as date),cast(ac.case_date_created as date)) as case_customer_age,  
   
  CASE 
    WHEN e.parent_order_id IS NOT NULL or a.parent_order_id IS NOT NULL THEN 'True'
    ELSE 'False' 
  END AS has_follow_on
  
FROM 
(
	SELECT 
		case_id,
		case_date_created,
		case_no
	FROM raw.dim_case
	WHERE case_id=89796654
	GROUP BY 1,2,3
)ac 
LEFT JOIN c_order a on ac.case_id=a.case_id
/*This join gets number of orders created and cancelled*/  
LEFT JOIN   
(  
 SELECT   
  customer_id,  
  count(*) AS nb_orders,  
  COUNT(DISTINCT case when date_opp_cancelled IS NULL then opp_id else null end) nb_cancel_orders 
 FROM c_order  
 GROUP BY 1
)c on c.customer_id=a.customer_id 
  
LEFT JOIN  
(  
 SELECT  
  customer_id,
  MAX(CASE WHEN opportunity_rank=1 THEN opp_sales_channel_1 END) AS opp_sales_channel_1,
  MAX(CASE WHEN opportunity_rank=1 THEN opp_sales_channel_2 END) AS opp_sales_channel_2,
  MAX(CASE WHEN opportunity_rank=1 THEN opp_shipping_region END) AS opp_shipping_region, 
  MAX(CASE WHEN opportunity_rank=1 THEN opp_shipping_city END) AS opp_shipping_city, 
  MAX(CASE WHEN opportunity_rank=1 THEN opp_shipping_country END) AS opp_shipping_country, 
  MAX(CASE WHEN opportunity_rank=1 THEN opp_shipping_zip END) AS opp_shipping_zip,
  MAX(CASE WHEN opportunity_rank=1 THEN opp_billing_region END) AS opp_billing_region, 
  MAX(CASE WHEN opportunity_rank=1 THEN opp_billing_city END) AS opp_billing_city, 
  MAX(CASE WHEN opportunity_rank=1 THEN opp_billing_country END) AS opp_billing_country, 
  MAX(CASE WHEN opportunity_rank=1 THEN opp_billing_zip END) AS opp_billing_zip,
  MAX(CASE WHEN opportunity_rank=1 THEN date_order_created END) AS date_order_created,
  MAX(CASE WHEN opportunity_rank=1 THEN date_order_completed END) AS date_order_completed,
  MAX(CASE WHEN opportunity_rank=1 THEN date_opp_cancelled END) AS date_opp_cancelled
 FROM c_order
 GROUP BY 1
)d on d.customer_id=a.customer_id

LEFT JOIN  
(  
  SELECT   
    distinct c_2.parent_order_id  
  FROM c_order c_2 
  GROUP BY 1
)e ON e.parent_order_id=a.opp_id
GROUP BY 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19


