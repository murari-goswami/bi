-- Name: raw.snowplow_transactions
-- Created: 2015-04-24 18:17:53
-- Updated: 2015-07-08 18:17:56

CREATE VIEW raw.snowplow_transactions 
AS
SELECT
	bc.domain_userid as visitor_id,
	bc.user_id,
	bc.session_count,
	bc.visitor_session_id,
	bc.tr_orderid as order_id,
	bc.collector_tstamp as date_created,
	bc.marketing_channel,
	bc.source,
	bc.medium,
	bc.campaign,
	bc.domain,
	bc.device_type,
	bc.br_family,
	bc.br_type,
	bc.os_name,
	bc.os_family,
	de.collector_tstamp as date_created_previous_order
FROM
(
	SELECT
		ab.domain_userid,
		ab.session_count,
		ab.user_id,
		ab.tr_orderid,
		ab.collector_tstamp,
		ab.visitor_session_id,
		ab.marketing_channel,
		ab.source,
		ab.medium,
		ab.campaign,
		ab.domain,
		ab.device_type,
		ab.br_family,
		ab.br_type,
		ab.os_name,
		ab.os_family,
		dense_rank() OVER (PARTITION BY ab.domain_userid ORDER BY ab.collector_tstamp ASC) as order_count
	FROM
	(
		SELECT
			DISTINCT 
			sp.domain_userid,
			sp.domain_sessionidx as session_count,
			sp.user_id,
			sp.tr_orderid,
			sp.domain_userid ||'-'|| sp.domain_sessionidx as visitor_session_id,
			TIMESTAMPADD(SQL_TSI_HOUR, 2, sp.collector_tstamp) as collector_tstamp,
			vi.marketing_channel,
			vi.source,
			vi.medium,
			vi.campaign,
			vi.domain,
			vi.device_type,
			vi.br_family,
			vi.br_type,
			vi.os_name,
			vi.os_family,
			dense_rank() OVER (PARTITION BY sp.tr_orderid ORDER BY sp.collector_tstamp ASC) as order_rank_asc			
			FROM raw.snowplow_events sp
			LEFT JOIN raw.snowplow_visits vi ON vi.visitor_session_id = sp.domain_userid ||'-'|| sp.domain_sessionidx
		WHERE event = 'transaction'
		AND tr_orderid IS NOT NULL
		/* --Filter out own IP and bot traffic-- */
		AND sp.user_ipaddress NOT LIKE '213.61.116.%'
		AND sp.br_type != 'Robot'
		AND CAST(sp.collector_tstamp as date) >= '2015-04'
	) ab
WHERE ab.order_rank_asc = 1
) bc
LEFT JOIN 
(
	SELECT
		cd.domain_userid,
		cd.user_id,
		cd.tr_orderid,
		cd.collector_tstamp,
		dense_rank() OVER (PARTITION BY cd.domain_userid ORDER BY cd.collector_tstamp ASC) as order_count
	FROM
	(
		SELECT 
			domain_userid,
			user_id,
			tr_orderid,
			TIMESTAMPADD(SQL_TSI_HOUR, 2, collector_tstamp) as collector_tstamp,
			dense_rank() OVER (PARTITION BY tr_orderid ORDER BY collector_tstamp ASC) as order_rank_asc
			FROM raw.snowplow_events
		WHERE event = 'transaction'
		AND tr_orderid IS NOT NULL
		/* --Filter out own IP and bot traffic-- */
		AND user_ipaddress NOT LIKE '213.61.116.%'
		AND br_type != 'Robot'
		AND CAST(collector_tstamp as date) >= '2015-04'
	) cd
	WHERE cd.order_rank_asc = 1
) de ON bc.domain_userid = de.domain_userid AND bc.order_count = (de.order_count+1)


