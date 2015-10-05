-- Name: raw.stock_packed
-- Created: 2015-04-24 18:17:54
-- Updated: 2015-04-24 18:17:54

CREATE VIEW raw.stock_packed AS

SELECT
	id AS stock_packed_id,
	parseTimestamp(date_created, 'yyyy-MM-dd HH:mm:ss.S') as date_stock_packed,
	parseTimestamp(last_updated, 'yyyy-MM-dd HH:mm:ss.S') as last_updated,
	CAST(line_number AS INTEGER) AS line_number,
	/* bad data in order_id, so leaving as string */
	orderid AS order_id,
	CAST(outfittery_article_number AS LONG) AS article_id,
	LEFT(processing_reason, 4000) AS processing_reason,
	processing_result,
	processing_state,
	CAST(quantity_shipped AS INTEGER) AS stock_packed,
	shipping_date,
	track_and_trace_number,
	transport_company_code
FROM 
	postgres.doc_data_shipment_confirmation


