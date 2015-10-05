-- Name: raw.marketing_costs_per_voucher_campaign
-- Created: 2015-07-07 13:52:25
-- Updated: 2015-07-20 14:36:21

CREATE VIEW raw.marketing_costs_per_voucher_campaign
AS

SELECT
	co.date_created,
	co.country,
	co.marketing_channel,
	co.campaign_title,
	co.daily_costs,
	sp.daily_spread
FROM
(
	SELECT
	 	ca.date_created,
	 	dc.country,
	 	dc.marketing_channel,
	 	dc.campaign_title,
	 	dc.daily_costs
	FROM
	(
		SELECT
			"date" as date_created
		FROM "dwh.calendar" 
		WHERE "date" >= '2014-01-01'	
	) ca
	CROSS JOIN
	(
		SELECT 
			campaign_title,
			marketing_channel,
			country,
			daily_costs 
		FROM raw.marketing_voucher_campaign_details
	) dc
	LEFT JOIN raw.marketing_voucher_campaign_details vc ON vc.campaign_title = dc.campaign_title
	WHERE ca.date_created >= vc.promotion_start
	AND ca.date_created <= vc.cost_reporting_date
	AND dc.daily_costs is not null
	ORDER BY 1,2
) co
LEFT JOIN 
(
	SELECT
	 	ca.date_created,
	 	dc.country,
	 	dc.marketing_channel,
	 	dc.campaign_title,
	 	dc.daily_spread
	FROM
		(
			SELECT
				"date" as date_created
			FROM "dwh.calendar" 
			WHERE "date" >= '2014-01-01'	
		) ca
	CROSS JOIN
	(
		SELECT 
			campaign_title,
			marketing_channel,
			country,
			daily_spread
		FROM raw.marketing_voucher_campaign_details
	) dc
	LEFT JOIN raw.marketing_voucher_campaign_details vc ON vc.campaign_title = dc.campaign_title
	WHERE ca.date_created >= vc.promotion_start
	AND ca.date_created <= vc.promotion_end
	AND dc.daily_spread is not null
	ORDER BY 1,2
) sp ON sp.date_created = co.date_created AND sp.country = co.country AND sp.marketing_channel = co.marketing_channel AND sp.campaign_title = co.campaign_title


