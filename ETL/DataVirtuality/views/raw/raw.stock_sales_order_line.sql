-- Name: raw.stock_sales_order_line
-- Created: 2015-04-24 18:17:55
-- Updated: 2015-04-24 18:17:55

CREATE VIEW raw.stock_sales_order_line AS

SELECT
	doc_data_sales_order_header_id AS stock_sales_order_header_id,
	CAST(orderid AS LONG) AS order_id,
	CAST(outfittery_article_number AS LONG) AS article_id,
	CAST(line_number AS INTEGER) AS line_number,
	parseTimestamp(date_created, 'yyyy-MM-dd HH:mm:ss.S') as date_stock_sales_order_line_created,
	parseTimestamp(last_updated, 'yyyy-MM-dd HH:mm:ss.S') as last_updated,
	description_in_preferred_language,
	processing_result,
	processing_state,
	quantity AS articles,
	/*----retail price information----*/
	unit_price_including_vat,
	unit_price_total_standard,
	unit_price_without_vat,
	unit_vat_price,
	vat_code,
	poid,
	supplier
FROM
	postgres.doc_data_sales_order_line


