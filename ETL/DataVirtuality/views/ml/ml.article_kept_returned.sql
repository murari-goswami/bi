-- Name: ml.article_kept_returned
-- Created: 2015-04-24 18:23:11
-- Updated: 2015-04-24 18:23:11

CREATE VIEW ml.article_kept_returned AS
SELECT
	am.article_id,
	COALESCE(kept, 0) AS article_kept,
	COALESCE(returned, 0) AS article_returned,
	COALESCE(SUM(am.kept) OVER (PARTITION BY am.molor_id), 0) AS molor_kept,
	COALESCE(SUM(am.returned) OVER (PARTITION BY am.molor_id), 0) AS molor_returned,
	COALESCE(SUM(am.kept) OVER (PARTITION BY am.model_id), 0) AS model_kept,
	COALESCE(SUM(am.returned) OVER (PARTITION BY am.model_id), 0) AS model_returned,
	COALESCE(SUM(am.kept) OVER (PARTITION BY am.catbra), 0) AS catbra_kept,
	COALESCE(SUM(am.returned) OVER (PARTITION BY am.catbra), 0) AS catbra_returned,
	COALESCE(SUM(am.kept) OVER (PARTITION BY am.brand), 0) AS brand_kept,
	COALESCE(SUM(am.returned) OVER (PARTITION BY am.brand), 0) AS brand_returned,
	COALESCE(SUM(am.kept) OVER (PARTITION BY am.flat_category), 0) AS flat_category_kept,
	COALESCE(SUM(am.returned) OVER (PARTITION BY am.flat_category), 0) AS flat_category_returned
FROM
(SELECT
	akr.article_id,
	m.molor_id,
	a.article_model_id AS model_id,
	acb.catbra AS catbra,
	a.article_brand AS brand,
	ac.flat_category,
	akr.kept,
	akr.returned
FROM
(SELECT
	coa.article_id AS article_id,
	SUM(CASE
		WHEN coa.order_article_state = 'Returned' THEN 1
		WHEN coa.order_article_state = 'Kept' THEN 0 END) AS returned,
	SUM(CASE
		WHEN coa.order_article_state = 'Kept' THEN 1
		WHEN coa.order_article_state = 'Returned' THEN 0 END) AS kept
	FROM bi.customer_order_articles AS coa
GROUP BY coa.article_id) AS akr
JOIN bi.article AS a
	ON a.article_id = akr.article_id
LEFT JOIN ml.article_molor AS m
	ON akr.article_id = m.article_id
LEFT JOIN ml.articles_categories AS ac
	ON akr.article_id = ac.article_id
LEFT JOIN ml.article_catbra AS acb
	ON akr.article_id = acb.article_id) AS am
ORDER BY article_id ASC
LIMIT 2000000


