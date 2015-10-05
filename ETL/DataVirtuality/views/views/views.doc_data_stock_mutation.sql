-- Name: views.doc_data_stock_mutation
-- Created: 2015-04-24 18:17:12
-- Updated: 2015-04-24 18:17:12

CREATE view views.doc_data_stock_mutation AS

SELECT 
	id,
	version,
	booking_code,
	customer_article_number,
	"date",
	parseTimestamp(date_created, 'yyyy-MM-dd HH:mm:ss.S' ) as date_created,
	parseTimestamp(date_processed, 'yyyy-MM-dd HH:mm:ss.S' ) as date_processed,
	parseTimestamp(last_updated, 'yyyy-MM-dd HH:mm:ss.S' ) as last_updated,
	packing_slip_number,
	po_number,
	processing_reason,
	processing_result,
	processing_state,
	quantity_defect,
	quantity_good,
	supplier_code 
FROM postgres.doc_data_stock_mutation



/* new code; needs fixing for quantity_defect and quantity_good due to data changes
SELECT 
	stock_booking_id AS id,
	CAST(NULL AS LONG) AS version,
	CAST(stock_booking_code AS STRING(50)) AS booking_code,
	CAST(article_id AS STRING(50)) AS customer_article_number,
	stock_date AS "date",  						      	
	date_stock_booked as date_created,
	date_stock_booking_processed as date_processed,
	date_stock_booking_updated as last_updated,
	stock_booking_packing_slip_number AS packing_slip_number,
	CAST(
		CASE
			WHEN purchase_order_id IS NULL THEN ''
			ELSE purchase_order_id
		END 
	AS STRING(20)) AS po_number,
	stock_booking_processing_reason as processing_reason, 		      	
	stock_booking_processing_result as processing_result,
	stock_booking_processing_state_number as processing_state,
	CAST(NULL AS STRING(50)) AS quantity_defect, 				      	
	CAST(stock_booked AS STRING(50)) AS quantity_good,
	CAST(supplier_id AS STRING(50)) AS supplier_code
FROM raw.stock_booked
*/


