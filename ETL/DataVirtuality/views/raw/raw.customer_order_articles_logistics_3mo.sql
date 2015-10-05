-- Name: raw.customer_order_articles_logistics_3mo
-- Created: 2015-04-24 18:17:51
-- Updated: 2015-07-02 10:18:19

CREATE view raw.customer_order_articles_logistics_3mo AS

WITH so AS
(
SELECT 
	h.order_id,
	h.date_header_created,
	h.shipping_code,
	l.article_id,
	l.line_number,
	l.date_order_line_created,
	l.date_line_created,
	l.date_line_cancelled
FROM
/*---there are often multiple entries in doc_data_sales_order_header, because every time an order is adjusted (by finance or a line item is cancelled because it is out of stock) it is re-submitted. Therefore, always use the min ---*/
	(
	SELECT
		order_id,
		MIN(date_stock_sales_order_header_created) AS date_header_created,
		MAX(shipping_code) AS shipping_code /* almost never more than 1 */
	FROM 
		raw.stock_sales_order_header
	GROUP BY 1
	HAVING
		MIN(date_stock_sales_order_header_created) >= TIMESTAMPADD(SQL_TSI_MONTH,-3,CURDATE())
	) h
	JOIN
/*---quantity = 0 means that the articles is out of stock and will go on backorder. This leads to the item getting cancelled off of the order. Therefore the max date where quantity = 0 is sales_order_line_date_cancelled ---*/
	(
	SELECT
	    b.*,
	    CASE 
	        WHEN date_line_cancelled_sub IS NOT NULL AND date_line_created IS NULL  THEN date_line_cancelled_sub
	        WHEN date_line_cancelled_sub > date_line_created                        THEN date_line_cancelled_sub
	    END AS date_line_cancelled
	FROM
		(
		SELECT
			order_id,
			article_id,
			line_number,
			MIN(date_stock_sales_order_line_created) AS date_order_line_created,
			MIN(CASE WHEN articles = 1 THEN date_stock_sales_order_line_created END) AS date_line_created,
			MIN(CASE WHEN articles < 1 THEN date_stock_sales_order_line_created END) AS date_line_cancelled_sub
		FROM
			raw.stock_sales_order_line
		GROUP BY 1,2,3
		) b
	) l
		 ON h.order_id 		= l.order_id
),
ir AS
(
/*--- if the line item in doc_data_sales_order_import_result has a message, that means it is "on error" and requires action from operations. Sometimes a line entry with a message shows up with the 
error message, "No changes possible in order", after it has been shipped. These can be ignored.  ---*/
SELECT 
    order_id,
    line_number,
	MIN(date_stock_imported) AS date_import_created,
    MIN(CASE WHEN message  = '' THEN date_stock_imported END) AS date_imported, /* '' equals success */
    MIN(CASE WHEN message != '' THEN date_stock_imported END) AS date_import_error,
    MAX(CASE WHEN message != '' THEN message END) AS import_error /* there are cases where >1 messages; if all messages are needed, then need to change */
FROM
	raw.stock_imported
WHERE
		message != 'No changes possible in order' /* message is not null */
	AND line_number != 0
GROUP BY 1,2
),

