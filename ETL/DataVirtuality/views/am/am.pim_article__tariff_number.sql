-- Name: am.pim_article__tariff_number
-- Created: 2015-04-24 18:19:20
-- Updated: 2015-04-24 18:19:20

CREATE VIEW am.pim_article__tariff_number AS
SELECT DISTINCT
article.o_id AS "pim_model_id",
color_variation.de_customs_tarff_number AS "tariff_number"
FROM am.object_17 "article"
INNER JOIN am.object_17 "color_variation" ON color_variation.o_parentId = article.o_id
WHERE article.o_type = 'object'
AND color_variation.o_type = 'variant'


