-- Name: am.check_base
-- Created: 2015-04-28 18:19:44
-- Updated: 2015-04-28 18:19:59

CREATE VIEW am.check_base AS
SELECT
b.pim_model_id,
CASE WHEN b.article_category IS NOT NULL THEN 1 ELSE 0 END "has_article_category",
CASE WHEN b.product_group IS NOT NULL THEN 1 ELSE 0 END "has_product_group",
CASE WHEN b.pim_model_id IS NOT NULL THEN 1 ELSE 0 END "has_pim_model_id",
CASE WHEN b.pieces IS NOT NULL THEN 1 ELSE 0 END "has_pieces",
CASE WHEN b.gender IS NOT NULL THEN 1 ELSE 0 END "has_gender",
CASE WHEN b.color_group_code IS NOT NULL THEN 1 ELSE 0 END "has_color_group_code",
CASE WHEN b.brand_erp IS NOT NULL THEN 1 ELSE 0 END "has_brand_erp",
CASE WHEN b.article_name IS NOT NULL THEN 1 ELSE 0 END "has_article_name",
CASE WHEN b.size_group_code IS NOT NULL THEN 1 ELSE 0 END "has_size_group_code"
FROM "am.base" b


