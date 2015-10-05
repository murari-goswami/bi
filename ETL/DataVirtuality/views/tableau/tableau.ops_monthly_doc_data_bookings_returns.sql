-- Name: tableau.ops_monthly_doc_data_bookings_returns
-- Created: 2015-04-24 18:17:48
-- Updated: 2015-04-24 18:17:48

CREATE view tableau.ops_monthly_doc_data_bookings_returns
as
SELECT 
	cast(ddr.date_created AS DATE) AS doc_data_date_returned, 
	sum(case when op.stock_location_id = 1 then cast(ddr.number_of_articles_return as integer) end) as quantity_stock_location_1,
	sum(case when op.stock_location_id = 2 then cast(ddr.number_of_articles_return as integer) end) as quantity_stock_location_2,
	sum(case when op.stock_location_id = 4 then cast(ddr.number_of_articles_return as integer) end) as quantity_stock_location_4
FROM postgres.doc_data_return ddr 
join postgres.order_position op on op.order_id = ddr.original_orderid and op.article_id = ddr.outfittery_article_number
WHERE  processing_reason IS NULL
group by 1


