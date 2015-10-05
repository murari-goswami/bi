-- Name: bi.customer
-- Created: 2015-04-24 18:18:05
-- Updated: 2015-09-29 12:32:26

CREATE VIEW bi.customer
as

SELECT
  c.customer_id,
  c.profile_id,
  sty.stylist_id,
  c.referred_by_id,
  sal.customer_status,
  sal.vip_customer,
  c.club_member,
  CASE 
    WHEN c.club_membership_type = 'CALL' THEN 'Call'
    WHEN c.club_membership_type = 'NO_CALL' THEN 'No Call'
    ELSE c.club_membership_type
  END as club_membership_type,
  c.club_customer_feedback,
  c.club_member_offer,
  c.date_club_activated,
  c.date_club_cancelled,
  c.email,
  c.phone_number,
  c.first_name,
  c.last_name,
  c.prefix,
  c.user_type,
  c.gender,
  c.formal,
  c.guest_account,
  c.customer_age,
  c.age_group,   /* Note: these age groups are chosen to line-up with the survey question: How old do you feel? */
  c.age_group_on_registration,
  CASE 
    WHEN cs.age_felt__18_30 = 1 OR cs.old_age_felt__18_30 = 1 THEN '18-30'
    WHEN cs.age_felt__31_35 = 1 OR cs.old_age_felt__31_35 = 1 THEN '31-35'
    WHEN cs.age_felt__36_45 = 1 OR cs.old_age_felt__36_45 = 1 THEN '36-45'
    WHEN cs.age_felt__46_55 = 1 OR cs.old_age_felt__46_55 = 1 THEN '46-55'
    WHEN cs.old_age_felt__55plus = 1 THEN '56+'
    ELSE null
  END as age_group_felt,
  c.stylist_id as new_stylist_id,
  c.default_domain,
  c.national_id,
  arv.arvato_score as initial_arvato_score,
  
  /*Subscription*/
  c.newsletter_accepted,
  c.subscribed_to_sms,
  c.subscribed_to_stylist_emails,
  CASE
    WHEN c.date_newsletter_confirmed IS NULL THEN '0'
    WHEN c.date_newsletter_confirmed IS NOT NULL THEN '1'
  END as newsletter_confirmed,
  CASE
    WHEN c.subscribed_to_newsletter= 'true' THEN 'Subscribed'
    ELSE 'Unsubscribed'
  END as subscribe_status,

  c.token,
  c.facebook_page,
  c.image_count,
  c.facebook_image_count,
  c.other_image_count,
  c.additional_info,

/* Dates */
  c.date_created,
  c.date_of_birth,
  c.date_newsletter_confirmed,
  c.date_first_image_uploaded,
  c.date_last_image_uploaded,
  c.date_first_club_box,
  
/* Size info */
  c.height_in_cm,
  c.weight_in_kg,
  c.shirt_size,
  c.collar_size,
  c.shoe_size,
  c.trousers_size_width,
  c.trousers_size_length,

/* Other questions */
  c.preferred_contact_channel,
  c.preferred_contact_time,
  c.occupation,
  c.buying_problems,
  c.buying_problem_other,
  cbc.marketing_cluster,

