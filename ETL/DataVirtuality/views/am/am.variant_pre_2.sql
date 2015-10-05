-- Name: am.variant_pre_2
-- Created: 2015-04-24 18:25:30
-- Updated: 2015-04-29 18:33:14

CREATE VIEW "am.variant_pre_2" AS
SELECT
smcbs."Size Group Code" AS "size_group_code_smcbs",
smcbs."size_code" AS "size_erp_smcbs",
smcs."Size Group Code" AS "size_group_code_smcs",
smcs."size_code" AS "size_erp_smcs",
smcsl."Size Group Code" AS "size_group_code_smcsl",
smcsl."size_code" AS "size_erp_smcsl",
v.*
FROM "am.variant_pre_1" v
LEFT JOIN "am.size_mapping_new_with_code__indexed_cg4_brand_size" smcbs
ON smcbs.commodity_group4 = v.commodity_group4 
AND smcbs.brand = v.brand_pim
AND smcbs.eu_size = v.eu_size_normed
LEFT JOIN "am.size_mapping_new_with_code__indexed_cg4_size" smcs
ON smcs.commodity_group4 = v.commodity_group4
AND smcs.eu_size = v.eu_size_normed
LEFT JOIN "am.size_mapping_new_with_code__indexed_cg4_sizelength" smcsl
ON smcsl.commodity_group4 = v.commodity_group4
AND smcsl.eu_size_x_length = v.eu_size_x_length_normed


