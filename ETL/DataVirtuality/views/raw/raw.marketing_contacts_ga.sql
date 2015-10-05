-- Name: raw.marketing_contacts_ga
-- Created: 2015-04-24 18:20:31
-- Updated: 2015-07-08 17:24:07

CREATE VIEW raw.marketing_contacts_ga 
AS
SELECT
 	ga2.order_id,
 	ga2.contact_timestamp,
 	ga2.marketing_channel,
 	ga2.marketing_subchannel,
 	ga2.source,
 	ga2.medium,
 	ga2.campaign,
 	ga2.marketing_campaign
FROM 
(
	SELECT 
		co.order_id,
		parseTIMESTAMP(ga.date_created || ' ' || parseTIME(ga.hour_created, 'H'), 'yyyy-MM-dd H:mm:ss') as contact_timestamp,
		ga.marketing_channel,
		ga.marketing_subchannel,
		ga.source,
		ga.medium,
		ga.campaign,
		ga.source_medium_campaign as marketing_campaign,		
		CASE 
			WHEN parseTIMESTAMP(ga.date_created || ' ' || parseTIME(ga.hour_created, 'H'), 'yyyy-MM-dd H:mm:ss') < co.date_incoming THEN 1
			ELSE 0
		END as contact_before_incoming,
	/* --Highlights  contacts that were placed before date_stylist_picked-- */
		CASE 
			WHEN parseTIMESTAMP(ga.date_created || ' ' || parseTIME(ga.hour_created, 'H'), 'yyyy-MM-dd H:mm:ss') < co.date_stylist_picked THEN 1
			ELSE 0
			END as contact_before_date_stylist_picked
	FROM bi.customer_order co
	LEFT JOIN 
	(
	SELECT 
      DISTINCT 
      utm.date_created,
      utm.hour_created,
      utm.transaction_id, 
      utm.source, 
      utm.medium, 
      utm.campaign, 
      lower(utm.source)|| ' / ' || lower(utm.medium) || ' / ' || lower(utm.campaign) as source_medium_campaign,
      lo.marketing_subchannel,
      lo.marketing_channel
    FROM "dwh.ga_information_utm" utm
    left join raw.ga_channel_logic lo ON  lower(utm.source)|| ' / ' || lower(utm.medium) || ' / ' || lower(utm.campaign) = lo.source_medium_campaign
	) ga
	ON co.order_id = ga.transaction_id
	)ga2
WHERE (ga2.contact_before_incoming = 1
OR (ga2.contact_before_incoming = 0 AND ga2.contact_before_date_stylist_picked = 1))


