-- Name: ml.project_outfit_types
-- Created: 2015-04-24 18:19:35
-- Updated: 2015-04-24 18:19:35

CREATE VIEW ml.project_outfit_types AS
SELECT
coa.order_id,
coa.article_id,
coa.outfit_id,
ac.flat_category
FROM "raw.customer_order_articles" coa
JOIN "ml.article_category_new" ac ON coa.article_id = ac.article_id
WHERE coa.date_shipped > '2013-10-01' AND coa.date_shipped < '2014-10-01'


