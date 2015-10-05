-- Name: raw.dim_customer
-- Created: 2015-09-17 11:48:02
-- Updated: 2015-09-17 11:48:02

/*******************************************************************
-- Author       Hemanth
-- Created      2015-07-01
-- Purpose      This view Gets the raw data from POSTGRES tables. This table has all  
--              customer related information.
--Tables        principal,profile,userconnection,customer_subscription
-------------------------------------------------------------------------------
-- Modification History
--Date          Author      Description
--2015-09-16   	Hemanth     Added status "cancelled" in club_member column
*******************************************************************/

CREATE VIEW raw.dim_customer
AS

SELECT

  p.id AS customer_id,
  p.date_created,
  p.email,
  p.first_name,
  p.last_name,
  CASE 
      WHEN club_status='ACTIVE' THEN 'true'
      WHEN club_status='CANCELLED' THEN 'Cancelled'
      ELSE 'false'
    END AS club_member,
  pr.date_of_birth,
  pr.phone_number,
  p.default_page as domain_page,
  uc.providerid,
  CASE 
      WHEN
          p.first_name IN('test','Test','tester','Tester')
          OR p.first_name like '% test %' OR p.first_name like '% Test %' 
          OR p.last_name IN('test','Test','tester','Tester') OR p.last_name like '% test %' OR p.last_name like '% Test %' 
          OR (p.email like '%test%' and p.email like '%@outfittery%')
          OR (p.email like '%+%' and p.email like '%@outfittery%')
      THEN 'Test User'
      WHEN p.id in ('179899816','179886634','11804631','31281783','143553094','834667','197384812','163836386',
        '62252329','94204965','234063161','242674884','243692185') THEN 'Outfittery Showroom'
    ELSE 'Real User'
    END as user_type,
    CASE 
      WHEN TIMESTAMPDIFF(SQL_TSI_YEAR,cast(pr.date_of_birth as date),curdate())>= 18 AND TIMESTAMPDIFF(SQL_TSI_YEAR,cast(pr.date_of_birth as date),curdate())<=30 THEN '18-30'
      WHEN TIMESTAMPDIFF(SQL_TSI_YEAR,cast(pr.date_of_birth as date),curdate())>= 31 AND TIMESTAMPDIFF(SQL_TSI_YEAR,cast(pr.date_of_birth as date),curdate())<=35 THEN '31-35'
      WHEN TIMESTAMPDIFF(SQL_TSI_YEAR,cast(pr.date_of_birth as date),curdate())>= 36 AND TIMESTAMPDIFF(SQL_TSI_YEAR,cast(pr.date_of_birth as date),curdate())<=45 THEN '36-45'
      WHEN TIMESTAMPDIFF(SQL_TSI_YEAR,cast(pr.date_of_birth as date),curdate())>= 46 AND TIMESTAMPDIFF(SQL_TSI_YEAR,cast(pr.date_of_birth as date),curdate())<=55 THEN '46-55'
      WHEN TIMESTAMPDIFF(SQL_TSI_YEAR,cast(pr.date_of_birth as date),curdate())>= 56 THEN '56+'
      ELSE null
    END as age_group
    
FROM postgres.principal p
LEFT JOIN postgres.profile pr on pr.id=p.profile_id
/*this table has information if customer used facebook,xing,linkdin to register at outfittery*/
LEFT JOIN
(
  SELECT
    row_number() over(partition by userid order by providerid) as r_num,
    userid,
    providerid 
  FROM postgres.userconnection
  WHERE rank=1
  AND secret is not null
)uc on uc.userid=p.email AND r_num=1
/*this table has club information of customer from grails*/
LEFT JOIN
(
  SELECT 
    row_number() over(partition by customer_id order by date_created desc) as rank, 
    customer_id,
  status as club_status
  FROM postgres.customer_subscription
)cl on cl.customer_id=p.id and cl.rank=1


