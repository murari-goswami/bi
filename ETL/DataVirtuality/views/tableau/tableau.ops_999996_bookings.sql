-- Name: tableau.ops_999996_bookings
-- Created: 2015-04-24 18:20:03
-- Updated: 2015-04-24 18:20:03

CREATE view tableau.ops_999996_bookings
as 
select
sm.article_id,
a.article_ean,
sm.date_stock_booked,
sm.stock_booked,
sm.stock_booking_packing_slip_number,
min(a.article_sales_price_de) as article_sales_price_de,
min(a.article_cost) as article_cost
FROM bi.stock_booked sm
join bi.article a
on a.article_id = sm.article_id
WHERE supplier_id = '999996'
group by 1,2,3,4,5


