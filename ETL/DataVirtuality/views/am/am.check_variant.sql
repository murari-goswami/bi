-- Name: am.check_variant
-- Created: 2015-04-28 18:05:47
-- Updated: 2015-04-28 18:07:10

CREATE VIEW am.check_variant AS
SELECT
v.pim_model_id,
v.pim_size_variation_id,
v.pim_color_variation_id,
CASE WHEN v.supplier_color_code IS NOT NULL THEN 1 ELSE 0 END "has_supplier_color_code",
CASE WHEN v.size_erp IS NOT NULL THEN 1 ELSE 0 END "has_size_erp",
CASE WHEN v.season_erp IS NOT NULL THEN 1 ELSE 0 END "has_season_erp",
CASE WHEN v.ean IS NOT NULL THEN 1 ELSE 0 END "has_ean",
CASE WHEN v.color_code_erp IS NOT NULL THEN 1 ELSE 0 END "has_color_code_erp"
FROM
"am.variant_pre_4" v


