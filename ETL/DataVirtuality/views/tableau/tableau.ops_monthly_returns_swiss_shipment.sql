-- Name: tableau.ops_monthly_returns_swiss_shipment
-- Created: 2015-04-24 18:20:45
-- Updated: 2015-04-24 18:20:45

CREATE view tableau.ops_monthly_returns_swiss_shipment
as
SELECT 
	co.order_id,
	co.customer_id,
	co.date_shipped,
	co.order_state_number,
	log.track_and_trace_number,
	log.shipment_confirmation_date,
	log.return_date
FROM bi.customer_order co
LEFT JOIN 
(SELECT 
	order_id,
	cast(shipment_confirmation_date as date) as shipment_confirmation_date,
	cast(return_date as date) as return_date,
	track_and_trace_number
FROM raw.customer_order_articles_logistics log
) log on log.order_id = co.order_id
where 
co.order_state_number >=24
and co.shipping_country = 'CH'
and log.track_and_trace_number is not null


