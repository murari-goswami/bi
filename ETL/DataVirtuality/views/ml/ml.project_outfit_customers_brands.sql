-- Name: ml.project_outfit_customers_brands
-- Created: 2015-04-24 18:20:07
-- Updated: 2015-04-24 18:20:07

CREATE VIEW ml.project_outfit_customers_brands AS
SELECT 
	co.customer_id,
	coa.article_id,
	a.article_brand
FROM bi.customer_order AS co
INNER JOIN bi.customer_order_articles AS coa
	ON co.order_id = coa.order_id
INNER JOIN bi.article AS a
	ON coa.article_id = a.article_id
WHERE order_article_state = 'Kept'


