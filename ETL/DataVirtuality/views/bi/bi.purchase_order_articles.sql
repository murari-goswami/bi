-- Name: bi.purchase_order_articles
-- Created: 2015-04-24 18:19:32
-- Updated: 2015-04-24 18:19:32

CREATE view bi.purchase_order_articles AS

WITH 
scan AS
( 
  SELECT
    purchase_order_id,
    article_ean,
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
  GROUP BY 1,2
),

bk AS 
(
  SELECT
    purchase_order_id,
    article_id,
    MIN(date_stock_booked) AS date_stock_booked_min,
    MAX(date_stock_booked) AS date_stock_booked_max,
    MIN(supplier_id) AS supplier_id, /* RARELY DUPLICATES */
    SUM(po_bookings) AS stock_booked
  FROM
    bi.stock_booked
  WHERE
  	po_bookings IS NOT NULL
  GROUP BY 1,2
),

au AS
(
  SELECT
    po AS purchase_order_id,
    ean AS article_ean,
    SUM(CAST(invoice_quantity AS INTEGER)) AS stock_invoiced,
    SUM(CAST(delivery_note_quantity_sup AS INTEGER)) AS stock_delivery_note_qty
    /*delivery_note AS poa_stock_delivery_note,
    CAST(delivery_note_quantity_sup AS integer) AS poa_delivery_note_quantity_supplier,
    invoice_number AS poa_invoice_number,
    CAST(parseTimestamp(accounting_date, 'yyyy-MM-dd HH:mm:ss.S') AS DATE) AS poa_date_accounting */
  FROM dwh.accountingupload
  WHERE po IS NOT NULL
  GROUP BY 1,2
),

sla AS
(
  SELECT purchase_order_id, article_id, 
  /* THERE ARE MANY ORDER THAT HAVE A SMALL NEGATIVE TIME, SO INCLUDING IN 1ST DAY */
  SUM(CASE WHEN stock_sla_hours_handover_to_booking >-1 AND stock_sla_hours_handover_to_booking <=24  THEN 1 ELSE 0 END) AS stock_sla_booked_1st_day,
  SUM(CASE WHEN stock_sla_hours_handover_to_booking >24 AND stock_sla_hours_handover_to_booking <=48  THEN 1 ELSE 0 END) AS stock_sla_booked_2nd_day,
  SUM(CASE WHEN stock_sla_hours_handover_to_booking >48 AND stock_sla_hours_handover_to_booking <=72  THEN 1 ELSE 0 END) AS stock_sla_booked_3rd_day,
  SUM(CASE WHEN stock_sla_hours_handover_to_booking >72                         					  THEN 1 ELSE 0 END) AS stock_sla_booked_after_3_days,
  ROUND(AVG(stock_sla_hours_handover_to_booking), 1) AS stock_sla_avg_hours_handover_to_booking
  FROM
  (
    SELECT 
      scan.purchase_order_id,
      scan.article_id,
      (CAST(TIMESTAMPDIFF(SQL_TSI_MINUTE, scan.date_stock_handedover, bk.date_stock_booked) AS DECIMAL) -
       CAST(TIMESTAMPDIFF(SQL_TSI_WEEK, scan.date_stock_handedover, bk.date_stock_booked) * 48*60 AS DECIMAL) ) /60
      AS stock_sla_hours_handover_to_booking
    FROM
    (
      SELECT
        ROW_NUMBER() OVER (PARTITION BY scan.purchase_order_id, scan.article_ean ORDER BY scan.date_stock_scanned ASC) AS rnum_scan,
        scan.purchase_order_id,
        a.article_id,
        scan.date_stock_handedover
      FROM raw.stock_scanned scan
      JOIN raw.article a ON scan.article_ean = a.article_ean
    ) AS scan 
    LEFT JOIN
    (
      SELECT 
        ROW_NUMBER() OVER (PARTITION BY purchase_order_id, article_id ORDER BY date_stock_booked ASC) AS rnum_sm,
        purchase_order_id,
        article_id,
        date_stock_booked
      FROM bi.stock_booked
      WHERE
  		po_bookings IS NOT NULL
    ) AS bk 
       ON bk.article_id       	= scan.article_id 
      AND bk.purchase_order_id  = scan.purchase_order_id 
      AND bk.rnum_sm        	= scan.rnum_scan
  ) z
  GROUP BY 1,2
),

