-- Name: tableau.snowplow_sanity_check
-- Created: 2015-05-20 16:34:44
-- Updated: 2015-08-28 17:28:22

CREATE VIEW tableau.snowplow_sanity_check
AS
SELECT
	ca."date",
	im.imported_rows,
	ga.ga_visits,
	sp.sp_visits			
FROM dwh.calendar ca
LEFT JOIN
(
	SELECT 
		CAST(etl_tstamp as date) AS "date",
		COUNT(event_id) as imported_rows
	FROM snowplow.events
	GROUP BY 1
) im on ca."date" = im."date"
LEFT JOIN
(
	SELECT
		date_created,
		SUM(visits) as ga_visits
	FROM dwh.ga_visits
	WHERE country != 'ALL'
	GROUP BY 1
) ga ON ga.date_created = ca."date"
LEFT JOIN
(
	SELECT
		CAST(MODIFYTIMEZONE(collector_tstamp,'GMT','GMT-2') as date) as date_created,
		COUNT(DISTINCT (domain_userid || domain_sessionidx)) as sp_visits
	FROM raw.snowplow_events 
	GROUP BY 1
) sp ON sp.date_created = ca."date"
WHERE ca."date" < CURDATE()
AND ca."date" >= '2015-04-01'


