-- Name: bi.delivery_tracking
-- Created: 2015-04-24 18:19:18
-- Updated: 2015-09-09 12:36:34

CREATE VIEW bi.delivery_tracking
as

SELECT 
	row_number() over(partition by order_id,tracking_number order by date_created desc) as rank,
	id,
	date_created,
	tag,
	slug,
	active,
	order_id,
	parseTimestamp( created_at, 'yyyy-MM-dd HH:mm:ss.S' ) created_at,
	parseTimestamp( updated_at, 'yyyy-MM-dd HH:mm:ss.S' ) updated_at,
	delivery_time,
	shipment_type,
	tracked_count,
	tracking_number,
	origin_country_iso3,
	shipment_package_count
FROM raw.delivery_tracking


