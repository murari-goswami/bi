-- Name: ml.order_position_outfit_articles
-- Created: 2015-04-24 18:19:25
-- Updated: 2015-04-24 18:19:25

CREATE VIEW ml.order_position_outfit_articles AS
SELECT
	agg_outfit.order_position_id,
 	CAST(trim(trailing ',' from replace(to_chars(agg_outfit.cart_blob, 'UTF-8'), unescape('\n'), ',')) AS STRING) AS outfit_articles
 FROM
(SELECT
	coa.order_position_id,
	coa.article_id,
	textagg(coa.article_id QUOTE '') OVER (PARTITION BY coa.outfit_id) AS cart_blob
FROM bi.customer_order_articles AS coa) AS agg_outfit


