-- Name: tableau.ops_999997_bookings
-- Created: 2015-04-24 18:20:52
-- Updated: 2015-06-12 11:05:57

CREATE view tableau.ops_999997_bookings
as 
select
sm.article_id,
a.article_ean,
sm.date_stock_booked,
sm.stock_booked,
sm.supplier_id,
sm.stock_booking_packing_slip_number,
min(a.article_sales_price_de) as article_sales_price_de,
min(a.article_cost) as article_cost
FROM bi.stock_booked sm
join bi.article a
on a.article_id = sm.article_id
WHERE supplier_id = '999997' 
/* or supplier_id = '999987' 
or supplier_id = '25' */
group by 1,2,3,4,5,6


