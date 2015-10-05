-- Name: views.campaign_cost
-- Created: 2015-04-24 18:17:42
-- Updated: 2015-04-24 18:17:42

CREATE view views.campaign_cost
as
SELECT
	cast(date_created as date) as date_created,
	country,
    source as channel,
	campaign,
	sum(adcosts) as "costs"
FROM dwh.ga_adcosts 
GROUP BY 1,2,3,4
UNION ALL
SELECT
	cast(datecreated as date) as date_created,
	LEFT(campaign,2) as country,
	channel,
	campaign,
	sum(cast(costs as double)) as "costs"
FROM "dwh.campaigncost" 
GROUP BY 1,2,3,4


