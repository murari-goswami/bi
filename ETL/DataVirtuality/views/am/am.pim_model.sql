-- Name: am.pim_model
-- Created: 2015-04-24 18:19:20
-- Updated: 2015-04-24 18:19:20

CREATE VIEW am.pim_model AS
SELECT DISTINCT
article.o_id AS "pim_model_id"
FROM am.object_17 "article"
INNER JOIN am.object_17 "color_variation" ON color_variation.o_parentId = article.o_id
INNER JOIN am.object_17 "size_variation" ON size_variation.o_parentId = color_variation.o_id
WHERE article.o_type = 'object'
AND color_variation.o_type='variant'
AND size_variation.o_type = 'variant'


