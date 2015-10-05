-- Name: ml.project_outfit_articles
-- Created: 2015-04-24 18:19:57
-- Updated: 2015-04-24 18:19:57

CREATE VIEW ml.project_outfit_articles AS
SELECT
coa.outfit_id,
coa.article_id,
a.article_model_id,
a.article_model_id || '_' || a.article_color AS "molor",
a.article_color,
a.article_brand,
fc.flat_category,
fc.outfit_slot
FROM
"bi.customer_order_articles" coa
LEFT JOIN "bi.customer_order" co ON coa.order_id = co.order_id
LEFT JOIN "bi.article" a ON a.article_id = coa.article_id
LEFT JOIN "ml.amidala_category_flat" acf ON acf.attribute_id = a.article_attribute_id
LEFT JOIN "ml.flat_category" fc ON fc.flat_category = acf.flat_category
WHERE coa.date_created > '2014-01-01'


