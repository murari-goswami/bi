-- Name: raw.purchase_order_articles
-- Created: 2015-04-24 18:17:15
-- Updated: 2015-04-24 18:17:15

CREATE VIEW raw.purchase_order_articles AS

SELECT
/* IDENTIFIERS AND STATUSES */
	CAST(pop.id AS LONG) AS poa_id,
	CAST(pop.purchase_order_id AS LONG) AS purchase_order_id,
	CAST(pop.order_position_id AS LONG) AS order_position_id,
	CAST(pop.purchase_order_positions_idx AS SHORT) AS poa_position_number,
	pop.supplier_order_number AS poa_supplier_order_number,
	CAST(pop.article_id AS LONG) AS article_id,
	a.ean AS article_ean,
	CAST(pop.state AS SHORT) AS poa_state_number,
	
/* DATES */
	CAST(pop.date_created AS TIMESTAMP) AS date_poa_created,
	CAST(pop.date_canceled AS TIMESTAMP) AS date_poa_cancelled,
	CAST(pop.date_fulfilled AS TIMESTAMP) AS date_poa_fulfilled,
	pop.last_updated AS date_poa_updated,
	CAST(pop.earliest_delivery_date AS DATE) AS date_poa_delivery_earliest,
	CAST(pop.latest_delivery_date AS DATE) AS date_poa_delivery_latest,

/* QUANTITIES */	
	CAST(pop.initial_quantity AS INTEGER) AS stock_ordered_initially,
	CAST(pop.quantity AS INTEGER) AS stock_ordered_revised,
	CAST(pop.fulfilled_quantity AS INTEGER) AS stock_fulfilled,

/* OTHER */
	pop.retail_price AS article_sales_price,
	pop.purchase_price AS article_cost

FROM 
	postgres.purchase_order_position pop
	LEFT JOIN
	postgres.article a
		 ON pop.article_id = a.id
		 
/* TO ELIMINATE SOME OF THE DUP ARTICLES IN AN ORDER
WHERE  
	   pop.initial_quantity 	!= 0
	OR pop.quantity 			!= 0
	OR pop.fulfilled_quantity 	!= 0
*/


