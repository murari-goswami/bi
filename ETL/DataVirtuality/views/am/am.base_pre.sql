-- Name: am.base_pre
-- Created: 2015-04-28 19:01:10
-- Updated: 2015-05-20 18:50:51

CREATE VIEW "am.base_pre" AS
SELECT
o.o_id AS "pim_model_id",
o.article_name AS "article_name",
o.brand AS "brand_pim",
brand."brand_erp" AS "brand_erp",
o.commodity_group4 AS "commodity_group4",
o.commodity_group5 AS "commodity_group5",
cga."article_category" AS "article_category",
cga."product_group" AS "product_group",
'MEN' AS "gender",
'STANDARD' AS "color_group_code",
CASE WHEN piece.pieces_erp IS NOT NULL THEN piece.pieces_erp
ELSE 'PC' END "pieces",
ptn.tariff_number,
ptn.tariff_is_constant,
bbc.blacklisted_countries,
o_smallest_size.country_of_production "country_of_production",
bpc.creditor "creditor",
o.supplier_sku "supplier_sku",
CASE
WHEN o.age = 'all' THEN 'ALL'
WHEN o.age = 'over_40' THEN 'OVER40'
WHEN o.age = 'under_40' THEN 'UNDER40'
ELSE NULL
END AS "age"
FROM "am.pim_model" pm
LEFT JOIN "am.object_17" o ON o.o_id = pm.pim_model_id
LEFT JOIN "am.brand_pim__brand_erp" brand ON brand."brand_pim" = o.brand
LEFT JOIN "am.cg5__article_group" cga ON cga.commodity_group5 = o.commodity_group5
LEFT JOIN "am.unit_pim__pieces_erp" piece ON piece.unit_pim = o.basic_unit
LEFT JOIN "am.pim_article__tariff_number_indexed" ptn ON ptn.pim_model_id = o.o_id
LEFT JOIN "am.brand_pim__blacklisted_countries" bbc ON bbc.brand_pim = o.brand
LEFT JOIN "am.pim_model__size_variation__smallest" pmsv ON pmsv.pim_model_id = pm.pim_model_id
LEFT JOIN "am.object_17" o_smallest_size ON o_smallest_size.o_id = pmsv.pim_size_variation_id
LEFT JOIN "am.brand_pim__creditor" bpc ON bpc.brand_pim = o.brand
WHERE o.brand != 'outfittery'
AND o.brand != 'nudie_jeans'
AND o.brand != 'vip'


