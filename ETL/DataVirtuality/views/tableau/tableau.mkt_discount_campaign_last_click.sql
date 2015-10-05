-- Name: tableau.mkt_discount_campaign_last_click
-- Created: 2015-08-18 14:48:22
-- Updated: 2015-08-18 14:48:22

CREATE VIEW tableau.mkt_discount_campaign_last_click
AS

SELECT 
	dc.order_id,
	dc.marketing_channel,
	dc.marketing_campaign,
	CASE
		WHEN lc.marketing_channel_last_click is null THEN 'Untracked'
		ELSE lc.marketing_channel_last_click
	END AS marketing_channel_last_click
FROM raw.marketing_contacts_discounts dc
LEFT JOIN
(
	SELECT
		order_id,
		marketing_channel as marketing_channel_last_click
	FROM
	(
		SELECT 
			order_id,
			contact_timestamp,
			marketing_channel,
			RANK () OVER (PARTITION BY order_id ORDER BY contact_timestamp DESC) as contact_count_desc
		FROM raw.marketing_contacts_web
	) ab
	WHERE contact_count_desc = 1	
) lc ON lc.order_id = dc.order_id


