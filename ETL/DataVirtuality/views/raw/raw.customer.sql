-- Name: raw.customer
-- Created: 2015-04-24 18:17:20
-- Updated: 2015-09-29 12:20:06

CREATE VIEW raw.customer
AS

SELECT
  p.id as "customer_id",
  p.profile_id,
  p.referred_by_id,
  p.email,
  REPLACE(REPLACE(REPLACE(REPLACE(phone_number, '-', ''), '(0)', ''), ' ', ''), '/', '') as phone_number,
  INITCAP(p.first_name) as first_name,
  INITCAP(p.last_name) as last_name,
  CASE WHEN length(p.prefix) < 10 THEN p.prefix ELSE null END as prefix,
  CASE 
    WHEN
      p.first_name = 'test' 
      OR p.first_name = 'Test' 
      OR p.first_name = 'tester' 
      OR p.first_name = 'Tester'
      OR p.first_name like '% test %' 
      OR p.first_name like '% Test %' 
      OR p.last_name = 'test' 
      OR p.last_name = 'Test'
      OR p.last_name = 'Tester' 
      OR p.last_name like '% test %' 
      OR p.last_name like '% Test %' 
      OR (p.email like '%test%' and p.email like '%@outfittery%') 
      OR (p.email like '%+%' and p.email like '%@outfittery%') 
      OR pr.phone_number in ('+493046722431', '+491736363807', '+491632930982', '+4915224292511')
      THEN 'Test User'
    WHEN p.id in ('179899816','179886634','11804631','31281783','143553094','834667','197384812',
    	'163836386','62252329','94204965','234063161','242674884','243692185') THEN 'Outfittery Showroom'
    ELSE 'Real User'
  END as user_type,
  CASE WHEN p.salutation = 1 THEN 'Male' ELSE 'Female' END as gender,
  TIMESTAMPDIFF(SQL_TSI_YEAR, cast(pr.date_of_birth as date),curdate()) as "customer_age",
  CASE 
    WHEN TIMESTAMPDIFF(SQL_TSI_YEAR, cast(pr.date_of_birth as date),curdate()) >= 18 AND TIMESTAMPDIFF(SQL_TSI_YEAR, cast(pr.date_of_birth as date),curdate()) <= 30 THEN '18-30'
    WHEN TIMESTAMPDIFF(SQL_TSI_YEAR, cast(pr.date_of_birth as date),curdate()) >= 31 AND TIMESTAMPDIFF(SQL_TSI_YEAR, cast(pr.date_of_birth as date),curdate()) <= 35 THEN '31-35'
    WHEN TIMESTAMPDIFF(SQL_TSI_YEAR, cast(pr.date_of_birth as date),curdate()) >= 36 AND TIMESTAMPDIFF(SQL_TSI_YEAR, cast(pr.date_of_birth as date),curdate()) <= 45 THEN '36-45'
    WHEN TIMESTAMPDIFF(SQL_TSI_YEAR, cast(pr.date_of_birth as date),curdate()) >= 46 AND TIMESTAMPDIFF(SQL_TSI_YEAR, cast(pr.date_of_birth as date),curdate()) <= 55 THEN '46-55'
    WHEN TIMESTAMPDIFF(SQL_TSI_YEAR, cast(pr.date_of_birth as date),curdate()) >= 56 THEN '56+'
    ELSE null
  END as age_group,   /* Note: these age groups are chosen to line-up with the survey question: How old do you feel? */
  CASE 
    WHEN TIMESTAMPDIFF(SQL_TSI_YEAR, cast(pr.date_of_birth as date),p.date_created) >= 18 AND TIMESTAMPDIFF(SQL_TSI_YEAR, cast(pr.date_of_birth as date),p.date_created) <= 30 THEN '18-30'
    WHEN TIMESTAMPDIFF(SQL_TSI_YEAR, cast(pr.date_of_birth as date),p.date_created) >= 31 AND TIMESTAMPDIFF(SQL_TSI_YEAR, cast(pr.date_of_birth as date),p.date_created) <= 35 THEN '31-35'
    WHEN TIMESTAMPDIFF(SQL_TSI_YEAR, cast(pr.date_of_birth as date),p.date_created) >= 36 AND TIMESTAMPDIFF(SQL_TSI_YEAR, cast(pr.date_of_birth as date),p.date_created) <= 45 THEN '36-45'
    WHEN TIMESTAMPDIFF(SQL_TSI_YEAR, cast(pr.date_of_birth as date),p.date_created) >= 46 AND TIMESTAMPDIFF(SQL_TSI_YEAR, cast(pr.date_of_birth as date),p.date_created) <= 55 THEN '46-55'
    WHEN TIMESTAMPDIFF(SQL_TSI_YEAR, cast(pr.date_of_birth as date),p.date_created) >= 56 THEN '56+'
    ELSE null
  END as age_group_on_registration,
  p.default_page as default_domain,
  p.national_id,
  p.token,
  p.stylelist_id as stylist_id,
  p.facebook_page,
  
  CASE 
  	WHEN p.formal=true THEN 'gesiezt'
	ELSE 'geduzt'
  END AS formal,
  
  /*Subscription*/
  CASE 
  	WHEN pr.newsletter_accepted=true THEN true
	ELSE false
  END AS newsletter_accepted,
  
  CASE 
  	WHEN pr.subscribed_to_newsletter=true THEN true
	ELSE false
  END AS subscribed_to_newsletter,
  
  CASE 
  	WHEN pr.subscribed_to_sms=true THEN true
	ELSE false
  END AS subscribed_to_sms,
  
  CASE 
  	WHEN pr.subscribed_to_stylist_emails=true THEN true
	ELSE false
  END AS subscribed_to_stylist_emails,
  
  /*Club Subscription*/
  CASE 
      WHEN club_status='ACTIVE' THEN 'true'
      WHEN club_status='CANCELLED' THEN 'Cancelled'
      ELSE 'false'
    END AS club_member,
  cl.club_membership_type,
  cl.club_customer_feedback,
  cl.club_member_offer,
  cl.date_club_activated,
  cl.date_club_cancelled,

  CASE 
  	WHEN p.guest_account=true THEN true
	ELSE false
  END AS guest_account,

  /*Customer Image Count*/
  ci.image_count,
  ci.facebook_image_count,
  ci.other_image_count,

