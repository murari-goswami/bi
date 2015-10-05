-- Name: raw.accounting_upload
-- Created: 2015-04-24 18:17:50
-- Updated: 2015-04-24 18:17:50

CREATE view raw.accounting_upload
AS
SELECT
	po AS purchase_order_id, /* conversion to long results in error */
	delivery_note,
	ean,
	cast(delivery_note_quantity_sup as integer) as delivery_note_quantity_supplier,
	invoice_number,
	cast(invoice_quantity as integer) as invoice_quantity,
	parseTimestamp(accounting_date, 'yyyy-MM-dd HH:mm:ss.S' ) as accounting_date,
	accountant
FROM dwh.accountingupload


