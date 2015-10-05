-- Name: tableau.buying_incoming_purchase_orders
-- Created: 2015-04-24 18:22:43
-- Updated: 2015-04-24 18:22:43

CREATE VIEW tableau.buying_incoming_purchase_orders AS

select 
	pop.id, 
	pop.article_id, 
	pop.purchase_order_id, 
	pop.date_created, 
	pop.fulfilled_quantity, 
	pop.quantity, 
	pop.supplier_order_number, 
	pop.date_canceled, 
	pop.date_fulfilled, 
	pop.order_position_id, 
	pop.state, 
	pop.initial_quantity, 
	pop.retail_price, 
	pop.purchase_price,
	pop.purchase_order_positions_idx, 
	pop.earliest_delivery_date, 
	pop.latest_delivery_date, 
	pop.ean, 
	pop.article_name, 
	pop.eu_size,
	pop.eu_length, 
	pop.pic1, 
	osa.supplier_color_code,
	osa.supplier_color_name,
	osa.brand, 
	osa.commodity_group4,
	osa.commodity_group5,
	osa.supplier_sku, 
	osa.alternative_supplier_sku, 
	osa.o_parentid,
	osa.nos,
	osa.article_size,
	po.season as "purchase_order_season",
	po.order_typ,
	pim.buyer, 
	pim.country_of_origin, 
	pim.season, 	
	poa.stock_scanned
FROM views.purchase_order_position pop
LEFT JOIN views.purchase_order po on po.id = pop.purchase_order_id
INNER JOIN views.ownstock_article osa on pop.ean = osa.ean
LEFT JOIN views.pim_article pim on pim.ean=pop.ean
LEFT JOIN
	bi.purchase_order_articles poa
		 ON pop.id = poa.poa_id
		AND poa.driving_tbl_poa IS NOT NULL



/* THIS WAS REPLACEMENT CODE (THOUGH STILL ISSUES DUE TO INNER JOIN TO OWNSTOCK_ARTICLE)
PLUS ISSUES WITH DATA EXTRACT IN TABLEAU FOR o_parentid; SINCE THIS WILL BE REPLACED
WITH ERP, DECIDED JUST DOING SIMPLE MODIFICATION TO EXISTING QUERY MUCH EASIER AND FASTER*/

/*
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
	po.po_order_type AS order_typ,
	a.article_ean AS ean,
	a.article_name,
	a.article_eu_size AS eu_size,
	a.article_eu_length AS eu_length,
	a.article_pic1 AS pic1,
	a.article_buyer AS buyer,
	a.article_country_of_origin AS country_of_origin,
	a.article_season AS season,
	a.article_supplier_color_code AS supplier_color_code,
	a.article_supplier_color_name AS supplier_color_name,
	a.article_brand AS brand, 
	a.article_commodity_group4 AS commodity_group4,
	a.article_commodity_group5 AS commodity_group5,
	a.article_supplier_sku AS supplier_sku, 
	a.article_supplier_alternative_sku AS alternative_supplier_sku, 
	a.article_o_parent_id AS o_parentid,
	a.article_nos AS nos,
	a.article_size
FROM
	bi.purchase_order AS po
	JOIN
	bi.purchase_order_articles AS poa
		ON po.purchase_order_id = poa.purchase_order_id
	LEFT JOIN
	bi.article a
		ON poa.article_id = a.article_id
WHERE
	driving_tbl_poa IS NOT NULL
*/


