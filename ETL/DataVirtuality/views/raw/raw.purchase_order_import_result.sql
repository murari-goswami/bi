-- Name: raw.purchase_order_import_result
-- Created: 2015-04-24 18:17:55
-- Updated: 2015-04-24 18:17:55

CREATE VIEW raw.purchase_order_import_result AS

SELECT
	id AS po_import_id,
	code,
	PARSETIMESTAMP(date_created, 'yyyy-MM-dd HH:mm:ss.S') AS po_date_import_result,
	PARSETIMESTAMP(last_updated, 'yyyy-MM-dd HH:mm:ss.S') AS last_updated,
	CAST(outfittery_purchaseid AS LONG) AS purchase_order_id,
	LEFT(message, 4000) AS message,
	LEFT(processing_reason, 4000) AS processing_reason,
	processing_result,
	processing_state,
	type
FROM
	postgres.doc_data_purchase_order_import_result


