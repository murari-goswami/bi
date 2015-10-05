-- Name: raw.stock_imported
-- Created: 2015-04-24 18:17:55
-- Updated: 2015-04-24 18:17:55

CREATE VIEW raw.stock_imported AS

SELECT
	id AS stock_imported_id,
	code,
	/* have to leave order_id as string due to bad data */
	orderid AS order_id,
	CAST(line_number AS SHORT) AS line_number,
	LEFT(message, 4000) AS message,
	parseTimestamp(date_created, 'yyyy-MM-dd HH:mm:ss.S') as date_stock_imported,
	parseTimestamp(last_updated, 'yyyy-MM-dd HH:mm:ss.S') as last_updated,
	LEFT(processing_reason, 4000) AS processing_reason,
	processing_result,
	processing_state
FROM 
	postgres.doc_data_sales_order_import_result


