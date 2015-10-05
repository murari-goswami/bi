-- Name: tableau.mkt_incoming_and_invoiced_orders_costs
-- Created: 2015-04-24 18:19:16
-- Updated: 2015-04-24 18:19:16

CREATE VIEW tableau.mkt_incoming_and_invoiced_orders_costs
AS
SELECT 
date_created,
country,
CASE 
	WHEN channel = 'google sem' THEN 'google sem nobrand'
	WHEN channel = 'google gdn' THEN 'display'
	WHEN channel in ('app download campaign', 'youtube') THEN 'other'
	ELSE channel
END as marketing_channel,
cost 
FROM raw.marketing_costs mc


