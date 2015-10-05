-- Name: raw.stock_returned
-- Created: 2015-04-24 18:17:54
-- Updated: 2015-04-24 18:17:54

CREATE view raw.stock_returned AS

SELECT
	id AS stock_returned_id,
	CAST(original_orderid AS LONG) AS order_id,
	CAST(original_customerid AS LONG) AS customer_id,
	CAST(outfittery_article_number AS LONG) AS article_id,
	parseTimestamp(date_created, 'yyyy-MM-dd HH:mm:ss.S') AS date_stock_returned,
	parseTimestamp(last_updated, 'yyyy-MM-dd HH:mm:ss.S') AS last_updated,
	LEFT(comment, 4000) AS comment,
	CAST(condition_code AS INTEGER) AS condition_code,
	CAST(number_of_articles_return AS INTEGER) AS stock_returned,
	processing_result,
	processing_state,
	LEFT(processing_reason, 4000) AS processing_reason,
	CAST(reason_code AS INTEGER) AS reason_code,
	return_number
FROM 
	postgres.doc_data_return


