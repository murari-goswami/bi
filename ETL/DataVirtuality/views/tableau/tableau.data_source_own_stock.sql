-- Name: tableau.data_source_own_stock
-- Created: 2015-05-19 14:20:23
-- Updated: 2015-07-19 13:37:52

CREATE VIEW tableau.data_source_own_stock AS

/* 	This is the 3rd iteration to replace tableau.data_source_own_stock2; it's intended to provide base measures and article info;
	final, post-kpi unification calculations (%'s) happen in the tableau data source 
*/

SELECT 
	own.*,
	
	item.item_no,
	item.variant_code,
	item.supplier_article_id,
	/* LIMIT 100 */
	item.parent_no,
	item.ean,
	item.vendor_item_no,
	item.item_description,
	item.category,
	item.product_group,
	item.item_status,
	CASE
		WHEN item.countries_blocked IS NULL THEN 'not blacklisted'
		ELSE item.countries_blocked
	END AS countries_blocked,
	item.item_status_purchase,
	item.item_status_purchase_description,
	item.net_weight,
	item.gross_weight,
	item.unit_of_measure,
	item.country_region_of_origin,
	item.tariff_no,
	item.tariff_no_ch,
	item.color,
	item.supplier_color,
	item.size,
	/* item.size_component_group, */
	item.season,
	item.brand,
	item.has_picture,
	item.pic1,
	/* item.pic2,
	item.pic3,
	item.pic4,
	item.pic5,
	item.pic6, */
	item.unit_cost,
	item.unit_price_be,
	item.unit_price_ch,
	item.unit_price_de,
	item.unit_price_dk,
	/*
	item.unit_price_fi,
	item.unit_price_gb, */
	item.unit_price_lu,
	item.unit_price_nl,
	/*item.unit_price_pl, */
	item.unit_price_se,
	item.pool,
	item.buyer,
	/* the following are actually at the item_no level, not the article_id level */
	book.date_po_received_min,
	book.date_po_received_max,
	CAST(TIMESTAMPDIFF(SQL_TSI_DAY,book.date_po_received_min,CURDATE()) AS SMALLINT) AS days_since_first_received_into_inventory,
	CAST(TIMESTAMPDIFF(SQL_TSI_DAY,book.date_po_received_min, book.date_po_received_max) AS SMALLINT) AS days_in_inventory
FROM 
	bi.own_stock AS own
	LEFT JOIN
	bi.item
		 ON own.article_id = item.article_id
	LEFT JOIN
	bi.po_received_dates AS book
		ON own.article_id = book.article_id

/* LIMIT 100 */