dn AS
(
	SELECT
		purchase_order_id,
		article_ean,
		MAX(CASE WHEN rnum=1   THEN 	  stock_delivery_note    	  END) ||
		MAX(CASE WHEN rnum=2   THEN ', '||stock_delivery_note ELSE '' END) ||
		MAX(CASE WHEN rnum=3   THEN ', '||stock_delivery_note ELSE '' END) ||
		MAX(CASE WHEN rnum=4   THEN ', '||stock_delivery_note ELSE '' END) ||
		MAX(CASE WHEN rnum=5   THEN ', '||stock_delivery_note ELSE '' END) ||
		MAX(CASE WHEN rnum=6   THEN ', '||stock_delivery_note ELSE '' END) ||
		MAX(CASE WHEN rnum=7   THEN ', '||stock_delivery_note ELSE '' END) ||
		MAX(CASE WHEN rnum=8   THEN ', '||stock_delivery_note ELSE '' END) ||
		MAX(CASE WHEN rnum=9   THEN ', '||stock_delivery_note ELSE '' END) ||
		MAX(CASE WHEN rnum=10  THEN ', '||stock_delivery_note ELSE '' END) ||
		MAX(CASE WHEN rnum=11  THEN ', '||stock_delivery_note ELSE '' END) ||
		MAX(CASE WHEN rnum=12  THEN ', '||stock_delivery_note ELSE '' END) ||
		MAX(CASE WHEN rnum=13  THEN ', '||stock_delivery_note ELSE '' END) ||
		MAX(CASE WHEN rnum=14  THEN ', '||stock_delivery_note ELSE '' END) ||
		MAX(CASE WHEN rnum=15  THEN ', '||stock_delivery_note ELSE '' END) ||
		MAX(CASE WHEN rnum=16  THEN ', '||stock_delivery_note ELSE '' END) ||
		MAX(CASE WHEN rnum=17  THEN ', '||stock_delivery_note ELSE '' END) ||
		MAX(CASE WHEN rnum=18  THEN ', '||stock_delivery_note ELSE '' END) ||
		MAX(CASE WHEN rnum=19  THEN ', '||stock_delivery_note ELSE '' END) ||
		MAX(CASE WHEN rnum=20  THEN ', '||stock_delivery_note ELSE '' END) ||
		MAX(CASE WHEN rnum=21  THEN ', '||stock_delivery_note ELSE '' END) ||
		MAX(CASE WHEN rnum=22  THEN ', '||stock_delivery_note ELSE '' END) ||
		MAX(CASE WHEN rnum=23  THEN ', '||stock_delivery_note ELSE '' END) ||
		MAX(CASE WHEN rnum=24  THEN ', '||stock_delivery_note ELSE '' END) ||
		MAX(CASE WHEN rnum=25  THEN ', '||stock_delivery_note ELSE '' END) ||
		MAX(CASE WHEN rnum=26  THEN ', '||stock_delivery_note ELSE '' END) ||
		MAX(CASE WHEN rnum=27  THEN ', '||stock_delivery_note ELSE '' END) ||
		MAX(CASE WHEN rnum=28  THEN ', '||stock_delivery_note ELSE '' END) ||
		MAX(CASE WHEN rnum=29  THEN ', '||stock_delivery_note ELSE '' END) ||
		MAX(CASE WHEN rnum=30  THEN ', '||stock_delivery_note ELSE '' END) ||
		MAX(CASE WHEN rnum=31  THEN ', '||stock_delivery_note ELSE '' END) ||
		MAX(CASE WHEN rnum=32  THEN ', '||stock_delivery_note ELSE '' END) ||
		MAX(CASE WHEN rnum=33  THEN ', '||stock_delivery_note ELSE '' END) ||
		MAX(CASE WHEN rnum=34  THEN ', '||stock_delivery_note ELSE '' END) ||
		MAX(CASE WHEN rnum=35  THEN ', '||stock_delivery_note ELSE '' END) ||
		MAX(CASE WHEN rnum=36  THEN ', '||stock_delivery_note ELSE '' END) ||
		MAX(CASE WHEN rnum=37  THEN ', '||stock_delivery_note ELSE '' END) ||
		MAX(CASE WHEN rnum=38  THEN ', '||stock_delivery_note ELSE '' END) ||
		MAX(CASE WHEN rnum=39  THEN ', '||stock_delivery_note ELSE '' END) ||
		MAX(CASE WHEN rnum=40  THEN ', '||stock_delivery_note ELSE '' END) ||
		MAX(CASE WHEN rnum=41  THEN ', '||stock_delivery_note ELSE '' END) ||
		MAX(CASE WHEN rnum=42  THEN ', '||stock_delivery_note ELSE '' END) ||
		MAX(CASE WHEN rnum=43  THEN ', '||stock_delivery_note ELSE '' END) ||
		MAX(CASE WHEN rnum=44  THEN ', '||stock_delivery_note ELSE '' END) ||
		MAX(CASE WHEN rnum=45  THEN ', '||stock_delivery_note ELSE '' END) ||
		MAX(CASE WHEN rnum=46  THEN ', '||stock_delivery_note ELSE '' END) ||
		MAX(CASE WHEN rnum=47  THEN ', '||stock_delivery_note ELSE '' END) ||
		MAX(CASE WHEN rnum=48  THEN ', '||stock_delivery_note ELSE '' END) ||
		MAX(CASE WHEN rnum=49  THEN ', '||stock_delivery_note ELSE '' END) ||
		MAX(CASE WHEN rnum=50  THEN ', '||stock_delivery_note ELSE '' END)
		AS stock_delivery_notes
	FROM
	(
		SELECT 
		        ROW_NUMBER() OVER (PARTITION BY purchase_order_id, article_ean ORDER BY stock_delivery_note ASC) AS rnum,
		   		purchase_order_id,
				article_ean,
				stock_delivery_note
		FROM
			(
			SELECT DISTINCT
				purchase_order_id,
				article_ean,
				stock_delivery_note
			FROM
				raw.stock_scanned scan
			WHERE
				stock_delivery_note IS NOT NULL
			) z
	) zz
	GROUP BY 1,2
),

