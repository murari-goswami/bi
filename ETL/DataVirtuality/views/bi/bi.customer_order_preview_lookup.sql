-- Name: bi.customer_order_preview_lookup
-- Created: 2015-04-24 18:18:55
-- Updated: 2015-04-24 18:18:55

CREATE VIEW bi.customer_order_preview_lookup
AS
/* This view matches preview articles to customer order articles to show whether preview 
articles were actually sent in an order. It's done with a few subqueries to make sure
that we don't create duplicates. Basically the data isn't perfect here, so this gives a 
best guess */

/* Third, select only the last order_position_id for a given customer_preview_position_id*/
SELECT
	MAX(x.order_position_id) as order_position_id,
	x.customer_preview_position_id
FROM 
(
	/* Second, select only one instance of a customer_preview_position_id per order_position_id */
	SELECT
		pr.order_position_id,
		pr.customer_preview_position_id
	FROM
	(
		/* First match order_positions to customer_preview_positions on article_model_id */
		SELECT 
			coa.order_position_id, 
			p.customer_preview_position_id,
			row_number() over (partition by coa.order_position_id order by p.customer_preview_position_id) as "rnum"
		FROM raw.customer_order_articles coa
		JOIN raw.customer_order co ON co.order_id = coa.order_id
		JOIN views.article a on a.article_id = coa.article_id 
		JOIN raw.customer_preview_articles p on p.customer_preview_id = co.customer_preview_id AND p.article_model_id = a.article_model_id
	) pr 
	WHERE pr.rnum = 1
) x
GROUP BY x.customer_preview_position_id


