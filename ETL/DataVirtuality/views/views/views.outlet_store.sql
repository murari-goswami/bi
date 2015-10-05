-- Name: views.outlet_store
-- Created: 2015-04-24 18:18:34
-- Updated: 2015-04-24 18:18:34

create view views.outlet_store
as
select
	cast(po.ean as string) as ean, 
	po.initialquantity,
	po.quantity, 
	po.startdate,
	po.enddate,
	po.date_uploaded as po_date_created,
	we.supplier_sku, 
	we.brand, 
	we.article_name, 
	we.price_sold, 
	we.vat,
	we.bestand, 
	we.purchase_price, 
	we.stock_min, 
	we.reorder_point, 
	we.date_uploaded as we_date_created,
	cast(we.ean as string) as we_ean,
	sold.quantity_sold,
	sold.date_uploaded as sold_date_created,
	sold.purchase_price as sold_purchase_price,
	sold.price_sold as sold_price_sold,
	a.purchase_price as article_purchase_price, 
	cast(a.price_retail_de as double) as article_price_retail
	from dwh.outlet_po po 
	left join dwh.outlet_wareneingang we on we.ean = po.ean
	left join dwh.outlet_sold sold on sold.ean = po.ean
	left join views.article a on a.ean = po.ean


