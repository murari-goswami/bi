-- Name: views.customer
-- Created: 2015-04-24 18:19:47
-- Updated: 2015-04-24 18:19:47

CREATE VIEW views.customer
as
SELECT
	c.customer_id,
	c.user_type,
	c.email,
	c.first_name,
	c.last_name,
	null as postfix,
	c.prefix,
	c.profile_id,
	CASE WHEN c.gender = 'Male' THEN 1 ELSE 0 END as salutation,
	c.new_stylist_id as stylist_id,
	c.date_created,
	null as last_login,
	c.token,
	c.facebook_page,
	null as salesforce_id,
	c.referred_by_id,
	c.default_domain as default_page,
	c.national_id,
	f.first_order_date,
	f.first_order_date_completed,
	null as branch_working_in,
	c.date_of_birth,
	c.age_group_felt,
	c.age_group,
	c.height_in_cm,
	c.phone_number,
	null as preferred_brand,
	c.preferred_contact_channel,
	c.preferred_contact_time,
	c.shirt_size,
	c.shoe_size,
	null as trousers_size,
	c.weight_in_kg,
	c.buying_problem_other,
	c.newsletter_accepted,
	null as preferred_brand_other,
	null as spending_budget_for_jeans,
	null as spending_budget_for_shirts,
	null as spending_budget_for_shoes,
	c.occupation as branch_working_in_other,
	c.trousers_size_length,
	c.trousers_size_width,
	null as spending_budget_for_sakkos,
	c.date_created as profile_date_created,
	null as profile_last_updated,
	null as referral,
	c.date_newsletter_confirmed,
	null as preferred_language,
	c.collar_size,
	c.spending_budget_for_shirts_from,
	c.spending_budget_for_shirts_to,
	c.spending_budget_for_jeans_from,
	c.spending_budget_for_jeans_to,
	c.spending_budget_for_shoes_from,
	c.spending_budget_for_shoes_to,
	c.spending_budget_for_jackets_from as spending_budget_for_sakkos_from,
	c.spending_budget_for_jackets_to as spending_budget_for_sakkos_to,
	c.buying_problems,
	null as piclanguage,
	null as picusagereason,
	null as pictypicalbag,
	null as pictypicalshoes,
	null as picclothwork,
	null as picagerange,
	null as pictypicalstyle,
	c.date_first_image_uploaded as customer_image_min_date_created,
	c.date_last_image_uploaded as customer_image_max_last_updated,
	c.image_count as customer_image_image_count,
	c.facebook_image_count as customer_image_facebook_image_count,
	c.other_image_count as customer_image_other_image_count
FROM bi.customer c
LEFT JOIN (
	SELECT 
		co.customer_id,
		min(co.date_created) as first_order_date,
		min(CASE WHEN co.order_state = 'Completed' THEN co.date_created ELSE null END) as first_order_date_completed
	FROM bi.customer_order co 
	GROUP BY co.customer_id
) f on f.customer_id = c.customer_id


