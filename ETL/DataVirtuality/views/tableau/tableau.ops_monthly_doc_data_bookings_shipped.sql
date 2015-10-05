-- Name: tableau.ops_monthly_doc_data_bookings_shipped
-- Created: 2015-04-24 18:17:50
-- Updated: 2015-04-24 18:17:50

CREATE view tableau.ops_monthly_doc_data_bookings_shipped
as
SELECT 
	cast(ddsc.date_created as date) as shipment_confirmation_date,
	sum(case when op.stock_location_id = 1 then cast(ddsc.quantity_shipped as integer) end) as quantity_stock_location_1,
	sum(case when op.stock_location_id = 2 then cast(ddsc.quantity_shipped as integer) end) as quantity_stock_location_2,
	sum(case when op.stock_location_id = 4 then cast(ddsc.quantity_shipped as integer) end) as quantity_stock_location_4
FROM postgres.doc_data_shipment_confirmation ddsc
join postgres.order_position op on op.order_id = ddsc.orderid and op.article_id = ddsc.outfittery_article_number
group by 1


