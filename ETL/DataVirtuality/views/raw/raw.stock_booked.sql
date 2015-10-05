-- Name: raw.stock_booked
-- Created: 2015-04-24 18:17:12
-- Updated: 2015-04-24 18:17:12

CREATE VIEW raw.stock_booked AS

SELECT 
    CAST(sm.id AS LONG) AS stock_booked_id,
    CAST(CASE WHEN po_number = '' THEN NULL ELSE po_number END AS LONG) AS purchase_order_id,
    CAST(sm.customer_article_number AS LONG) AS article_id,
    "date" AS stock_date,
    parseTimestamp(sm.date_created, 'yyyy-MM-dd HH:mm:ss.S') AS date_stock_booked,
    parseTimestamp(sm.date_processed, 'yyyy-MM-dd HH:mm:ss.S') AS date_processed,
    parseTimestamp(sm.last_updated, 'yyyy-MM-dd HH:mm:ss.S') AS last_updated,
    sm.packing_slip_number AS stock_booking_packing_slip_number,
    CAST(sm.booking_code AS INTEGER) AS stock_booking_code,
    LEFT(processing_reason, 4000) AS stock_booking_processing_reason,
    CAST(sm.processing_state AS INTEGER) AS stock_booking_processing_state_number,
    CAST(sm.processing_result AS INTEGER) AS stock_booking_processing_result,
    CAST(sm.supplier_code AS INTEGER) AS supplier_id,
    CAST(CASE WHEN sm.quantity_defect = '' THEN NULL ELSE sm.quantity_defect END AS INTEGER) AS stock_defects,
    CAST(CASE WHEN sm.quantity_good   = '' THEN NULL ELSE sm.quantity_good   END AS INTEGER) AS stock_booked
FROM 
	postgres.doc_data_stock_mutation sm


