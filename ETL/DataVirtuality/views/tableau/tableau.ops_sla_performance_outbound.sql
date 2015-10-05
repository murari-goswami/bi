-- Name: tableau.ops_sla_performance_outbound
-- Created: 2015-04-24 18:24:11
-- Updated: 2015-04-24 18:24:11

CREATE VIEW tableau.ops_sla_performance_outbound AS

SELECT
	col.*
	/* CAST(COALESCE(date_stylist_picked, date_header_created, date_created) AS DATE) AS date_stylist_picked_or_created
	 COALESCE(orders_returned, orders_shipped) orders_shipped_and_returned	*/
FROM 
	bi.customer_order_logistics col


