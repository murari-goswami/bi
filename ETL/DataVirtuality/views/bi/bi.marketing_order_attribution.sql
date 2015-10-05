-- Name: bi.marketing_order_attribution
-- Created: 2015-04-24 18:25:08
-- Updated: 2015-09-08 10:26:49

CREATE VIEW bi.marketing_order_attribution
AS

SELECT 
	co.order_id,
	CASE 
		WHEN ma.contact_timestamp is null THEN co.date_incoming
		ELSE ma.contact_timestamp
	END AS contact_timestamp,
	CASE
		WHEN ma.marketing_channel is null THEN 'Untracked'
		ELSE ma.marketing_channel
	END as marketing_channel,
	ma.marketing_subchannel,
	ma.source,
	ma.medium,
	ma.term,
	ma.marketing_campaign,
	ma.contact_type,
	CASE
		WHEN ma.marketing_channel is null THEN CAST(1 as DECIMAL (12,5))
		ELSE cast(ma.contact_weight as DECIMAL(12,5))
	END as contact_weight
FROM bi.customer_order co
LEFT JOIN 
(
	SELECT 
			mc.order_id,
			mc.contact_timestamp,
			mc.marketing_channel,
			mc.marketing_subchannel,
			mc.source,
			mc.medium,
			mc.marketing_campaign,
			mc.contact_type,
			mc.term,
			/* Attribution logic */
			CASE 
				WHEN mc2.max_contact_count = 1 THEN 1
				WHEN mc2.max_contact_count = 2 THEN 0.5
				WHEN mc2.max_contact_count > 2 AND mc.contact_count_asc = 1 THEN 0.4
				WHEN mc2.max_contact_count > 2 AND mc.contact_count_asc = mc2.max_contact_count THEN 0.4
				ELSE 0.2/(mc2.max_contact_count-2)			
			END AS contact_weight
		FROM bi.marketing_contacts mc
		LEFT JOIN 
		(
		SELECT 
			order_id,
			MAX(contact_count_asc) as max_contact_count
		FROM bi.marketing_contacts
		GROUP BY 1
		) mc2 ON mc2.order_id = mc.order_id
) ma ON ma.order_id = co.order_id
WHERE (co.order_type = 'First Order' OR co.order_type = 'Repeat Order')


