-- Name: raw.stock_scanned
-- Created: 2015-04-24 18:17:16
-- Updated: 2015-04-28 18:16:46

CREATE VIEW raw.stock_scanned AS

SELECT 
	CAST(po AS LONG) AS purchase_order_id,
	ean AS article_ean,
	CASE 
		WHEN ean_unknown = 'JA' THEN 'ean unknown'
	END AS scan_ean_unknown,
	CASE 
		WHEN article_overdelivered = 'JA' THEN 'article overdelivered'
	END AS scan_article_overdelivered,
	CASE 
		WHEN photo_article = 'JA' THEN 'photo article selected'
	END AS scan_photo_article,
	CASE
		WHEN hanging = 'JA' THEN 'garment'
	END AS scan_garment,
	CASE
		WHEN ean_unknown = 'JA' THEN 'ean unknown'
		WHEN article_overdelivered = 'JA' THEN 'article overdelivered'
	END AS scan_clarification_case,
	delivery_note AS stock_delivery_note,
	parseTimestamp(date_delivered, 'yyyy-MM-dd HH:mm:ss.S') AS date_stock_delivered,
	parseTimestamp(date_scanned, 'yyyy-MM-dd HH:mm:ss.S') AS date_stock_scanned,
	parseTimestamp(date_given_to_serviceprovi, 'yyyy-MM-dd HH:mm:ss.S') AS date_stock_handedover,
	parseTimestamp(date_uploaded, 'yyyy-MM-dd HH:mm:ss.S') AS date_stock_uploaded,
	added_value AS scan_added_value
FROM 
	dwh.scantemplatestool
WHERE 
		po IS NOT NULL 
	 OR ean IS NOT NULL 
	 OR delivery_note IS NOT NULL


/* ORIGINAL CODE
SELECT 
	po AS purchase_order_id,
	ean AS article_ean,
	CASE 
		WHEN ean_unknown = 'JA' THEN 'ean unknown'
	END AS scan_ean_unknown,
	CASE 
		WHEN article_overdelivered = 'JA' THEN 'article overdelivered'
	END AS scan_article_overdelivered,
	CASE 
		WHEN photo_article = 'JA' THEN 'photo article selected'
	END AS scan_photo_article,
	CASE
		WHEN ean_unknown = 'JA' THEN 'ean unknown'
		WHEN article_overdelivered = 'JA' THEN 'article overdelivered'
	END AS scan_clarification_case,
	delivery_note AS stock_delivery_note,
	parseTimestamp(date_delivered, 'yyyy-MM-dd HH:mm:ss.S') AS date_stock_delivered,
	parseTimestamp(date_scanned, 'yyyy-MM-dd HH:mm:ss.S') AS date_stock_scanned,
	parseTimestamp(date_given_to_serviceprovi, 'yyyy-MM-dd HH:mm:ss.S') AS date_stock_handedover,
	parseTimestamp(date_uploaded, 'yyyy-MM-dd HH:mm:ss.S') AS date_stock_uploaded
FROM 
	dwh.scantemplatestool
WHERE 
		po IS NOT NULL 
	 OR ean IS NOT NULL 
	 OR delivery_note IS NOT NULL
*/


