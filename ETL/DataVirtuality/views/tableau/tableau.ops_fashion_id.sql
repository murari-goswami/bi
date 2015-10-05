-- Name: tableau.ops_fashion_id
-- Created: 2015-04-24 18:20:08
-- Updated: 2015-04-24 18:20:08

CREATE view tableau.ops_fashion_id
AS
select 
poa.order_id,
coa.supplier_order_number as fashion_id_order_number, 
coa.stylist_date_picked,
min(poa.date_poa_created) as po_date_created,
max(poa.date_stock_booked_max) as max_date_booked,
poa.purchase_order_id,
sum(poa.stock_booked) as total_stock_mutations,
po.po_date_import_result,
po.stock_location_id,
count(distinct poa.poa_id) as amount_po_lines,
log.sales_order_header_created,
log.date_picklist_created,
log.date_backorder,
log.date_shipment_confirmation,
log.date_returned
FROM bi.purchase_order_articles poa
join bi.purchase_order po
on poa.purchase_order_id = po.purchase_order_id
join (select order_id, supplier_order_number, min(date_picked) as stylist_date_picked from bi.customer_order_articles group by 1,2) coa
on coa.order_id = poa.order_id
left join raw.customer_order_logistics log
on log.order_id = poa.order_id
where po.stock_location_id = 4
and driving_tbl_poa is not null
group by 1,2,3,6,8,9,11,12,13,14,15


