-- Name: raw.stock_credit_note
-- Created: 2015-04-24 18:17:15
-- Updated: 2015-04-24 18:17:15

CREATE VIEW raw.stock_credit_note AS

SELECT
	/* po cant be easily converted to LONG, so leaving as string */
	po AS purchase_order_id,
	ean AS article_ean,
	CAST(credit_note_quantity AS INTEGER) AS stock_credit_note_qty,
	credit_note_no As stock_credit_note_no,
	delivery_note AS stock_delivery_note,
	CAST(date_of_receipt AS DATE) AS date_stock_credit_note_receipt,
	CAST(date_processed AS DATE) AS date_stock_credit_note_processed,
	accountant AS stock_credit_note_accountant
FROM
(
	SELECT 
		ROW_NUMBER() OVER (PARTITION BY po, ean ORDER BY date_of_receipt DESC) AS rnum,
		c.*
	FROM
		dwh.creditnoteupload c
) cn
WHERE rnum = 1


