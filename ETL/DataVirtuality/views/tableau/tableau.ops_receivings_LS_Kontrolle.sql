-- Name: tableau.ops_receivings_LS_Kontrolle
-- Created: 2015-04-24 18:20:32
-- Updated: 2015-09-18 16:04:16

CREATE view tableau.ops_receivings_LS_Kontrolle 
AS

WITH 
scan AS
( /* For this report, grain at po-ean-deliv note */
  SELECT
    purchase_order_id,
    article_ean,
    stock_delivery_note,
    COUNT(*) stock_scanned,
    MIN(date_stock_delivered) 		AS date_stock_delivered_min,
    MAX(date_stock_delivered) 		AS date_stock_delivered_max,
    MIN(date_stock_scanned)  		AS date_stock_scanned_min,
    MAX(date_stock_scanned)  		AS date_stock_scanned_max,
    MIN(date_stock_handedover) 		AS date_stock_handedover_min,
    MAX(date_stock_handedover) 		AS date_stock_handedover_max,
    MIN(date_stock_uploaded) 		AS date_stock_uploaded_min,
    MAX(date_stock_uploaded) 		AS date_stock_uploaded_max,
	SUM(CASE WHEN scan_ean_unknown = 'ean unknown' 										THEN 1 END) AS stock_scanned_ean_unknown_articles,
	SUM(CASE WHEN scan_article_overdelivered = 'article overdelivered' 					THEN 1 END) AS stock_scanned_overdelivered_articles,
	SUM(CASE WHEN scan_photo_article = 'photo article selected' 						THEN 1 END) AS stock_scanned_photo_articles,
	SUM(CASE WHEN scan_clarification_case IN ('ean unknown', 'article overdelivered') 	THEN 1 END) AS stock_scanned_clarification_cases
  FROM
    raw.stock_scanned scan
  GROUP BY 1,2,3
)

/* MAIN BODY */

SELECT 
	poa.purchase_order_id as po,
	poa.article_ean as ean,
	poa.article_id,
	poa.date_poa_fulfilled,
	scan.stock_delivery_note AS delivery_note,
	scan.stock_scanned as anzahl_scans,
	scan.stock_scanned_ean_unknown_articles as anzahl_ean_unbekannt, 
	scan.stock_scanned_photo_articles as anzahl_photo_artikel, 
	scan.stock_scanned_overdelivered_articles as anzahl_ueberlieferung, 
	scan.date_stock_handedover_min as mindatum_Uebergabe_an_Dienstleister, 
	scan.date_stock_handedover_max as maxdatum_Uebergabe_an_Dienstleister, 
	scan.date_stock_scanned_min as mindatum_scan, 
	scan.date_stock_scanned_max as maxdatum_scan, 
	scan.date_stock_delivered_min as mindatum_Lieferdatum, 
	scan.date_stock_delivered_max as maxdatum_Lieferdatum,
	poa.stock_ordered_initially as initial_quantity,
	poa.stock_ordered_revised as quantity,
	poa.stock_booked as fulfilled_quantity,
	poa.article_cost as purchase_price,
	poa.stock_delivery_note_qty as delivery_note_quantity_supplier,
	au.invoice_number,
	au.invoice_quantity,
	au.accounting_date, 
	au.accountant,
	i.item_description,
	i.item_no,
	i.vendor_item_no,
	COALESCE(i.brand,a.article_brand) AS brand,
	i.supplier_color,
	a.article_name AS supplier_article_name,
	a.article_supplier_color_code AS supplier_color_code, 
	a.article_supplier_color_name AS supplier_color_name, 
	a.article_supplier_length AS supplier_length, 
	a.article_eu_size AS eu_size, 
	a.article_supplier_size AS supplier_size, 
	a.article_eu_length AS eu_length, 
	a.article_supplier_sku AS supplier_sku
FROM
	bi.purchase_order_articles poa
	LEFT JOIN
	scan
		 ON poa.purchase_order_id 	= scan.purchase_order_id
		AND poa.article_ean 		= scan.article_ean
	LEFT JOIN
	raw.accounting_upload au
		 ON scan.article_ean 			= au.ean
		AND scan.purchase_order_id 		= au.purchase_order_id
		AND scan.stock_delivery_note 	= au.delivery_note
	LEFT JOIN
	bi.article a
		 ON poa.article_id = a.article_id
	LEFT JOIN
	bi.item i on i.article_id=a.article_id
WHERE 
	poa.driving_tbl_scan IS NOT NULL


