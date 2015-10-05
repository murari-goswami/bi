-- Name: raw.ga_visits
-- Created: 2015-04-24 18:19:17
-- Updated: 2015-04-24 18:19:17

CREATE VIEW raw.ga_visits
AS
SELECT
  vi2.date_created,
  vi2.country as domain,
  vi2.source,
  vi2.medium,
  vi2.campaign,
  vi2.devicecategory,
  ga.source_medium_campaign,
  ga.marketing_subchannel,
  ga.marketing_channel,
  SUM(vi2.visits) as visits
FROM 
(
  SELECT
    vi.date_created,
    vi.country,
    vi.source,
    vi.medium,
    vi.campaign,
    vi.devicecategory,
    IFNULL(vi.visits,0) as "visits"
  FROM dwh.ga_visits vi
) vi2
LEFT JOIN raw.ga_channel_logic ga ON ga.source_medium_campaign = lower(vi2.source)|| ' / ' || lower(vi2.medium) || ' / ' || lower(vi2.campaign)
GROUP BY 1,2,3,4,5,6,7,8,9


