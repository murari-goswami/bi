-- Name: am.variant_pre_5
-- Created: 2015-04-29 09:32:32
-- Updated: 2015-05-20 14:13:49

CREATE VIEW "am.variant_pre_5" AS
SELECT
v.*,
CASE
WHEN o.age = 'all' THEN 'ALL'
WHEN o.age = 'over_40' THEN 'OVER40'
WHEN o.age = 'under_40' THEN 'UNDER40'
ELSE NULL
END AS "age",
CASE
WHEN o_color_variation.amidala_deactive THEN 'STOP'
WHEN o_color_variation.push = 1 THEN 'PUSH'
ELSE 'FREE' END "state_erp",
pics.pics "pics"
FROM "am.variant_pre_4" v
LEFT JOIN "am.object_17" o_color_variation ON o_color_variation.o_id = v.pim_color_variation_id
LEFT JOIN "am.object_17" o ON o.o_id = v.pim_model_id
LEFT JOIN "am.o__pics" pics ON pics.o_id = o_color_variation.o_id


