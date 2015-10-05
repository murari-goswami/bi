-- Name: ml.project_outfit_order_group
-- Created: 2015-04-24 18:23:06
-- Updated: 2015-04-24 18:23:06

CREATE VIEW ml.project_outfit_order_group AS
SELECT
coa.outfit_id AS "order_group_id",
am.molor_id
FROM
"bi.customer_order" co
LEFT JOIN "bi.customer_order_articles" coa ON coa.order_id = co.order_id
LEFT JOIN "ml.article_molor" am ON am.article_id = coa.article_id
WHERE co.date_stylist_picked > '2014-01-01'
AND coa.outfit_id IS NOT NULL
AND coa.outfit_id IS NOT NULL
AND am.molor_id IS NOT NULL