/* Dates */
  p.date_created,
  cast(pr.date_of_birth as date) as date_of_birth,
  pr.date_newsletter_confirmed,
  ci.min_date_created as date_first_image_uploaded,
  ci.max_last_updated as date_last_image_uploaded,
  cl.date_first_club_box,

/* Size info */
  pr.height_in_cm,
  pr.weight_in_kg,
  pr.shirt_size,
  CAST(CASE WHEN length(pr.collar_size) > 1 THEN left(pr.collar_size,2) ELSE null END as integer) as collar_size,
  CAST(CASE WHEN length(pr.shoe_size) > 1 THEN replace(pr.shoe_size, ',', '.') ELSE null END as decimal) as shoe_size,
  CAST(CASE 
    WHEN length(pr.trousers_size_width) > 1 AND pr.trousers_size_width != 'null' THEN left(pr.trousers_size_width,2)
    ELSE left(pr.trousers_size, 2)
  END as integer) as trousers_size_width,
  CAST(CASE 
    WHEN length(pr.trousers_size_length) > 1 AND pr.trousers_size_length != 'null' THEN right(pr.trousers_size_length,2)
    ELSE right(pr.trousers_size, 2)
  END as integer) as trousers_size_length,

/* Other questions */
  pr.preferred_contact_channel,
  pr.preferred_contact_time,
  pr.branch_working_in_other as occupation,
  pr.buying_problems,
  pr.buying_problem_other,
  left(cast(p.additional_info as string),4000) as additional_info,

