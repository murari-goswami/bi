-- Name: am.variant_pre_4
-- Created: 2015-04-24 18:27:08
-- Updated: 2015-05-20 15:56:05

CREATE VIEW "am.variant_pre_4" AS
SELECT
v.*,
colormap.color_code_erp "color_code_erp"
FROM "am.variant_pre_3" v
LEFT JOIN "am.color_mapping_new" colormap ON colormap.color1 = v.color1


