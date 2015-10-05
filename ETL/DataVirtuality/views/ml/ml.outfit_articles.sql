-- Name: ml.outfit_articles
-- Created: 2015-04-24 18:19:54
-- Updated: 2015-04-24 18:19:54

CREATE VIEW ml.outfit_articles AS
SELECT
	DISTINCT article_agg.outfit_id,
	article_agg.date_picked,
 	CAST(trim(trailing ',' from replace(to_chars(article_agg.article_blob, 'UTF-8'), unescape('\n'), ',')) AS STRING) AS articles
 FROM
(SELECT
	coa.outfit_id,
	co.date_stylist_picked AS date_picked,
	TEXTAGG(coa.article_id QUOTE '') OVER (PARTITION BY coa.outfit_id) AS article_blob
FROM bi.customer_order_articles AS coa
INNER JOIN bi.customer_order AS co
	ON coa.order_id = co.order_id) AS article_agg
ORDER BY article_agg.date_picked ASC