/* Spending Budgets - Note: 
      1) These numbers are in local currency, not always Euros, this is fixed during the transition into bi.customer 
      2) In the old definitions there was no "to" in the final segment, then answer was e.g. 180EUR+. In these cases
        we have put some assumed numbers in, like 250EUR
*/
  CAST(CASE 
    WHEN pr.spending_budget_for_jeans_from is not null THEN pr.spending_budget_for_jeans_from
    WHEN pr.spending_budget_for_jeans = '1' THEN '100'
    WHEN pr.spending_budget_for_jeans = '2' THEN '150'
    WHEN pr.spending_budget_for_jeans = '3' THEN '200'
    WHEN pr.spending_budget_for_jeans = '4' THEN '80'
    WHEN pr.spending_budget_for_jeans = '5' THEN '120'
    WHEN pr.spending_budget_for_jeans = '6' THEN '180'
    WHEN pr.spending_budget_for_jeans = '7' THEN '60'
    WHEN pr.spending_budget_for_jeans = '8' THEN '80'
    WHEN pr.spending_budget_for_jeans = '9' THEN '120'
    WHEN pr.spending_budget_for_jeans = '10' THEN '180'
    ELSE null
  END as integer) as spending_budget_for_jeans_from,
  CAST(CASE 
    WHEN pr.spending_budget_for_jeans_to is not null THEN pr.spending_budget_for_jeans_to
    WHEN pr.spending_budget_for_jeans = '1' THEN '150'
    WHEN pr.spending_budget_for_jeans = '2' THEN '200'
    WHEN pr.spending_budget_for_jeans = '3' THEN '250'
    WHEN pr.spending_budget_for_jeans = '4' THEN '120'
    WHEN pr.spending_budget_for_jeans = '5' THEN '180'
    WHEN pr.spending_budget_for_jeans = '6' THEN '250'
    WHEN pr.spending_budget_for_jeans = '7' THEN '80'
    WHEN pr.spending_budget_for_jeans = '8' THEN '120'
    WHEN pr.spending_budget_for_jeans = '9' THEN '180'
    WHEN pr.spending_budget_for_jeans = '10' THEN '250'
    ELSE null
  END as integer) as spending_budget_for_jeans_to,
  CAST(CASE 
    WHEN pr.spending_budget_for_shirts_from is not null THEN pr.spending_budget_for_shirts_from
    WHEN pr.spending_budget_for_shirts = '1' THEN '60'
    WHEN pr.spending_budget_for_shirts = '2' THEN '80'
    WHEN pr.spending_budget_for_shirts = '3' THEN '100'
    WHEN pr.spending_budget_for_shirts = '4' THEN '40'
    WHEN pr.spending_budget_for_shirts = '5' THEN '60'
    WHEN pr.spending_budget_for_shirts = '6' THEN '80'
    WHEN pr.spending_budget_for_shirts = '7' THEN '100'
    ELSE null
  END as integer) as spending_budget_for_shirts_from,
  CAST(CASE 
    WHEN pr.spending_budget_for_shirts_to is not null THEN pr.spending_budget_for_shirts_to
    WHEN pr.spending_budget_for_shirts = '1' THEN '80'
    WHEN pr.spending_budget_for_shirts = '2' THEN '100'
    WHEN pr.spending_budget_for_shirts = '3' THEN '120'
    WHEN pr.spending_budget_for_shirts = '4' THEN '60'
    WHEN pr.spending_budget_for_shirts = '5' THEN '80'
    WHEN pr.spending_budget_for_shirts = '6' THEN '100'
    WHEN pr.spending_budget_for_shirts = '7' THEN '120'
    ELSE null
  END as integer) as spending_budget_for_shirts_to,
  CAST(CASE 
    WHEN pr.spending_budget_for_shoes_from is not null THEN pr.spending_budget_for_shoes_from
    WHEN pr.spending_budget_for_shoes = '1' THEN '60'
    WHEN pr.spending_budget_for_shoes = '2' THEN '120'
    WHEN pr.spending_budget_for_shoes = '3' THEN '200'
    WHEN pr.spending_budget_for_shoes = '4' THEN '60'
    WHEN pr.spending_budget_for_shoes = '5' THEN '100'
    WHEN pr.spending_budget_for_shoes = '6' THEN '200'
    ELSE null
  END as integer) as spending_budget_for_shoes_from,
  CAST(CASE 
    WHEN pr.spending_budget_for_shoes_to is not null THEN pr.spending_budget_for_shoes_to
    WHEN pr.spending_budget_for_shoes = '1' THEN '120'
    WHEN pr.spending_budget_for_shoes = '2' THEN '200'
    WHEN pr.spending_budget_for_shoes = '3' THEN '250'
    WHEN pr.spending_budget_for_shoes = '4' THEN '100'
    WHEN pr.spending_budget_for_shoes = '5' THEN '200'
    WHEN pr.spending_budget_for_shoes = '6' THEN '300'
    ELSE null
  END as integer) as spending_budget_for_shoes_to,
  CAST(CASE 
    WHEN pr.spending_budget_for_sakkos_from is not null THEN pr.spending_budget_for_sakkos_from
    WHEN pr.spending_budget_for_sakkos = '1' THEN '100'
    WHEN pr.spending_budget_for_sakkos = '2' THEN '150'
    WHEN pr.spending_budget_for_sakkos = '3' THEN '200'
    ELSE null
  END as integer) as spending_budget_for_jackets_from,
  CAST(CASE 
    WHEN pr.spending_budget_for_sakkos_to is not null THEN pr.spending_budget_for_sakkos_to
    WHEN pr.spending_budget_for_sakkos = '1' THEN '150'
    WHEN pr.spending_budget_for_sakkos = '2' THEN '200'
    WHEN pr.spending_budget_for_sakkos = '3' THEN '300'
    ELSE null
  END as integer) as spending_budget_for_jackets_to
FROM postgres.principal p
LEFT JOIN postgres.profile pr on pr.id = p.profile_id
LEFT JOIN (
  SELECT 
    ci.customer_id, 
    cast(min(ci.date_created) as date) as min_date_created, 
    cast(max(ci.last_updated) as date) as max_last_updated,
    count(*) as image_count, 
    sum(case when ci.original_file_name like_regex '\d+\_\d+\_\d+\_[abgnoqstx]' then 1 else 0 end) as facebook_image_count,
    sum(case when ci.original_file_name not like_regex '\d+\_\d+\_\d+\_[abgnoqstx]' then 1 else 0 end) as other_image_count
  FROM postgres.customer_image ci
  GROUP BY ci.customer_id
) ci on ci.customer_id = p.id
/*this table have club information of customer from grails
--only Outfittery_Club_Einf_hrungskampagne__c as club_campaign_member is missing in grails*/
LEFT JOIN
(
  SELECT 
  	row_number() over(partition by customer_id order by date_created desc) AS rank, 
    customer_id,
	status as club_status,
    type as club_membership_type,
    notes as club_customer_feedback,
    offer as club_member_offer,
    CAST(start_date AS DATE) AS date_first_club_box,
    CAST(date_activated AS DATE) AS date_club_activated,
	CAST(date_cancelled AS DATE) AS date_club_cancelled
  FROM postgres.customer_subscription
)cl on cl.customer_id=p.id and cl.rank=1


