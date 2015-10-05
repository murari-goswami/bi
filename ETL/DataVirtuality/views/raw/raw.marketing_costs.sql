-- Name: raw.marketing_costs
-- Created: 2015-04-24 18:17:45
-- Updated: 2015-07-13 14:17:56

CREATE VIEW "raw.marketing_costs" 
AS

SELECT
    date_created,
    country,
    channel,
    marketing_channel,
    SUM(cost) as cost
FROM
(
SELECT
      CAST(mco.date_created as date) as date_created,
      mco.country as country,
      CASE
        WHEN mco.channel= 'gdn' THEN 'google gdn'
        WHEN mco.channel= 'sem' THEN 'google sem'
        WHEN mco.channel= 'display' THEN 'display'
        WHEN mco.channel= 'facebook' THEN 'facebook'
        WHEN mco.channel= 'affiliate' THEN 'affiliate'
        WHEN mco.channel= 'crm' THEN 'crm'
        WHEN mco.channel= 'kooperationen' THEN 'kooperation'
        WHEN mco.channel= 'referral' THEN 'praemienprogramm'
        WHEN mco.channel= 'remarketing' THEN 'remarketing'
        WHEN mco.channel= 'seo/direct' THEN 'seo/direct'
        WHEN mco.channel= 'tv' THEN 'tv'
        WHEN mco.channel= 'twitter' THEN 'twitter' 
        WHEN mco.channel= 'youtube' THEN 'youtube'
        WHEN mco.channel= 'sem_brand' THEN 'google sem brand'
        WHEN mco.channel= 'sem_nobrand' THEN 'google sem nobrand'
        WHEN mco.channel= 'appdownload' THEN 'app download campaign'
        WHEN mco.channel= 'offline_promotions' THEN 'Offline_Promotions'
        WHEN mco.channel= 'linkedin' THEN 'LinkedIn'
        WHEN mco.channel= 'xing' THEN 'Xing'
        WHEN mco.channel= 'insert' THEN 'Insert'
    END as channel,
        CASE
        WHEN mco.channel= 'gdn' THEN 'Display'
        WHEN mco.channel= 'sem' THEN 'SEM Non-brand'
        WHEN mco.channel= 'display' THEN 'Display'
        WHEN mco.channel= 'facebook' THEN 'Facebook'
        WHEN mco.channel= 'affiliate' THEN 'Affiliate'
        WHEN mco.channel= 'crm' THEN 'CRM'
        WHEN mco.channel= 'kooperationen' THEN 'Cooperations'
        WHEN mco.channel= 'referral' THEN 'praemienprogramm'
        WHEN mco.channel= 'remarketing' THEN 'Remarketing'
        WHEN mco.channel= 'seo/direct' THEN 'SEO'
        WHEN mco.channel= 'tv' THEN 'TV'
        WHEN mco.channel= 'twitter' THEN 'Social Media' 
        WHEN mco.channel= 'youtube' THEN 'Social Media'
        WHEN mco.channel= 'sem_brand' THEN 'SEM Brand'
        WHEN mco.channel= 'sem_nobrand' THEN 'SEM Non-brand'
        WHEN mco.channel= 'appdownload' THEN 'App campaign'
        WHEN mco.channel= 'offline_promotions' THEN 'Offline Promotions'
        WHEN mco.channel= 'linkedin' THEN 'Social Media'
        WHEN mco.channel= 'xing' THEN 'Xing'
        WHEN mco.channel= 'insert' THEN 'Inserts'
      END as marketing_channel,
      CASE 
        WHEN country NOT IN ('CH','AT') AND mco.channel IN ('insert', 'kooperation') AND CAST(mco.date_created as date) >= '2015-05-01' THEN null
        WHEN country IN ('CH','AT') AND mco.channel IN ('insert', 'kooperation') AND CAST(mco.date_created as date) >= '2015-07-13' THEN null
        ELSE CAST(mco.costs as double)/e.exchange_rate 
      END as cost
    FROM 
    (
      SELECT
        row_number() over (partition by "datecreated" || "country" || "channel" || "costs" || "currency" order by "datecreated" desc) as "rnum",
        replace(cast(datecreated as date),' ','') as date_created,
        replace(country,' ','') as "country",
        lower(replace(channel,' ','')) as "channel",
        replace(cast(costs as double),' ','') as "costs",
        replace(currency,' ','') as "currency"
    FROM dwh.marketingcost 
    ) mco
    JOIN dwh.historical_exchange_rates e on e.currency_code = mco.currency AND e.date = mco.date_created
    WHERE mco.rnum = 1
UNION 
	SELECT 
	    date_created,
	    country,
	    CASE
	        WHEN marketing_channel = 'Cooperations' THEN 'kooperation'
	        WHEN marketing_channel = 'Affiliate' THEN 'affiliate'
	        WHEN marketing_channel = 'Inserts' THEN 'Insert'   
	    END as channel,
	    marketing_channel,
	    SUM(
	    	CASE 
	    	WHEN country IN ('CH','AT') AND date_created <= '2015-07-13' THEN null
	    	ELSE daily_costs END) as cost
	FROM raw.marketing_costs_per_voucher_campaign mc
	WHERE date_created >= '2015-05-01'
	GROUP BY 1,2,3,4
) ac
GROUP BY 1,2,3,4


