-- Name: tableau.ops_monthly_doc_data_bookings_stock_mutations
-- Created: 2015-04-24 18:20:44
-- Updated: 2015-04-24 18:20:44

CREATE view tableau.ops_monthly_doc_data_bookings_stock_mutations
as
SELECT 
sm.article_id,
poa.article_ean,  
sm.date_stock_booked, 
sm.purchase_order_id, 
sm.stock_booking_code,
cast(sm.stock_booked as integer) as stock_booked,
cast(sm.supplier_id as integer) as supplier_id
FROM bi.stock_booked sm
left join 
(select 
  distinct p.article_ean, 
  p.article_id 
  FROM bi.purchase_order_articles p
) poa
ON poa.article_id = sm.article_id


