-- Name: raw.marketing_contacts_tv
-- Created: 2015-04-24 18:17:50
-- Updated: 2015-07-21 14:00:34

CREATE VIEW raw.marketing_contacts_tv
AS
SELECT 
	cast(order_id as long) as order_id,
	MODIFYTIMEZONE(tv.airingtime,'UTC+1') as contact_timestamp,
	'TV' as marketing_channel,
	'Commercial' as format,
	LOWER(tv.spotstation) as tv_spot_station,
	LOWER(tv.program_before) as tv_program,
	LOWER(tv.spotname) as tv_spot_name
FROM "dwh"."marketing_tv" tv


