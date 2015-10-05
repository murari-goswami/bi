-- Name: ml.preview_articles
-- Created: 2015-04-24 18:18:59
-- Updated: 2015-04-24 18:18:59

CREATE VIEW ml.preview_articles AS
SELECT
	DISTINCT article_agg.preview_id,
	article_agg.date_created,
	CAST(trim(trailing ',' from replace(to_chars(article_agg.article_blob, 'UTF-8'), unescape('\n'), ',')) AS STRING) AS articles
FROM
(SELECT 
	oa.preview_id,
	oa.date_created,
	TEXTAGG(oa.article_id QUOTE '') OVER (PARTITION BY oa.preview_id) AS article_blob
FROM
(SELECT
	pa.preview_id || '_' || pa.outfit_id AS preview_id,
	p.date_created,
	pa.article_id
FROM raw.previews AS p
INNER JOIN raw.preview_articles AS pa
	ON p.preview_id = pa.preview_id) AS oa) AS article_agg


