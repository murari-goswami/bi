-- Name: datamart.dim_customer
-- Created: 2015-09-21 17:22:35
-- Updated: 2015-09-21 17:22:35

/********************************************************************************
-- Author       Hemanth
-- Created      2015-07-01
-- Purpose      This view joins tables from raw and datamart schema.
-- Tables       raw.dim_customer,datamart.dim_opportunity,datamart.dim_order,datamart.dim_case
-----------------------------------------------------------------------------------
-- Modification History

-- Date          Author      Description
-- 2015-09-16    Hemanth     1) Added first_sales_channel_1 and first_sales_channel_2
                             2) Removed nb_orders,nb_case since it is already available
                                in datamart.fact_customer
-- 2015-09-21    Hemanth     Renamed column names according to KPI bilble
**********************************************************************************/
CREATE VIEW datamart.dim_customer
AS

SELECT
  
  a.customer_id,
  c.first_sales_channel_1 AS customer_acquisition_channel_1, /*first saleschannel of customer*/
  c.first_sales_channel_2 AS customer_acquisition_channel_2,

  CASE
    WHEN d.cluster='CLUB' THEN 'Club' 
    WHEN d.cluster='AC' THEN 'Loyal'
    WHEN d.cluster IN ('NOCALL0','CALL0') THEN 'New'
    WHEN d.cluster IN ('CLIM','NCLIM') THEN 'Young'
    WHEN d.cluster='P6' THEN 'Passive'
    WHEN d.cluster='P12' THEN 'Inactive'
  END AS customer_segment,

  a.date_created AS date_account_created,
                                               TIMESTAMPDIFF(SQL_TSI_YEAR, cast(a.date_of_birth AS date),CURDATE()) AS customer_age,
  c.status_last_case as customer_status,

  CASE
    WHEN a.phone_number IS NOT NULL THEN '1'
    ELSE '0'
  END AS has_phone_number,
  
  CASE 
    WHEN a.email IS NOT NULL THEN '1'
    ELSE '0'
  END AS has_email,
  
  CASE 
    WHEN a.providerid='facebook' THEN '1'
    ELSE '0'
  END AS has_facebook,
  
  CASE 
    WHEN a.providerid='linkedin' THEN '1'
    ELSE '0'
  END AS has_linkedin,
  
  CASE 
    WHEN a.providerid='xing' THEN '1'
    ELSE '0'
  END AS has_xing,

  CASE 
    WHEN club_member=true THEN '0'
    WHEN club_member='Cancelled' THEN 'Cancelled'
    ELSE '0'
  END AS is_club_customer,

  a.domain_page,
  a.user_type

FROM raw.dim_customer a
LEFT JOIN
( 
  SELECT
    b.customer_id,
    COUNT(DISTINCT b.opp_id) AS nb_orders,
    COUNT(DISTINCT b.case_no) AS nb_cases,
    MIN(CASE WHEN b.rank_first=1 THEN b.opp_sales_channel_1 ELSE NULL END) AS first_sales_channel_1,
    MIN(CASE WHEN b.rank_first=1 THEN b.opp_sales_channel_2 ELSE NULL END) AS first_sales_channel_2,
    MIN(CASE WHEN b.rank_first=1 THEN b.date_opp_created ELSE NULL END) AS first_date_opp_created,
    MIN(CASE WHEN b.rank_first=2 THEN b.date_opp_created ELSE NULL END) AS second_date_opp_created,
    MIN(CASE WHEN b.rank_last=1 THEN b.date_opp_created ELSE NULL END) AS last_date_opp_created,
    MIN(CASE WHEN b.rank_last=1 THEN b.case_status ELSE NULL END) AS status_last_case
  FROM 
  (  
    SELECT
      ROW_NUMBER() over(partition by op.customer_id ORDER BY op.date_opp_created) AS rank_first,
      ROW_NUMBER() over(partition by op.customer_id ORDER BY op.date_opp_created DESC) AS rank_last,
      op.opp_id,
      op.customer_id,
      ca.case_no,
      ca.case_status,
      op.opp_sales_channel_1,
      op.opp_sales_channel_2,
      co.parent_order_id,
      op.date_opp_created,
      co.date_order_created
    FROM datamart.dim_opportunity op
    LEFT JOIN datamart.dim_order co ON co.order_id=op.opp_id
    LEFT JOIN datamart.dim_case ca ON ca.case_id=op.opp_id
  )b
  GROUP BY b.customer_id
)c ON c.customer_id=a.customer_id
LEFT JOIN raw.customer_cluster d ON a.customer_id=d.customer_id


