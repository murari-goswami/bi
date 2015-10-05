-- Name: ml.customer_article
-- Created: 2015-04-24 18:20:00
-- Updated: 2015-04-24 18:20:00

CREATE VIEW ml.customer_article AS
SELECT
	co.customer_id,
	coa.article_id,
	coa.order_article_state AS state
FROM bi.customer_order AS co
JOIN bi.customer_order_articles AS coa
	ON co.order_id = coa.order_id
ORDER BY customer_id ASC


