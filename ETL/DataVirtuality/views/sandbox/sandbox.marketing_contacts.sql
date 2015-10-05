-- Name: sandbox.marketing_contacts
-- Created: 2015-04-24 18:17:45
-- Updated: 2015-04-24 18:17:45

CREATE VIEW sandbox.marketing_contacts
AS
SELECT
    CAST(u.transaction_id as long) as order_id,
    u.date_created,
    u.hour_created,
    rank() OVER (PARTITION BY u.transaction_id ORDER BY u.date_created ASC, u.hour_created ASC) as visit_count_asc,  
    rank() OVER (PARTITION BY u.transaction_id ORDER BY u.date_created DESC, u.hour_created DESC) as visit_count_desc,    
    u.country,
    lower(u.source) as source,
    lower(u.medium) as medium,
    lower(u.source) || ' / ' || lower(u.medium) as source_medium,
    lower(u.campaign) as campaign
FROM 
(
	SELECT date_created,hour_created,transaction_id,
	MAX(country) as country,
	COALESCE(MAX(CASE WHEN source = '(direct)' THEN NULL ELSE source END), '(direct)') as source,
	COALESCE(MAX(CASE WHEN medium = '(none)' THEN NULL ELSE medium END), '(none)') as medium,
	COALESCE(MAX(CASE WHEN campaign = '(not set)' THEN NULL ELSE campaign END), '(not set)') as campaign 
	FROM dwh.ga_information_utm
	GROUP BY 1,2,3
) u
                                                                                                                                                                                          LIMIT 1000000000


