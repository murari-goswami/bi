-- Name: ml.article_catbra
-- Created: 2015-04-24 18:19:59
-- Updated: 2015-04-24 18:19:59

CREATE VIEW ml.article_catbra AS
SELECT
	a.article_id,
	a.article_brand AS brand,
	fc.flat_category,
	CASE WHEN fc.flat_category IS NOT NULL AND a.article_brand IS NOT NULL
		 THEN fc.flat_category || '_' || a.article_brand ELSE a.article_id END AS catbra
FROM bi.article AS a 
LEFT JOIN ml.amidala_category_flat acf 
	ON acf.attribute_id = a.article_attribute_id
LEFT JOIN ml.flat_category fc 
	ON fc.flat_category = acf.flat_category


