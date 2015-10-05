-- Name: tableau.data_source_incoming_purchase_orders
-- Created: 2015-06-22 13:55:12
-- Updated: 2015-07-30 14:47:16

CREATE VIEW tableau.data_source_incoming_purchase_orders AS

SELECT 
	poa.poa_id AS id, 
	poa.article_id, 
	poa.purchase_order_id, 
	poa.date_poa_created AS date_created,
	poa.stock_ordered_initially AS initial_quantity,
	poa.stock_ordered_revised AS quantity, 
	poa.stock_booked AS fulfilled_quantity,
	poa.stock_scanned,
	poa.poa_supplier_order_number AS supplier_order_number, 
	poa.date_poa_cancelled AS date_canceled, 
	poa.date_poa_fulfilled AS date_fulfilled,
	poa.order_position_id, 
	poa.poa_state_number AS state, 
	poa.article_sales_price AS retail_price, 
	poa.article_cost AS purchase_price,
	poa.poa_position_number AS purchase_order_positions_idx, 
	poa.date_poa_delivery_earliest AS earliest_delivery_date, 
	poa.date_poa_delivery_latest AS latest_delivery_date,
	po.po_season as "purchase_order_season",
	po.po_order_type AS order_type,
	i.ean,
	i.size,
	i.brand,
	i.item_description,
	i.category,
	i.product_group,
	i.item_no,
	i.item_status,
	i.parent_no,
	i.supplier_color,
	i.season,
	i.color,
	i.vendor_item_no,
	i.pic1,
	i.pool
FROM
	bi.purchase_order AS po
	JOIN
	bi.purchase_order_articles AS poa
		ON po.purchase_order_id = poa.purchase_order_id
	LEFT JOIN
	bi.item i
		ON poa.article_id = i.article_id
WHERE
	driving_tbl_poa IS NOT NULL

/*  limit 100 */


