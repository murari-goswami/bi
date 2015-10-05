-- Name: raw.customer_raw
-- Created: 2015-07-08 16:02:12
-- Updated: 2015-07-08 16:04:21

CREATE VIEW raw.customer_raw
AS

SELECT
	p.id AS customer_id,
	p.date_created,
	p.email,
	p.first_name,
	p.last_name,
	pr.date_of_birth,
	pr.phone_number,
	uc.providerid,
	CASE 
    	WHEN
      	p.first_name IN('test','Test','tester','Tester')
      	OR p.first_name like '% test %' OR p.first_name like '% Test %' 
      	OR p.last_name IN('test','Test','tester','Tester') OR p.last_name like '% test %' OR p.last_name like '% Test %' 
      	OR (p.email like '%test%' and p.email like '%@outfittery%')
      	OR (p.email like '%+%' and p.email like '%@outfittery%')
   		THEN 'Test User'
    	WHEN p.id in ('179899816','179886634','11804631','31281783','143553094','834667','197384812','163836386','62252329','94204965','234063161','242674884','243692185') THEN 		'Outfittery Showroom'
    ELSE 'Real User'
  	END as user_type,
  	CASE 
    	WHEN TIMESTAMPDIFF(SQL_TSI_YEAR, cast(pr.date_of_birth as date),curdate()) >= 18 AND TIMESTAMPDIFF(SQL_TSI_YEAR, cast(pr.date_of_birth as date),curdate()) <= 30 THEN '18-30'
    	WHEN TIMESTAMPDIFF(SQL_TSI_YEAR, cast(pr.date_of_birth as date),curdate()) >= 31 AND TIMESTAMPDIFF(SQL_TSI_YEAR, cast(pr.date_of_birth as date),curdate()) <= 35 THEN '31-35'
    	WHEN TIMESTAMPDIFF(SQL_TSI_YEAR, cast(pr.date_of_birth as date),curdate()) >= 36 AND TIMESTAMPDIFF(SQL_TSI_YEAR, cast(pr.date_of_birth as date),curdate()) <= 45 THEN '36-45'
    	WHEN TIMESTAMPDIFF(SQL_TSI_YEAR, cast(pr.date_of_birth as date),curdate()) >= 46 AND TIMESTAMPDIFF(SQL_TSI_YEAR, cast(pr.date_of_birth as date),curdate()) <= 55 THEN '46-55'
    	WHEN TIMESTAMPDIFF(SQL_TSI_YEAR, cast(pr.date_of_birth as date),curdate()) >= 56 THEN '56+'
    	ELSE null
  	END as age_group
FROM postgres.principal p
LEFT JOIN postgres.profile pr on pr.id=p.profile_id
LEFT JOIN 
(
	SELECT 
		userid,
		providerid 
	FROM postgres.userconnection
)uc on uc.userid=p.email


