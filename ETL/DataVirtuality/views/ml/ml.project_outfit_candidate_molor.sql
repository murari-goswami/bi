-- Name: ml.project_outfit_candidate_molor
-- Created: 2015-04-24 18:24:18
-- Updated: 2015-04-24 18:24:18

CREATE VIEW ml.project_outfit_candidate_molor AS
SELECT
oc.outfit_candidate_id,
am.molor_id
FROM
"bi.customer_order" co
LEFT JOIN "bi.customer_order_articles" coa ON coa.order_id = co.order_id
LEFT JOIN "ml.project_outfit_candidate" oc ON oc.origin_candidate_id = coa.outfit_id
LEFT JOIN "ml.article_molor" am ON am.article_id = coa.article_id
WHERE co.date_stylist_picked > '2014-01-01'
AND coa.outfit_id IS NOT NULL
AND coa.outfit_id IS NOT NULL
AND am.molor_id IS NOT NULL


