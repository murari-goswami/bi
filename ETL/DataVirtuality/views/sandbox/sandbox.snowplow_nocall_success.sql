-- Name: sandbox.snowplow_nocall_success
-- Created: 2015-05-06 16:30:35
-- Updated: 2015-05-07 09:36:44

CREATE VIEW sandbox.snowplow_nocall_success
AS

SELECT * FROM
(
	SELECT
	row_number() over(partition by tr_orderid order by collector_tstamp desc) as rank,
	tr_orderid,
	collector_tstamp,
	user_id,
	page_url,
	page_referrer,
	page_urlpath,
	refr_urlquery
	FROM snowplow.events where 
	tr_orderid is not null
)a 
WHERE a.rank=1


