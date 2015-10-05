-- Name: ob.outfit_candidate__molor
-- Created: 2015-06-11 18:38:08
-- Updated: 2015-06-19 11:41:32

CREATE VIEW ob.outfit_candidate__molor AS
SELECT DISTINCT
	oc.outfit_candidate_id,
	am.molor_id
FROM "bi.customer_order" co
LEFT JOIN "bi.customer_order_articles" AS coa
	ON coa.order_id = co.order_id
LEFT JOIN "ob.outfit_candidate" AS oc
	ON oc.origin_candidate_id = coa.outfit_id
INNER JOIN "ob.article__molor" AS am
	ON am.article_id = coa.article_id
LEFT JOIN "bi.item" AS item
	ON item.article_id = am.article_id
WHERE co.date_stylist_picked > '2014-01-01'
  AND coa.outfit_id IS NOT NULL
  AND am.molor_id IS NOT NULL
ORDER BY oc.outfit_candidate_id