/* Spending Budgets - Note: 
      In the old definitions there was no "to" in the final segment, then answer was e.g. 180EUR+. In these cases
        we have put some assumed numbers in, like 250EUR (defined in raw.customer)
*/
  CASE 
    WHEN e1.exchange_rate IS NOT NULL THEN c.spending_budget_for_jeans_from/e1.exchange_rate
    WHEN e2.exchange_rate IS NOT NULL THEN c.spending_budget_for_jeans_from/e2.exchange_rate
    ELSE c.spending_budget_for_jeans_from
  END as spending_budget_for_jeans_from,
  CASE 
    WHEN e1.exchange_rate IS NOT NULL THEN c.spending_budget_for_jeans_to/e1.exchange_rate
    WHEN e2.exchange_rate IS NOT NULL THEN c.spending_budget_for_jeans_to/e2.exchange_rate
    ELSE c.spending_budget_for_jeans_to
  END as spending_budget_for_jeans_to,
  CASE 
    WHEN e1.exchange_rate IS NOT NULL THEN c.spending_budget_for_shirts_from/e1.exchange_rate
    WHEN e2.exchange_rate IS NOT NULL THEN c.spending_budget_for_shirts_from/e2.exchange_rate
    ELSE c.spending_budget_for_shirts_from
  END as spending_budget_for_shirts_from,
  CASE 
    WHEN e1.exchange_rate IS NOT NULL THEN c.spending_budget_for_shirts_to/e1.exchange_rate
    WHEN e2.exchange_rate IS NOT NULL THEN c.spending_budget_for_shirts_to/e2.exchange_rate
    ELSE c.spending_budget_for_shirts_to
  END as spending_budget_for_shirts_to,
  CASE 
    WHEN e1.exchange_rate IS NOT NULL THEN c.spending_budget_for_shoes_from/e1.exchange_rate
    WHEN e2.exchange_rate IS NOT NULL THEN c.spending_budget_for_shoes_from/e2.exchange_rate
    ELSE c.spending_budget_for_shoes_from
  END as spending_budget_for_shoes_from,
  CASE 
    WHEN e1.exchange_rate IS NOT NULL THEN c.spending_budget_for_shoes_to/e1.exchange_rate
    WHEN e2.exchange_rate IS NOT NULL THEN c.spending_budget_for_shoes_to/e2.exchange_rate
    ELSE c.spending_budget_for_shoes_to
  END as spending_budget_for_shoes_to,
  CASE 
    WHEN e1.exchange_rate IS NOT NULL THEN c.spending_budget_for_jackets_from/e1.exchange_rate
    WHEN e2.exchange_rate IS NOT NULL THEN c.spending_budget_for_jackets_from/e2.exchange_rate
    ELSE c.spending_budget_for_jackets_from
  END as spending_budget_for_jackets_from,
  CASE 
    WHEN e1.exchange_rate IS NOT NULL THEN c.spending_budget_for_jackets_to/e1.exchange_rate
    WHEN e2.exchange_rate IS NOT NULL THEN c.spending_budget_for_jackets_to/e2.exchange_rate
    ELSE c.spending_budget_for_jackets_to
  END as spending_budget_for_jackets_to
FROM raw.customer c
LEFT JOIN raw.customer_survey cs on cs.customer_id = c.customer_id
LEFT JOIN raw.customer_salesforce sal on sal.customer_id = c.customer_id
LEFT JOIN raw.customer_brand_cluster cbc on cbc.customer_id=c.customer_id
LEFT JOIN 
(
  SELECT 
    co.customer_id,
    co.currency_code,
    row_number() over (partition by co.customer_id order by co.order_id) as "rnum"
  FROM raw.customer_order co
) cur on cur.customer_id = c.customer_id AND cur.rnum = 1
LEFT JOIN 
(
  SELECT 
    co.customer_id,
    co.stylist_id,
    row_number() over (partition by co.customer_id order by co.order_id DESC) as "rnum"
  FROM raw.customer_order co
) sty on sty.customer_id = c.customer_id AND sty.rnum = 1
LEFT JOIN 
(
  SELECT 
    co.customer_id,
    f.arvato_score,
    row_number() over (partition by co.customer_id order by f.date_created) as "rnum"
  FROM raw.customer_order co
  JOIN raw.financial_transactions f on f.order_id = co.order_id
) arv on arv.customer_id = c.customer_id AND arv.rnum = 1
LEFT JOIN dwh.historical_exchange_rates e1 on e1.currency_code = cur.currency_code AND e1.date = '2014-06-01'   /* Why this date? Why not. */
LEFT JOIN dwh.historical_exchange_rates e2 on e2.currency_code = c.default_domain AND e2.date = '2014-06-01'


