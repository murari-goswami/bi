-- Name: ml.articles_categories
-- Created: 2015-04-24 18:20:02
-- Updated: 2015-04-24 18:20:02

CREATE VIEW ml.articles_categories AS
SELECT
a.article_id,
fc.flat_category,
CAST(fc.outfit_slot = 'belt' AS INTEGER) AS "outfit_slot__belt",
CAST(fc.outfit_slot = 'headwear' AS INTEGER) AS "outfit_slot__headwear",
CAST(fc.outfit_slot = 'jacket' AS INTEGER) AS "outfit_slot__jacket",
CAST(fc.outfit_slot = 'neckwear' AS INTEGER) AS "outfit_slot__neckwear",
CAST(fc.outfit_slot = 'over_shirt' AS INTEGER) AS "outfit_slot__over_shirt",
CAST(fc.outfit_slot = 'shirt' AS INTEGER) AS "outfit_slot__shirt",
CAST(fc.outfit_slot = 'shoes' AS INTEGER) AS "outfit_slot__shoes",
CAST(fc.outfit_slot = 'socks' AS INTEGER) AS "outfit_slot__socks",
CAST(fc.outfit_slot = 'suit' AS INTEGER) AS "outfit_slot__suit",
CAST(fc.outfit_slot = 'tie' AS INTEGER) AS "outfit_slot__tie",
CAST(fc.outfit_slot = 'trousers' AS INTEGER) AS "outfit_slot__trousers",
CAST(fc.outfit_slot = 'underwear' AS INTEGER) AS "outfit_slot__underwear"
FROM
"bi.article" a
LEFT JOIN "ml.amidala_category_flat" acf ON acf.attribute_id = a.article_attribute_id
LEFT JOIN "ml.flat_category" fc ON fc.flat_category = acf.flat_category


