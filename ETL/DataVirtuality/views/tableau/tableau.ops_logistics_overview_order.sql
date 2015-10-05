-- Name: tableau.ops_logistics_overview_order
-- Created: 2015-04-24 18:24:11
-- Updated: 2015-04-24 18:24:11

CREATE VIEW tableau.ops_logistics_overview_order AS

SELECT
	col.*
	/* CAST(COALESCE(date_stylist_picked, date_header_created, date_created) AS DATE) AS date_stylist_picked_or_created
	 COALESCE(orders_returned, orders_shipped) orders_shipped_and_returned	*/
FROM 
	bi.customer_order_logistics col
WHERE 
	CAST(COALESCE(date_stylist_picked, date_header_created, date_created) AS DATE) > TIMESTAMPADD(SQL_TSI_MONTH,-2,CURDATE())


