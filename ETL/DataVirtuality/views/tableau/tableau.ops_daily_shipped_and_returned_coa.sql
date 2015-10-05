-- Name: tableau.ops_daily_shipped_and_returned_coa
-- Created: 2015-04-24 18:20:12
-- Updated: 2015-04-24 18:20:12

CREATE view tableau.ops_daily_shipped_and_returned_coa
as 
SELECT 
coa.order_id,
coa.article_id,
coa.date_shipped,
coa.date_returned,
co.shipping_country,
coa.stock_location_id,
coa.supplier_article_id
FROM bi.customer_order_articles coa
left join bi.customer_order co on coa.order_id = co.order_id


