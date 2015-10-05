-- Name: am.pim_model__size_group_code
-- Created: 2015-04-28 17:49:04
-- Updated: 2015-04-28 17:49:04

CREATE VIEW "am.pim_model__size_group_code" AS
SELECT DISTINCT pim_model_id, size_group_code FROM "am.variant_pre_4" 
WHERE size_group_code IS NOT NULL
GROUP BY pim_model_id, size_group_code


