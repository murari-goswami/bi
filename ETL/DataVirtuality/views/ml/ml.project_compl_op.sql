-- Name: ml.project_compl_op
-- Created: 2015-04-24 18:19:52
-- Updated: 2015-04-24 18:19:52

CREATE VIEW ml.project_compl_op AS
SELECT
	coa.order_position_id,
	ai.article_id,
    ai.model AS model_id,
    ai.molor,
    ai.brand_amidala,
    ai.c1,
    ai.c2,
    ai.c3,
    cat.flat_category,
    coa.outfit_id,
	CASE WHEN coa.articles_kept > 0 THEN 1
	     WHEN coa.articles_returned > 0 THEN -1
		 ELSE NULL
		 END AS rating,
    coa.articles_kept,
    coa.articles_returned,
    co.order_id,
    co.billing_total,
    co.customer_id,
	co.date_stylist_picked,
	co.date_created,
	co.date_completed,
	co.parent_order_id IS NOT NULL AS has_parent_order,
	op_outfit.outfit_articles,
	customer.spending_budget_for_jeans_from,
	customer.spending_budget_for_jeans_to,
	customer.spending_budget_for_shoes_from,
	customer.spending_budget_for_shoes_to,
	customer.spending_budget_for_shirts_from,
	customer.spending_budget_for_shirts_to,
	customer.spending_budget_for_jackets_from,
	customer.spending_budget_for_jackets_to,
	survey.is_new_survey,
	survey.typical_style__classic,
    survey.typical_style__country,
    survey.typical_style__adventure,
    survey.typical_style__dark_denim,
    survey.typical_style__sporty,
    survey.typical_style__smart_casual,
    survey.typical_style__prints,
    survey.typical_style__excentric,
    survey.age_felt__18_30,
    survey.age_felt__31_35,
    survey.age_felt__36_45,
    survey.age_felt__46_55,
    survey.work_style__suit,
    survey.work_style__smart_casual,
    survey.work_style__casual,
    survey.work_style__relaxed,
    survey.colors_liked__natural,
    survey.colors_liked__denim,
    survey.colors_liked__classic,
    survey.colors_liked__strong,
    survey.typical_shoes__sneakers,
    survey.typical_shoes__boat_shoes,
    survey.typical_shoes__boots,
    survey.typical_shoes__classic_trendy,
    survey.typical_shoes__desert_boots,
    survey.typical_shoes__sneakers_casual,
    survey.typical_shoes__chelsea_boots,
    survey.typical_shoes__classic_business,
    survey.typical_shoes__chucks,
    survey.typical_shoes__sneakers_trendy,
    survey.typical_shoes__timberland_boots,
    survey.would_never_wear__biglogo,
    survey.would_never_wear__checkered,
    survey.would_never_wear__button_down_shirt,
    survey.would_never_wear__pink_shirt,
    survey.would_never_wear__tommy_hilfiger,
    survey.would_never_wear__print_tshirts,
    survey.would_never_wear__polo_shirt,
    survey.brands_liked__scotch_soda,
    survey.brands_liked__levis,
    survey.brands_liked__tiger,
    survey.brands_liked__bugatti,
    survey.brands_liked__gstar,
    survey.brands_liked__gant,
    survey.brands_liked__selected,
    survey.brands_liked__jack_jones,
    survey.brands_liked__strellson,
    survey.brands_liked__tommy,
    survey.brands_liked__ralphlauren,
    survey.brands_liked__marcopolo,
    survey.underwear_style__boxers,
    survey.underwear_style__trunks,
    survey.underwear_style__briefs,
	ml_response.ml_response_id
FROM bi.customer_order_articles AS coa
JOIN bi.customer_order AS co
	ON co.order_id = coa.order_id
JOIN ml.order_position_outfit_articles AS op_outfit
	ON op_outfit.order_position_id = coa.order_position_id
JOIN raw.customer AS customer
	ON customer.customer_id = co.customer_id
JOIN ml.customer_survey AS survey
	ON survey.customer_id = customer.customer_id
LEFT JOIN ml.order_position_ml_response AS ml_response
	ON coa.order_position_id = ml_response.order_position_id
JOIN ml.article_category_new AS cat
    ON coa.article_id = cat.article_id
JOIN ml.article_info AS ai
    ON coa.article_id = ai.article_id


