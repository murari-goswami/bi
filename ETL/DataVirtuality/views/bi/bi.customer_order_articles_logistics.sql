-- Name: bi.customer_order_articles_logistics
-- Created: 2015-04-24 18:19:17
-- Updated: 2015-05-27 22:45:28

CREATE VIEW bi.customer_order_articles_logistics AS

SELECT * FROM raw.customer_order_articles_logistics_3mo 
UNION ALL
SELECT * FROM raw.customer_order_articles_logistics_before_3mo


