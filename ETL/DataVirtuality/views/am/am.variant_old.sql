-- Name: am.variant_old
-- Created: 2015-04-24 18:22:44
-- Updated: 2015-04-24 18:22:44

CREATE VIEW "am.variant_old" AS
SELECT v.*,
size_map.size_mapped "size",
pics.pics AS "pics"
FROM
(
SELECT
size_variation.o_id AS "pim_size_variation_id",
size_variation.ean AS "ean",
article.pim_model_id AS "pim_model_id",
color_variation.o_id AS "pim_color_variation_id",
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
CASE
WHEN size_variation.eu_length IS NOT NULL THEN TRIM(size_variation.eu_length) || 'x' || TRIM(size_variation.eu_size)
ELSE TRIM(size_variation.eu_size)
END AS "size_raw",
'0010' "color_erp"
FROM am.base "article"
INNER JOIN am.object_17 "color_variation" ON color_variation.o_parentId = article.pim_model_id
INNER JOIN am.object_17 "size_variation" ON size_variation.o_parentId = color_variation.o_id
LEFT JOIN "am.season_pim__season_erp" season ON season.season_pim = color_variation.season
AND color_variation.o_type = 'variant'
AND size_variation.o_type = 'variant'
) "v"
LEFT JOIN "am.size_raw__size_mapped" size_map ON size_map.size_raw = v.size_raw
LEFT JOIN "am.o__pics" pics ON pics.o_id = v.pim_color_variation_id


