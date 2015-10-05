-- Name: views.outlet_store_sold
-- Created: 2015-04-24 18:18:54
-- Updated: 2015-04-24 18:18:54

create view views.outlet_store_sold
as
select
	cast(sold.ean as string) as ean, 
	sold.quantity_sold,
	sold.date_uploaded as sold_date_created,
	sold.purchase_price as sold_purchase_price,
	sold.price_sold as sold_price_sold,
	a.purchase_price as article_purchase_price, 
	cast(a.price_retail_de as double) as article_price_retail,
	a.article_title, 
	a.article_brand
	from  dwh.outlet_sold sold 
	left join views.article a on a.ean = sold.ean


