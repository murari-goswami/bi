-- Name: ml.customer_articles
-- Created: 2015-04-24 18:19:54
-- Updated: 2015-04-24 18:19:54

CREATE VIEW ml.customer_articles AS
SELECT
	akr.customer_id,
 	CAST(trim(both ',' from replace(to_chars(akr.kept_articles, 'UTF-8'), unescape('\n'), ',')) AS STRING) AS kept_articles,
 	CAST(trim(both ',' from replace(to_chars(akr.returned_articles, 'UTF-8'), unescape('\n'), ',')) AS STRING) AS returned_articles
FROM
(SELECT
    cas.customer_id,
    textagg(CASE WHEN cas.state = 'Kept' THEN cas.article_ids END QUOTE '') as kept_articles,
    textagg(CASE WHEN cas.state = 'Returned' THEN cas.article_ids END QUOTE '') as returned_articles
FROM
(SELECT
	article_agg.customer_id,
	article_agg.state,
 	CAST(trim(trailing ',' from replace(to_chars(article_agg.articles_blob, 'UTF-8'), unescape('\n'), ',')) AS STRING) AS article_ids
 FROM
(SELECT
	ca.customer_id,
	ca.state,
	textagg(ca.article_id QUOTE '') AS articles_blob
FROM
(SELECT
	co.customer_id,
	coa.article_id,
	coa.order_article_state AS state
FROM bi.customer_order AS co
INNER JOIN bi.customer_order_articles AS coa
	ON co.order_id = coa.order_id) AS ca
GROUP BY ca.customer_id, ca.state)
AS article_agg)
AS cas
GROUP BY cas.customer_id)
AS akr
WHERE akr.kept_articles IS NOT NULL OR akr.returned_articles IS NOT NULL
ORDER BY akr.customer_id ASC


