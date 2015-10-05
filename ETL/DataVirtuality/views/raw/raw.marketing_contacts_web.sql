-- Name: raw.marketing_contacts_web
-- Created: 2015-07-08 17:52:56
-- Updated: 2015-09-17 09:32:23

CREATE VIEW raw.marketing_contacts_web
AS


SELECT 
  order_id,
  contact_timestamp,
  marketing_channel,
  marketing_subchannel,
  source,
  medium,
  campaign,
  null as term,
  'Google Analytics' as data_source
FROM raw.marketing_contacts_ga
WHERE CAST(contact_timestamp as date) < '2015-05-24'
/* Fix for missing Snowplow data on 2015-08-24   */ 
OR CAST(contact_timestamp as date) = '2015-08-24'
/* Fix for missing Snowplow data since 2015-09-14   */ 
OR CAST(contact_timestamp as date) = '2015-09-14'
UNION
SELECT
  order_id,
  contact_timestamp,
  marketing_channel,
  marketing_subchannel,
  source,
  medium,
  campaign,
  term,
  'Snowplow' as data_source
FROM raw.marketing_contacts_snowplow
WHERE CAST(contact_timestamp as date) >= '2015-05-28'
AND CAST(contact_timestamp as date) != '2015-08-24'
/* Fix for missing Snowplow data since 2015-09-14   */ 
OR CAST(contact_timestamp as date) != '2015-09-14'


