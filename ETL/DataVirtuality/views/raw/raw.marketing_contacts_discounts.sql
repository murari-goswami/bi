-- Name: raw.marketing_contacts_discounts
-- Created: 2015-04-24 18:20:34
-- Updated: 2015-07-22 14:50:31

CREATE VIEW raw.marketing_contacts_discounts
AS

SELECT 
	co.order_id,
	co.date_incoming as contact_timestamp,
	cam.marketing_channel as marketing_channel,
	CASE
		WHEN cam.marketing_channel = 'Referral Program' AND (cam.marketing_subchannel = 'Employees' OR LOWER(cam.marketing_campaign) LIKE '%employee%') THEN 'Employees'
		WHEN cam.marketing_channel = 'Referral Program' AND (cam.marketing_subchannel = 'Boxes' OR LOWER(cam.marketing_campaign) NOT LIKE '%employee%') THEN 'Boxes'
		WHEN cam.marketing_channel = 'Affiliate' AND (cam.marketing_subchannel = 'Platform' OR LOWER(cam.marketing_campaign) NOT LIKE '%cb%' AND LOWER(cam.marketing_campaign) NOT LIKE '%benefits%') THEN 'Platform'
		WHEN cam.marketing_channel = 'Affiliate' AND (cam.marketing_subchannel = 'Corporate Benefit Program' OR LOWER(cam.marketing_campaign) LIKE '%cb%' OR LOWER(cam.marketing_campaign) LIKE '%benefits%') THEN 'Corporate Benefit Program'
		WHEN cam.marketing_channel = 'Cooperations' AND (cam.marketing_subchannel = 'B2B' OR LOWER(cam.marketing_campaign) LIKE '%b2b%') THEN 'B2B'
		WHEN cam.marketing_channel = 'Cooperations' AND (cam.marketing_subchannel = 'Print Ads' OR LOWER(cam.marketing_campaign) LIKE '%print%') THEN 'Print Ads'
		WHEN cam.marketing_channel = 'Cooperations' AND (cam.marketing_subchannel = 'Offline Promo' OR LOWER(cam.marketing_campaign) LIKE '%promo%') THEN 'Offline Promo'
		WHEN cam.marketing_channel = 'Cooperations' AND (cam.marketing_subchannel = 'Newsletter' OR LOWER(cam.marketing_campaign) LIKE '%_nl_%') THEN 'Newsletter'
		WHEN cam.marketing_channel = 'Offline Promotions' THEN 'Offline Promotions'
		ELSE cam.campaign_type
	END AS marketing_sub_channel,
	cam.cluster,
	cam.publisher,
	CASE
		WHEN ca.campaign_title is null THEN 'Voucher campaign'
		ELSE ca.campaign_title
	END AS marketing_campaign
FROM bi.customer_order co
LEFT JOIN raw.discount_campaigns  ca on co.campaign_id = ca.campaign_id
LEFT JOIN 
(
	SELECT
		ca.campaign_id,
		CASE
			WHEN vcc.campaign_channel = 'Offline Promotions' OR ca.campaign_title like 'OFFLINE_%' THEN 'Offline Promotions'
			WHEN vcc.campaign_channel = 'Referral Program' OR LOWER(ca.campaign_title) like '%referral%' THEN 'Referral Program'
			WHEN de.marketing_channel = 'Inserts' OR vcc.campaign_channel = 'Inserts' OR LOWER(ca.campaign_title) like '%inserts%' THEN 'Inserts'
			WHEN de.marketing_channel = 'Cooperations' OR vcc.campaign_channel = 'Cooperations' OR LOWER(ca.campaign_title) like '%coop%' THEN 'Cooperations'
			WHEN vcc.campaign_channel = 'CRM' OR LOWER(ca.campaign_title) like '%crm%' THEN 'CRM'
			WHEN de.marketing_channel = 'Affiliate' OR vcc.campaign_channel = 'Affiliate' OR LOWER(ca.campaign_title) like '%affiliate%' THEN 'Affiliate'
			WHEN vcc.campaign_channel = 'Remarketing' OR LOWER(ca.campaign_title) like '%remarketing%' THEN 'Remarketing'
			WHEN vcc.campaign_channel = 'Display' OR LOWER(ca.campaign_title) like '%display%' THEN 'Display'
			WHEN vcc.campaign_channel = 'Facebook' OR LOWER(ca.campaign_title) like '%facebook%' THEN 'Facebook'
			WHEN vcc.campaign_channel = 'Offline Promotions' OR ca.campaign_title like 'OFFLINE_%' THEN 'Offline Promotions'
			ELSE 'Other voucher'
		END as marketing_channel,
		vcc.campaign_subchannel as marketing_subchannel,
		vcc.campaign_title as marketing_campaign,
		de.campaign_type,
		de.publisher,
		de.cluster		
	FROM raw.discount_campaigns  ca
	LEFT JOIN dwh.voucher_campaign_channel vcc ON ca.campaign_title = vcc.campaign_title
	LEFT JOIN 
	(
	SELECT 
		campaign_title,
		marketing_channel,
		campaign_type, 
		LOWER(publisher) as publisher,
		LOWER(cluster) as cluster
	FROM raw.marketing_voucher_campaign_details  
	) de ON ca.campaign_title = LTRIM(RTRIM(de.campaign_title))
) cam ON ca.campaign_id = cam.campaign_id
WHERE co.campaign_id is not null
AND co.date_incoming is not null