poa_dup AS
(
	SELECT 
	    purchase_order_id, 
	    article_id
	FROM 
	  raw.purchase_order_articles
	GROUP BY 1,2
	HAVING COUNT(*)>1
)  


/* MAIN BODY */

SELECT 
/* IDENTIFIERS */
  CASE
    WHEN poa.purchase_order_id  IS NOT NULL THEN 'poa'
    ELSE NULL
  END AS driving_tbl_poa,
  CASE
    WHEN scan.purchase_order_id IS NOT NULL THEN 'scan'
    ELSE NULL
  END AS driving_tbl_scan,
  poa.poa_id,
  CAST(COALESCE(poa.purchase_order_id, scan.purchase_order_id) AS LONG) AS purchase_order_id,
  poa.poa_position_number,
  poa.poa_supplier_order_number,
  poa.article_id,
  COALESCE(poa.article_ean, scan.article_ean) AS article_ean,
  poa.order_position_id,
  coa.order_id,
  poa.poa_state_number,

  /* DATA QUALITY CHECKS, STATUS IDENTIFIERS, ETC */
  /*
  CASE
    WHEN poa.poa_state_number = 2048                                                             							THEN 'poa cancelled'
    WHEN poa.poa_state_number = 4 AND poa.stock_fulfilled + COALESCE(scan.stock_scanned,0) + COALESCE(bk.stock_booked,0) =0 THEN 'poa created'
    WHEN poa.poa_state_number = 8 AND poa.stock_fulfilled + COALESCE(scan.stock_scanned,0) + COALESCE(bk.stock_booked,0) =0 THEN 'poa issued to supplier'
    WHEN 						 	  poa.stock_fulfilled + COALESCE(scan.stock_scanned,0) + COALESCE(bk.stock_booked,0) >0 THEN 'poa stock received'
    ELSE 'Ask BI'
  END AS poa_state,
  */
  CASE
    WHEN poa.poa_state_number = 2048 		THEN 'cancelled'
    WHEN poa.stock_ordered_revised =0    	THEN 'revised qty 0'
    WHEN poa.poa_state_number = 4 AND COALESCE(scan.stock_scanned,0) + COALESCE(bk.stock_booked,0) =0 THEN 'created'
    WHEN poa.poa_state_number = 8 AND COALESCE(scan.stock_scanned,0) + COALESCE(bk.stock_booked,0) =0 THEN 'waiting on supplier'
    WHEN COALESCE(bk.stock_booked, scan.stock_scanned) - poa.stock_ordered_revised < 0 THEN 'under filled'
    WHEN COALESCE(bk.stock_booked, scan.stock_scanned) - poa.stock_ordered_revised > 0 THEN 'over filled'
    WHEN COALESCE(bk.stock_booked, scan.stock_scanned) - poa.stock_ordered_revised = 0 THEN 'correctly filled'
    WHEN poa.purchase_order_id IS NULL AND scan.purchase_order_id IS NOT NULL THEN 'scan without matching poa'
  END AS poa_status,
  CASE
    WHEN poa_dup.article_id IS NOT NULL THEN 'duplicate article id' 
    ELSE NULL
  END AS poa_duplicate_articles,
  /*
  CASE
    WHEN scan.article_ean IS NULL AND bk.stock_bookings IS NULL THEN 'no scan or booking'
    WHEN scan.article_ean IS NULL 								THEN 'no scan'
    WHEN bk.stock_bookings IS NULL 								THEN 'no booking'
    ELSE ''
  END AS poa_booking_check,
  */   
  CASE
    WHEN scan.stock_scanned = 0             		THEN -poa.stock_fulfilled
    WHEN scan.stock_scanned >= au.stock_invoiced 	THEN scan.stock_scanned - cn.stock_credit_note_qty - poa.stock_fulfilled
    WHEN scan.stock_scanned <  au.stock_invoiced 	THEN scan.stock_scanned - poa.stock_fulfilled
    ELSE NULL
  END AS stock_booking_control,
  scan.stock_scanned_ean_unknown_articles,
  scan.stock_scanned_overdelivered_articles,
  scan.stock_scanned_photo_articles,
  scan.stock_scanned_clarification_cases,

