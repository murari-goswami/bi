-- Name: ml.project_outfit_candidate
-- Created: 2015-04-24 18:22:07
-- Updated: 2015-04-24 18:22:07

CREATE VIEW ml.project_outfit_candidate AS
SELECT DISTINCT
	'order_group__' || coa.outfit_id AS "outfit_candidate_id",
	'order_group' AS "origin",
	coa.outfit_id AS "origin_candidate_id",
	co.stylist_id,
	co.customer_id
FROM "bi.customer_order" co
LEFT JOIN "bi.customer_order_articles" coa ON coa.order_id = co.order_id
WHERE co.date_stylist_picked > '2014-01-01'
AND coa.outfit_id IS NOT NULL
AND coa.outfit_id IS NOT NULL


