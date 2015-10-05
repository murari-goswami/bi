-- Name: ml.article_brand_properties
-- Created: 2015-04-24 18:20:01
-- Updated: 2015-04-24 18:20:01

CREATE VIEW ml.article_brand_properties AS
SELECT DISTINCT
	a.article_id,
	bp.brand_over_40,
	bp.brand_under_40,
	bp.price_high,
	bp.price_medium,
	bp.price_low
FROM
bi.article AS a
LEFT JOIN ml.flat_brand_bi_brand AS br
	ON br.bi_brand = a.article_brand
LEFT JOIN ml.flat_brand_properties AS bp
	ON bp.flat_brand = br.flat_brand


