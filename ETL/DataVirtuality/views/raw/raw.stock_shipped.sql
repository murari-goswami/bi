-- Name: raw.stock_shipped
-- Created: 2015-04-24 18:17:54
-- Updated: 2015-04-24 18:17:54

CREATE VIEW raw.stock_shipped AS

SELECT
	id AS stock_shipped_id,
	/* order_id should be long, but it has bad data */
	orderid AS order_id,
	cod_amount,
	collo_number,
	parseTimestamp(date_created, 'yyyy-MM-dd HH:mm:ss.S') as date_stock_shipped,
	/* parseTimestamp(date_processed, 'yyyy-MM-dd HH:mm:ss.S') as date_processed, */
	parseTimestamp(last_updated, 'yyyy-MM-dd HH:mm:ss.S') as last_updated,
	/* parsedate(shipping_date, 'yyyymmdd') as date_shipped, */
	shipping_date,    /* Left this in for compatibility with older reports */
	CAST(line_number AS INTEGER) AS line_number,
	CAST(outfittery_article_number AS LONG) article_id, 
	LEFT(processing_reason, 4000) as processing_reason, 
	processing_result, 
	processing_state, 
	CAST(quantity AS INTEGER) AS stock_shipped, 
	receiver_address1, 
	receiver_address2, 
	receiver_city, 
	receiver_company, 
	receiver_country_code,
	receiver_name,
	receiver_zip_code, 
	return_track_and_trace_number, 
	track_and_trace_number, 
	transport_company, 
	used_invoice_number
FROM 
	postgres.doc_data_manifest_shipping


