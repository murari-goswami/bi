-- Name: raw.snowplow_optimizely_events
-- Created: 2015-07-28 11:26:33
-- Updated: 2015-07-30 11:36:53

CREATE VIEW raw.snowplow_optimizely_events
AS
WITH sp_data AS
(
SELECT
	domain_userid ||'-'|| domain_sessionidx as visitor_session_id,
	domain_userid as visitor_id,
	user_id,
	domain_sessionidx as session_count,
	MODIFYTIMEZONE(collector_tstamp,'UTC+1') as date_created,
	dense_rank() OVER (PARTITION BY domain_userid ||'-'|| domain_sessionidx, page_urlpath ORDER BY collector_tstamp DESC) as test_rank,
	page_urlpath as test_page_url,
	CASE 
		WHEN page_urlpath IN ('/', '/b/light', '/facebook') THEN 'Landing Page'
		WHEN page_urlpath LIKE '%pickCallAppointment%' THEN 'Pick Call Page'
		WHEN page_urlpath LIKE '%successScreen%' THEN 'Success Page'
		WHEN page_urlpath LIKE '%/previews/%' THEN 'Previews Page'
		WHEN page_urlpath LIKE '%/orders/create%' THEN 'Orders Create Page'
		WHEN page_urlpath LIKE '%/feedbacks' THEN 'Orders Feedback Page'
		ELSE 'Other'
	END as test_page_type,
	se_action as optimizely_test_name,
	se_label as optimizely_test_id,
	se_property as optimizely_variation_name,
	se_value as optimizely_variation_id
FROM raw.snowplow_events
WHERE event = 'struct'
AND se_category = 'optimizely test'
/* --Filter out own IP and bot traffic-- */
AND user_ipaddress NOT LIKE '213.61.116.%'
AND br_type != 'Robot'
/* --Filter out domain tracking mistakes-- */
AND ( page_urlhost = 'www.outfittery.de' OR page_urlhost = 'static.outfittery.de'  
OR page_urlhost = 'www.outfittery.at' OR page_urlhost = 'static.outfittery.at'  
OR page_urlhost = 'www.outfittery.ch' OR page_urlhost = 'static.outfittery.ch'  
OR page_urlhost = 'www.outfittery.nl' OR page_urlhost = 'static.outfittery.nl' 
OR page_urlhost = 'www.outfittery.be' OR page_urlhost = 'static.outfittery.be'  
OR page_urlhost = 'www.outfittery.lu' OR page_urlhost = 'static.outfittery.lu'  
OR page_urlhost = 'www.outfittery.dk' OR page_urlhost = 'static.outfittery.dk'  
OR page_urlhost = 'www.outfittery.no' OR page_urlhost = 'static.outfittery.no'  
OR page_urlhost = 'www.outfittery.se' OR page_urlhost = 'static.outfittery.se'  
OR page_urlhost = 'www.outfittery.com' OR page_urlhost = 'static.outfittery.com')
AND CAST(collector_tstamp as date) >= '2015-04'
)

SELECT
	DISTINCT
	visitor_session_id,
	visitor_id,
	user_id,
	session_count,
	date_created,
	test_page_url,
	test_page_type,
	optimizely_test_name,
	optimizely_test_id,
	optimizely_variation_name,
	optimizely_variation_id
FROM sp_data
WHERE test_rank = 1


