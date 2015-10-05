-- Name: raw.stock_sales_order_status_change
-- Created: 2015-04-24 18:17:56
-- Updated: 2015-04-24 18:17:56

CREATE VIEW raw.stock_sales_order_status_change AS

SELECT
	id AS stock_sales_order_status_change_id,
	/* leaving order_id as string due to bad data */
	orderid AS order_id,
	/* leaving order_id as string due to bad data */
	customerid AS customer_id,
	CAST(customer_article_number AS LONG) AS article_id,
	parseTimestamp(date_created, 'yyyy-MM-dd HH:mm:ss.S') as date_status_change,
	parseTimestamp(date_processed, 'yyyy-MM-dd HH:mm:ss.S') as date_processed,
	parseTimestamp(last_updated, 'yyyy-MM-dd HH:mm:ss.S') as last_updated,
	line_number,
	LEFT(message, 4000) AS message,
	LEFT(processing_reason, 4000) AS processing_reason,
	processing_result,
	processing_state,
	CAST(quantity_in_backorder AS SHORT) AS articles_backordered,
	CAST(quantity_on_picklist AS SHORT) AS articles_on_picklist
FROM
	postgres.doc_data_sales_order_status_change


