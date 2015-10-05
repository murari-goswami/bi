-- Name: views.purchase_order_position_outfittery_stock
-- Created: 2015-04-24 18:17:09
-- Updated: 2015-04-24 18:17:09

CREATE view views.purchase_order_position_outfittery_stock 
AS 
SELECT 
	op.article_id AS "op_article_id",
	x.quantity_good  AS "op_fulfilled_quantity",
	SUM(op.initial_quantity) AS "op_initial_quantity",
	AVG(op.retail_price) AS "op_retail_price",
	AVG(op.purchase_price) AS "op_purchase_price",
	SUM(op.quantity) AS "op_quantity",
	MIN(op.date_created) AS "op_min_date_created",
	MAX(op.date_created) AS "op_max_date_created",
	MIN(po.date_created) AS"po_min_date_created",
	MAX(po.date_created) AS"po_max_date_created",
	CAST(MIN(min_delivery_date_table.date_first_delivery) AS date) AS "date_min_first_delivery"
FROM postgres.purchase_order_position op    
INNER JOIN  postgres.purchase_order po ON op.purchase_order_id=po.id    
LEFT JOIN
(
	SELECT 
		CAST(customer_article_number AS biginteger) AS article_id,
		CAST(po_number AS biginteger) AS purchase_order_id,
		MIN(doc_data_stock_mutation.date_created) AS date_first_delivery 
	FROM postgres.doc_data_stock_mutation 
	INNER JOIN postgres.purchase_order ON CAST(purchase_order.id AS STRING) = doc_data_stock_mutation.po_number
	WHERE stock_location_id=2 AND booking_code=1 
	GROUP BY 1,2
)min_delivery_date_table ON min_delivery_date_table.article_id =op.article_id AND op.purchase_order_id = min_delivery_date_table.purchase_order_id
LEFT JOIN
(
	SELECT 
		customer_article_number,
		SUM(CAST(quantity_good AS integer)) AS quantity_good 
	FROM postgres.doc_data_stock_mutation sm 
	WHERE 
	po_number in 
	(
		SELECT 
			CAST(id AS STRING) 
		FROM postgres.purchase_order 
		WHERE stock_location_id=2 
	)
	GROUP BY 1
)x ON x.customer_article_number=op.article_id
WHERE stock_location_id=2
GROUP BY 1,2


