-- Name: tableau.ops_logistics_overview_order_article
-- Created: 2015-04-24 18:24:11
-- Updated: 2015-04-24 18:24:11

CREATE VIEW tableau.ops_logistics_overview_order_article AS

SELECT
	coal.*,
	col.date_stylist_picked,
	col.logistics_order_state,
	col.date_created,
	CASE
		WHEN col.date_picklist_created < coal.date_backordered THEN 'picklist before backorder'
		WHEN col.date_picklist_created > coal.date_backordered THEN 'backorder before picklist'
	END AS picklist_or_backordered_first
	/* CAST(COALESCE(date_stylist_picked, date_header_created, date_created) AS DATE) AS date_stylist_picked_or_created
	 COALESCE(orders_returned, orders_shipped) orders_shipped_and_returned	*/
FROM 
	bi.customer_order_articles_logistics coal
	JOIN
	bi.customer_order_logistics col
		ON coal.order_id = col.order_id
WHERE 
	CAST(COALESCE(col.date_stylist_picked, col.date_header_created, col.date_created) AS DATE) > TIMESTAMPADD(SQL_TSI_MONTH,-2,CURDATE())


