-- Name: raw.marketing_contacts_snowplow
-- Created: 2015-04-24 18:19:28
-- Updated: 2015-09-02 15:52:20

CREATE VIEW raw.marketing_contacts_snowplow
AS


SELECT
	ab.order_id,
	vi.date_created as contact_timestamp,
	vi.visitor_session_id,
	marketing_channel,
	marketing_subchannel,
	LOWER(source) as source,
	LOWER(medium) as medium,
	LOWER(campaign) as campaign,
	LOWER(term) as term
FROM(
	SELECT 
		tr.visitor_id,
		tr.user_id,
		tr.order_id,
		tr.date_created,
		CASE
			WHEN tr.date_created_previous_order is null THEN '2014-01-01'
			ELSE tr.date_created_previous_order
		END AS date_created_previous_order
	FROM raw.snowplow_transactions tr
) ab
LEFT JOIN raw.snowplow_visits vi ON vi.visitor_id = ab.visitor_id
WHERE vi.date_created < ab.date_created
AND  vi.date_created >= ab.date_created_previous_order


