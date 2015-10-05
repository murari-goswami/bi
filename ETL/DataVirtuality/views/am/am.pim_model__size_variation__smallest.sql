-- Name: am.pim_model__size_variation__smallest
-- Created: 2015-04-24 18:19:21
-- Updated: 2015-04-24 18:19:21

CREATE VIEW am.pim_model__size_variation__smallest AS
SELECT
article.o_id "pim_model_id",
size_variation.o_id "pim_size_variation_id"
FROM am.object_17 "article"
INNER JOIN am.object_17 "color_variation" ON color_variation.o_parentId = article.o_id
LEFT JOIN am.object_17 "color_variation_bigger" ON color_variation_bigger.o_parentId = article.o_id AND color_variation_bigger.o_id > color_variation.o_id
INNER JOIN am.object_17 "size_variation" ON size_variation.o_parentId = color_variation.o_id
LEFT JOIN am.object_17 "size_variation_bigger" ON size_variation_bigger.o_parentId = color_variation.o_id AND size_variation_bigger.o_id > size_variation.o_id
WHERE color_variation_bigger.o_id IS NULL
AND size_variation_bigger.o_id IS NULL


