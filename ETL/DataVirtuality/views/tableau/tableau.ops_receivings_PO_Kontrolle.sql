-- Name: tableau.ops_receivings_PO_Kontrolle
-- Created: 2015-04-24 18:20:33
-- Updated: 2015-04-24 18:20:33

CREATE view tableau.ops_receivings_PO_Kontrolle
AS
select  
    poa.purchase_order_id, 
    poa.article_ean as ean, 
    poa.article_id, 
    poa.stock_ordered_revised as updated_quantity, 
    poa.stock_ordered_initially as initial_quantity, 
    poa.stock_booked as fulfilled_quantity, 
    poa.article_cost as purchase_price,
    poa.article_sales_price as retail_price,
    cast(poa.date_poa_created as date) as purchase_order_date_created,
    poa.stock_invoiced as invoice_quantity,
    poa.stock_delivery_notes,
    pim.brand, 
    pim.supplier_article_name, 
    pim.supplier_color_code, 
    pim.supplier_color_name, 
    pim.supplier_length, 
    pim.eu_size, 
    pim.supplier_size, 
    pim.eu_length, 
    pim.supplier_sku,
    poa.stock_credit_note_qty,
    poa.stock_scanned as count_scans,
    poa.stock_scanned_ean_unknown_articles as count_ean_unknown,
    poa.stock_scanned_overdelivered_articles as count_overdelivered,
    poa.date_stock_delivered_max as max_date_delivered,
    poa.date_stock_handedover_max as max_date_given_to_serviceprovider
FROM bi.purchase_order_articles poa
LEFT JOIN raw.article_detail_pim pim on poa.article_ean = pim.ean
where driving_tbl_poa is not null


