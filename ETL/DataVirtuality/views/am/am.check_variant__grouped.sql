-- Name: am.check_variant__grouped
-- Created: 2015-04-28 18:14:40
-- Updated: 2015-04-29 12:26:34

CREATE VIEW "am.check_variant__grouped" AS
SELECT
pim_model_id,
( x.has_supplier_color_code = 1
AND x.has_size_erp = 1
AND x.has_season_erp = 1
AND x.has_ean = 1
AND x.has_color_code_erp = 1
) "has_all_in_group"
FROM (
SELECT 
pim_model_id,
MIN(c.has_supplier_color_code) "has_supplier_color_code",
MIN(c.has_size_erp) "has_size_erp",
MIN(c.has_season_erp) "has_season_erp",
MIN(c.has_ean) "has_ean",
MIN(c.has_color_code_erp) "has_color_code_erp"
FROM "am.check_variant" c
GROUP BY pim_model_id ) x


