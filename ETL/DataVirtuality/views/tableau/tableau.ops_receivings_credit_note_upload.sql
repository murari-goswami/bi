-- Name: tableau.ops_receivings_credit_note_upload
-- Created: 2015-04-24 18:20:33
-- Updated: 2015-04-24 18:20:33

CREATE view tableau.ops_receivings_credit_note_upload
AS
SELECT 
poa.purchase_order_id as po, 
poa.article_ean as ean, 
poa.stock_scanned as count_scans, 
poa.date_stock_handedover_max as max_date_given_to_serviceprovider, 
cu.stock_credit_note_no as credit_note_no, 
cu.stock_credit_note_qty as credit_note_quantity, 
cast(cu.date_stock_credit_note_receipt as date) as date_of_receipt, 
cast(cu.date_stock_credit_note_processed as date) as date_processed, 
cu.stock_credit_note_accountant as credit_accountant,
au.delivery_note_quantity_supplier, 
au.invoice_number, 
au.invoice_quantity, 
au.accounting_date, 
au.accountant as acctg_upload_accountant, 
poa.stock_ordered_revised as quantity, 
poa.stock_booked as fulfilled_quantity, 
poa.article_sales_price as retail_price, 
poa.article_cost as purchase_price, 
pim.brand
from bi.purchase_order_articles poa
left join raw.stock_credit_note cu 
on poa.purchase_order_id = cu.purchase_order_id and poa.article_ean = cu.article_ean 
left join raw.accounting_upload au 
on au.purchase_order_id = poa.purchase_order_id and au.ean = poa.article_ean
left join raw.article_detail_pim pim 
on pim.ean = poa.article_ean
where cu.stock_credit_note_no is not null
and driving_tbl_scan is not null


