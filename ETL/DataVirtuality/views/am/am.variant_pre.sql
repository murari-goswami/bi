-- Name: am.variant_pre
-- Created: 2015-04-28 17:57:00
-- Updated: 2015-04-28 17:57:00

CREATE VIEW "am.variant_pre" AS
SELECT
size_variation.o_id AS "pim_size_variation_id",
size_variation.ean AS "ean",
article.pim_model_id AS "pim_model_id",
color_variation.o_id AS "pim_color_variation_id",
article.brand_pim "brand_pim",
article.commodity_group4 "commodity_group4",
season.season_pim,
season.season_erp,
size_variation.net_weight_gram AS "weight_net",
size_variation.gross_weight_gram AS "weight_gross",
CAST (size_variation.purchase_price AS BIGDECIMAL) AS "purchase_price",
CAST (size_variation.price_retail_de AS BIGDECIMAL) AS "retail_price_de",
CAST (size_variation.price_retail_chf AS BIGDECIMAL) AS "retail_price_ch",
CAST (size_variation.price_retail_dkk AS BIGDECIMAL) AS "retail_price_dk",
CAST (size_variation.price_retail_sek AS BIGDECIMAL) AS "retail_price_se",
CAST (size_variation.price_retail_benelux AS BIGDECIMAL) AS "retail_price_lu",
CAST (size_variation.price_retail_benelux AS BIGDECIMAL) AS "retail_price_nl",
CAST (size_variation.price_retail_benelux AS BIGDECIMAL) AS "retail_price_be",
TRIM(size_variation.eu_size) AS "eu_size",
CASE
WHEN size_variation.eu_length IS NOT NULL THEN TRIM(size_variation.eu_size) || 'x' || TRIM(size_variation.eu_length)
ELSE NULL
END AS "eu_size_x_length",
CASE WHEN color_variation.supplier_color_code IS NULL THEN 'None' ELSE TRIM(color_variation.supplier_color_code) END AS "supplier_color_code",
CASE WHEN color_variation.color1 IS NULL THEN 'None' ELSE TRIM(color_variation.color1) END AS "color1"
FROM am.base_pre "article"
INNER JOIN am.object_17 "color_variation" ON color_variation.o_parentId = article.pim_model_id
INNER JOIN am.object_17 "size_variation" ON size_variation.o_parentId = color_variation.o_id
LEFT JOIN "am.season_pim__season_erp" season ON season.season_pim = color_variation.season
AND color_variation.o_type = 'variant'
AND size_variation.o_type = 'variant'


