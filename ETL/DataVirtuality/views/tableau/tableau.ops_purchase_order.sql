-- Name: tableau.ops_purchase_order
-- Created: 2015-07-07 11:18:36
-- Updated: 2015-07-07 15:13:36

CREATE VIEW tableau.ops_purchase_order
AS

SELECT 
	pop.purchase_order_id, 
	pop.fulfilled_quantity, 
	pop.quantity, 
	pop.order_position_id,
	sa.ean,
	it.item_description,
	it.color,
	it.category,
	it.size,
	it.pic1,
	it.has_picture
FROM postgres.purchase_order_position pop 
LEFT JOIN postgres.supplier_article sa ON sa.article_id = pop.article_id
LEFT JOIN bi.item it on it.ean=sa.ean
WHERE sa.supplier_id = 15


