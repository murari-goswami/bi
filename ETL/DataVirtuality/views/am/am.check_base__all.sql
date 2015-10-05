-- Name: am.check_base__all
-- Created: 2015-04-28 18:25:53
-- Updated: 2015-04-29 12:17:51

CREATE VIEW "am.check_base__all" AS
SELECT
cb.pim_model_id,
(
cb.has_article_category = 1
AND cb.has_product_group = 1
AND cb.has_pim_model_id = 1
AND cb.has_pieces = 1
AND cb.has_gender = 1
AND cb.has_color_group_code = 1
AND cb.has_brand_erp = 1
AND cb.has_article_name = 1
AND cb.has_size_group_code = 1
)  "has_all"
FROM "am.check_base" cb


