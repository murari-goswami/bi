-- Name: raw.daily_visits
-- Created: 2015-06-18 17:31:35
-- Updated: 2015-09-17 09:38:45

CREATE view raw.daily_visits
AS
SELECT 
    ga.date_created, 
    domain, 
    null as geo_country,
    source,
    medium, 
    campaign,
    null as term,
    devicecategory, 
    marketing_subchannel, 
    marketing_channel,
    CASE 
    WHEN marketing_channel = 'Direct' THEN 'direct'
    WHEN marketing_channel = 'SEM Non-brand' THEN 'google sem nobrand'
    WHEN marketing_channel = 'CRM' THEN 'crm'
    WHEN marketing_channel = 'Cooperations' THEN 'kooperation'
    WHEN marketing_channel = 'Facebook' THEN 'facebook'
    WHEN marketing_channel = 'SEO' THEN 'organic'
    WHEN marketing_channel = 'Display' THEN 'display'
    WHEN marketing_channel = 'Affiliate' THEN 'affiliate'
    WHEN marketing_channel = 'SEM Brand' THEN 'google sem brand'
    WHEN marketing_channel = 'Social Media' THEN 'social media'
    WHEN marketing_channel = 'Remarketing' THEN 'remarketing'
    WHEN marketing_channel = 'Referral Program' THEN 'praemienprogramm'
  END AS channel,  
  visits, 
  'Google Analytics' as data_source
FROM raw.ga_visits ga
LEFT JOIN (SELECT CAST(date_created as date) as date_created FROM "raw.snowplow_visits" WHERE CAST(date_created as date) >= '2015-05-28' AND /* Until Snowplow data is fixed */ CAST(date_created as date) != '2015-08-24' AND /* Snowplow broken as of 14-09-2015 */ CAST(date_created as date) != '2015-09-14' GROUP BY 1) vi ON ga.date_created = vi.date_created
WHERE vi.date_created is null
AND domain != 'ALL'
AND ga.date_created < CURDATE()
UNION
SELECT 
    CAST(sp.date_created as date) as date_created, 
    domain,
    geo_country, 
    source,
    medium, 
    campaign, 
    term, 
    CASE 
      WHEN device_type = 'Computer' THEN 'desktop'
        WHEN device_type = 'Mobile' THEN 'mobile'
        WHEN device_type = 'Tablet' THEN 'tablet'   
    END AS devicecategory,
    null as  marketing_subchannel,
    marketing_channel,
    CASE 
    WHEN marketing_channel = 'Direct' THEN 'direct'
    WHEN marketing_channel = 'SEM Non-brand' THEN 'google sem nobrand'
    WHEN marketing_channel = 'CRM' THEN 'crm'
    WHEN marketing_channel = 'Cooperations' THEN 'kooperation'
    WHEN marketing_channel = 'Facebook' THEN 'facebook'
    WHEN marketing_channel = 'SEO' THEN 'organic'
    WHEN marketing_channel = 'Display' THEN 'display'
    WHEN marketing_channel = 'Affiliate' THEN 'affiliate'
    WHEN marketing_channel = 'SEM Brand' THEN 'google sem brand'
    WHEN marketing_channel = 'Social Media' THEN 'social media'
    WHEN marketing_channel = 'Remarketing' THEN 'remarketing'
    WHEN marketing_channel = 'Referral Program' THEN 'praemienprogramm'
  END AS channel, 
    COUNT(visitor_session_id) as visits,
    'Snowplow' as data_source
FROM raw.snowplow_visits sp 
LEFT JOIN (SELECT CAST(date_created as date) as date_created FROM "raw.snowplow_visits" WHERE  CAST(date_created as date) >= '2015-05-28' AND /* Until Snowplow data is fixed */ CAST(date_created as date) != '2015-08-24' AND /* Snowplow broken as of 14-09-2015 */ CAST(date_created as date) != '2015-09-14'  GROUP BY 1) vi ON CAST(sp.date_created as date) = vi.date_created
WHERE vi.date_created is not null
AND sp.date_created < CURDATE()
GROUP BY 1,2,3,4,5,6,7,8,9,10,11,13


