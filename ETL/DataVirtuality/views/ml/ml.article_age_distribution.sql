-- Name: ml.article_age_distribution
-- Created: 2015-04-24 18:23:47
-- Updated: 2015-04-24 18:23:47

CREATE VIEW ml.article_age_distribution AS
SELECT 
	am.article_id,
    f.molor_mean_age,
    f.molor_stddev_age,
    f.model_mean_age,
    f.model_stddev_age,
    f.brand_mean_age,
    f.brand_stddev_age
FROM
(SELECT
    p.molor_id,
    AVG(p.customer_age) OVER (PARTITION BY p.molor_id) AS molor_mean_age,
    STDDEV_SAMP(p.customer_age) OVER (PARTITION BY p.molor_id) AS molor_stddev_age,
    AVG(p.customer_age) OVER (PARTITION BY p.model_id) AS model_mean_age,
    STDDEV_SAMP(p.customer_age) OVER (PARTITION BY p.model_id) AS model_stddev_age,
    AVG(p.customer_age) OVER (PARTITION BY p.brand) AS brand_mean_age,
    STDDEV_SAMP(p.customer_age) OVER (PARTITION BY p.brand) AS brand_stddev_age,
	ROW_NUMBER() OVER (PARTITION BY p.molor_id ORDER BY p.molor_id DESC) AS rn
FROM
(SELECT
	a.article_id,
    m.molor_id,
    c.customer_age,
    a.article_brand AS brand,
    a.article_model_id AS model_id
FROM bi.article AS a
LEFT JOIN bi.customer_order_articles AS coa
	ON a.article_id = coa.article_id
LEFT JOIN bi.customer_order AS co
	ON coa.order_id = co.order_id
LEFT JOIN bi.customer AS c
	ON co.customer_id = c.customer_id
LEFT JOIN ml.article_molor AS m
	ON m.article_id = a.article_id
WHERE coa.articles_kept > 0) AS p) AS f
JOIN ml.article_molor AS am
	ON am.molor_id = f.molor_id
WHERE f.rn = 1


