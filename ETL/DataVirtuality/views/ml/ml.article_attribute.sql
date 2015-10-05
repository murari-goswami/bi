-- Name: ml.article_attribute
-- Created: 2015-04-24 18:18:02
-- Updated: 2015-04-24 18:18:02

CREATE VIEW ml.article_attribute AS
SELECT
aa.article_attributes_id AS article_id,
aa.attribute_id
FROM
postgres.article_attribute AS aa
WHERE aa.attribute_id IN (
	SELECT attribute_id FROM "ml.amidala_category_leaves"
	UNION
	SELECT attribute_id FROM "ml.attribute_season"
	UNION
	SELECT attribute_id FROM "ml.attribute_amidala_age"
	UNION
	SELECT attribute_id FROM "ml.attribute_outfittery_style"
	UNION
	SELECT attribute_id FROM "ml.attribute_push"
)