/* QUANTITIES */
  poa.stock_ordered_initially,
  poa.stock_ordered_revised,
  /* poa.stock_fulfilled, */
  scan.stock_scanned,
  COALESCE(poa.stock_fulfilled, bk.stock_booked) AS stock_booked,
  sla.stock_sla_booked_1st_day,
  sla.stock_sla_booked_2nd_day,
  sla.stock_sla_booked_3rd_day,
  sla.stock_sla_booked_after_3_days,
  sla.stock_sla_avg_hours_handover_to_booking,
  au.stock_invoiced,
  au.stock_delivery_note_qty,
  cn.stock_credit_note_qty,

/* DATES */
  poa.date_poa_created,
  poa.date_poa_cancelled,
  poa.date_poa_fulfilled,
  poa.date_poa_updated,
  poa.date_poa_delivery_earliest,
  poa.date_poa_delivery_latest,
  scan.date_stock_delivered_min,
  scan.date_stock_delivered_max,
  scan.date_stock_scanned_min,
  scan.date_stock_scanned_max,
  scan.date_stock_handedover_min,
  scan.date_stock_handedover_max,
  scan.date_stock_uploaded_min,
  scan.date_stock_uploaded_max,
  bk.date_stock_booked_min,
  bk.date_stock_booked_max,
  CASE 
    WHEN CAST(scan.date_stock_delivered_max AS DATE) < CAST(poa.date_poa_delivery_earliest AS DATE) AND CAST(scan.date_stock_delivered_max AS DATE) < CAST(poa.date_poa_delivery_latest AS DATE) THEN 'early'
    WHEN CAST(scan.date_stock_delivered_max AS DATE) > CAST(poa.date_poa_delivery_earliest AS DATE) AND CAST(scan.date_stock_delivered_max AS DATE) < CAST(poa.date_poa_delivery_latest AS DATE) THEN 'on time'
    WHEN CAST(scan.date_stock_delivered_max AS DATE) > CAST(poa.date_poa_delivery_earliest AS DATE) AND CAST(scan.date_stock_delivered_max AS DATE) > CAST(poa.date_poa_delivery_latest AS DATE) THEN 'late'
    ELSE NULL
  END AS delivery_performance,
  
/* VARIOUS ARTICLE INFO */
  poa.article_sales_price,
  poa.article_cost,
  dn.stock_delivery_notes
  
FROM
  raw.purchase_order_articles poa
  FULL JOIN
  scan
     ON poa.article_ean     	= scan.article_ean
    AND poa.purchase_order_id 	= scan.purchase_order_id
  LEFT JOIN
  bi.customer_order_articles coa
     ON coa.order_position_id 	= poa.order_position_id
  LEFT JOIN
  sla
     ON poa.article_id      	= sla.article_id
    AND poa.purchase_order_id   = sla.purchase_order_id
  LEFT JOIN
  bk
     ON poa.article_id      	= bk.article_id
    AND poa.purchase_order_id   = bk.purchase_order_id    
  LEFT JOIN
  au
     ON poa.purchase_order_id 	= au.purchase_order_id
    AND poa.article_ean     	= au.article_ean
  LEFT JOIN
  raw.stock_credit_note AS cn
     ON poa.purchase_order_id 	= cn.purchase_order_id
    AND poa.article_ean     	= cn.article_ean  
  LEFT JOIN
  dn
     ON scan.article_ean     	= dn.article_ean
    AND scan.purchase_order_id 	= dn.purchase_order_id
  LEFT JOIN
  poa_dup 
     ON poa.purchase_order_id   = poa_dup.purchase_order_id 
    AND poa.article_id      	= poa_dup.article_id


