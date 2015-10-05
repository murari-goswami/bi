-- Name: ob.outfit_candidate
-- Created: 2015-06-11 14:22:06
-- Updated: 2015-07-14 14:55:16

CREATE VIEW ob.outfit_candidate AS
SELECT DISTINCT
	'order_group__' || coa.outfit_id AS "outfit_candidate_id",
	'order_group' AS "origin",
	coa.outfit_id AS "origin_candidate_id",
	co.stylist_id,
	co.customer_id
FROM "bi.customer_order" co
LEFT JOIN "bi.customer_order_articles" coa
	ON coa.order_id = co.order_id
WHERE co.date_stylist_picked > '2014-01-01'
	AND coa.outfit_id IS NOT NULL
	AND co.order_type != 'First Order Follow-on'
	AND co.order_type != 'Repeat Order Follow-on'


