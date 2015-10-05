-- Name: ml.project_outfit_article_info
-- Created: 2015-04-24 18:19:53
-- Updated: 2015-04-24 18:19:53

CREATE VIEW ml.project_outfit_article_info AS
SELECT
	a.article_id,
	a.article_brand AS brand,
	a.article_sales_price_de AS price,
	a.article_image_url
FROM bi.article AS a
WHERE a.article_image_url IS NOT NULL