sc AS
(
SELECT
    y.*,
    CASE /* THIS CATORGIZES THE ORDER INTO A BUCKET BASED UPON THE LAST ROW OF DATA BEFORE manifest_shipping */
        WHEN date_picklist_created_max IS NOT NULL AND date_backordered_nos_max IS NULL THEN 'picklist created'
        WHEN date_picklist_created_max > date_backordered_nos_max                       THEN 'picklist created'
        ELSE 'backordered/not on stock'
    END AS order_status_change_state /* ARTICLE LEVEL */
FROM
    (
    SELECT
        sc.order_id,
        sc.article_id,
        MIN(sc.date_status_change) AS date_order_status_change_created,
        /* message has only 3 values, 'PICKLIST CREATED', 'BACKORDER', 'NOT ON STOCK' */
        MIN(CASE WHEN sc.message  = 'PICKLIST CREATED' 	THEN sc.date_status_change END) AS date_picklist_created,
        MIN(CASE WHEN sc.message  = 'BACKORDER' 		THEN sc.date_status_change END) AS date_backordered,
        MIN(CASE WHEN sc.message  = 'NOT ON STOCK' 		THEN sc.date_status_change END) AS date_not_on_stock,
        /* MAX USED AT ORDER LEVEL ROLLUP */
        MAX(CASE WHEN sc.message  = 'PICKLIST CREATED' 	THEN sc.date_status_change END) AS date_picklist_created_max,
        MAX(CASE WHEN sc.message != 'PICKLIST CREATED' 	THEN sc.date_status_change END) AS date_backordered_nos_max
    FROM
        raw.stock_sales_order_status_change sc
        LEFT JOIN
        /* JOIN TO doc_data_manifest_shipping TO FILTER OUT ANY DATES AFTER AN ORDER ARRIVES INTO THAT TABLE */
        raw.stock_shipped AS ms
            ON sc.order_id = ms.order_id
    WHERE
            sc.date_status_change < ms.date_stock_shipped
         OR ms.order_id IS NULL
    GROUP BY 1,2
    ) AS y
)


/* MAIN BODY */
SELECT 
	/* Identifiers */
	so.order_id,
	so.article_id,
	
	/* Dates (in order) */
	MIN(so.date_header_created) AS date_header_created,
	MIN(so.date_order_line_created) AS date_order_line_created,
	MIN(so.date_line_created) AS date_line_created,
	MIN(so.date_line_cancelled) AS date_line_cancelled,
	MIN(ir.date_import_created) AS date_import_created,
	MIN(ir.date_imported) AS date_imported,
	CASE
		WHEN MIN(ir.date_import_error) < MIN(sc.date_order_status_change_created)
		THEN MIN(ir.date_import_error)
		WHEN MIN(ir.date_import_error) IS NOT NULL AND MIN(sc.date_order_status_change_created) IS NULL
		THEN MIN(ir.date_import_error)
	END AS date_import_error,
	MIN(sc.date_order_status_change_created) AS date_order_status_change_created,
	MAX(sc.date_picklist_created_max) AS date_picklist_created_max,
	MAX(sc.date_backordered_nos_max) AS date_backordered_nos_max,
	MIN(sc.date_backordered) AS date_backordered,
	MIN(sc.date_not_on_stock) AS date_not_on_stock,
	MIN(sc.date_picklist_created) AS date_picklist_created,
	MIN(ddsc.date_stock_packed) AS date_packed,
	MIN(ddms.date_stock_shipped) AS date_shipped,
	/* add row for date deliverd once data is available from "postgres.delivery_tracking" */
	MIN(ddr.date_stock_returned) AS date_returned,
	
	/* other data points */
	MAX(ir.import_error) AS import_error,
	MAX(CAST(ddsc.transport_company_code AS LONG)) AS transport_company_code,
	MAX(ddms.track_and_trace_number) AS track_and_trace_number,
	MAX(ddms.receiver_country_code) AS shipping_country,
	MAX(so.shipping_code) AS shipping_code,
	MAX(LEFT(CAST(ddms.processing_reason AS STRING), 4000)) AS shipment_error,
	MAX(ddms.return_track_and_trace_number) AS return_track_and_trace_number,
	MAX(ddr.return_number) AS return_number,
	MAX(LEFT(CAST(ddr.processing_reason AS STRING), 4000)) AS return_error,
	MAX(sc.order_status_change_state) AS order_status_change_state
	
FROM 
	so
	LEFT JOIN
	ir
		 ON so.order_id 		= ir.order_id
		AND so.line_number 		= ir.line_number
	LEFT JOIN
	sc
		 ON so.order_id 		= sc.order_id
		AND so.article_id		= sc.article_id
	LEFT JOIN 
	raw.stock_packed AS ddsc 
		 ON so.order_id 		= ddsc.order_id
		AND so.article_id		= ddsc.article_id
	LEFT JOIN
	raw.stock_shipped AS ddms 
		 ON so.order_id  		= ddms.order_id
		AND so.article_id		= ddms.article_id		
	LEFT JOIN 
	raw.stock_returned ddr
		 ON so.order_id 		= ddr.order_id
		AND so.article_id 		= ddr.article_id
GROUP BY 1,2


