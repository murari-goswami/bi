-- Name: raw.ga_channel_logic
-- Created: 2015-04-24 18:17:49
-- Updated: 2015-06-09 15:30:38

CREATE VIEW raw.ga_channel_logic
AS
SELECT
ga2.source_medium_campaign,
CASE
	WHEN ga2.marketing_channel = 'Direct' AND ga2.source_medium_campaign = '(direct) / (none) / (not set)' THEN 'Direct Type-in'
 	WHEN ga2.marketing_channel = 'Direct' AND ga2.source_medium_campaign != '(direct) / (none) / (not set)' THEN 'Organic referral'
 	WHEN ga2.marketing_channel = 'Remarketing' THEN 'Remarketing'
 	WHEN ga2.marketing_channel = 'SEM Brand' THEN 'Google'
 	WHEN ga2.marketing_channel = 'Facebook' THEN 'CPC'
 	WHEN ga2.marketing_channel = 'Cooperations' THEN 'Web-contact'
 	WHEN ga2.marketing_channel = 'Referral Program' THEN 'Online'
 	/*	Affiliate sub-channels */
 	WHEN ga2.marketing_channel = 'Affiliate' AND (ga2.source_medium_campaign LIKE '%affilinet%' OR ga2.source_medium_campaign LIKE '%affili.net%') THEN 'Affilinet'
 	WHEN ga2.marketing_channel = 'Affiliate' AND ga2.source_medium_campaign LIKE '%daisycon%' THEN 'Daisycon'
 	WHEN ga2.marketing_channel = 'Affiliate' AND ga2.source_medium_campaign LIKE '%mitarbeiterangebote%' THEN 'Corporate Benefit Program'
 	WHEN ga2.marketing_channel = 'Affiliate' AND ga2.source_medium_campaign NOT LIKE '%daisycon%' AND ga2.source_medium_campaign NOT LIKE '%affilinet%' AND ga2.source_medium_campaign NOT LIKE '%affili.net%' AND ga2.source_medium_campaign NOT LIKE '%mitarbeiterangebote%' THEN 'Other Platform'
	/*	SEO sub-channels */
	WHEN ga2.marketing_channel = 'SEO' AND ga2.source_medium_campaign LIKE '%google%' THEN 'Google'
	WHEN ga2.marketing_channel = 'SEO' AND ga2.source_medium_campaign LIKE '%bing%' THEN 'Bing'
	WHEN ga2.marketing_channel = 'SEO' AND ga2.source_medium_campaign LIKE '%yahoo%' THEN 'Yahoo'
	WHEN ga2.marketing_channel = 'SEO' AND ga2.source_medium_campaign NOT LIKE '%yahoo%' AND ga2.source_medium_campaign NOT LIKE '%google%' AND ga2.source_medium_campaign NOT LIKE '%bing%' THEN 'Blog'
	/*	SEM Non-brand sub-channels */
	WHEN ga2.marketing_channel = 'SEM Non-brand' AND ga2.source_medium_campaign LIKE '%google%' THEN 'Google'
	WHEN ga2.marketing_channel = 'SEM Non-brand' AND ga2.source_medium_campaign LIKE '%bing%' THEN 'Bing'
	WHEN ga2.marketing_channel = 'SEM Non-brand' AND ga2.source_medium_campaign LIKE '%yahoo%' THEN 'Yahoo'
	WHEN ga2.marketing_channel = 'SEM Non-brand' AND ga2.source_medium_campaign NOT LIKE '%yahoo%' AND ga2.source_medium_campaign NOT LIKE '%google%' AND ga2.source_medium_campaign NOT LIKE '%bing%' THEN 'Blog'
	/*	Display */
	WHEN ga2.marketing_channel = 'Display' AND ga2.source_medium_campaign LIKE '%gdn%' THEN 'GDN'
	WHEN ga2.marketing_channel = 'Display' AND ga2.source_medium_campaign NOT LIKE '%gdn%'THEN 'Other'
	/*	Social Media */
	WHEN ga2.marketing_channel = 'Social Media' AND ga2.source_medium_campaign LIKE '%twitter%' THEN 'Twitter'
	WHEN ga2.marketing_channel = 'Social Media' AND ga2.source_medium_campaign LIKE '%youtube%' THEN 'Youtube'
	WHEN ga2.marketing_channel = 'Social Media' AND ga2.source_medium_campaign LIKE '%facebook%' THEN 'Facebook'
	WHEN ga2.marketing_channel = 'Social Media' AND ga2.source_medium_campaign LIKE '%linkedin.com%' THEN 'LinkedIn'
	WHEN ga2.marketing_channel = 'Social Media' AND ga2.source_medium_campaign LIKE '%xing.com%' THEN 'Xing'
	/*	CRM */
	WHEN ga2.marketing_channel = 'CRM' AND ga2.source_medium_campaign LIKE '%remarketing%' THEN 'Remarketing'
	WHEN ga2.marketing_channel = 'CRM' AND ga2.source_medium_campaign NOT LIKE '%remarketing%' THEN 'Email'
	ELSE 'Other'
	END AS marketing_subchannel,
	ga2.marketing_channel
FROM
(
	SELECT 
		DISTINCT
		ga.source_medium_campaign,
		CASE
			WHEN LOWER(ga.source) like '%linkedin.com%' THEN 'Social Media'
		 	WHEN LOWER(ga.source) like '%xing.com%' THEN 'Social Media'
			WHEN chan.channel ='remarketing' OR LOWER(ga.cam_bit_1) = 'rem' OR LOWER(ga.cam_bit_2) = 'rem' OR LOWER(ga.cam_bit_2) = 'remarketing'THEN 'Remarketing'
			WHEN chan.channel ='display' OR ga.source = 'display' OR LOWER(ga.cam_bit_1)='gdn' OR LOWER(ga.cam_bit_2)='gdn' THEN 'Display'
			WHEN chan.channel = 'affiliate' OR ga.source like '%affili%' OR ga.medium like '%mitarbeiterangebote%' THEN 'Affiliate'
			WHEN chan.channel = 'facebook' OR ga.source like '%facebook%' THEN 'Facebook'
		 	WHEN (ga.source like 'google%' AND ga.medium = 'cpc' AND (LOWER(ga.cam_bit_3) != 'brand' OR ga.cam_bit_3 is null) OR ga.source like 'bing%' AND ga.medium = 'cpc' AND (ga.cam_bit_3 != 'brand' OR ga.cam_bit_3 is null) OR ga.source like 'Bing%' AND ga.medium = 'cpc' AND (ga.cam_bit_3 != 'brand' OR ga.cam_bit_3 is null) ) THEN 'SEM Non-brand'
			WHEN (ga.source like 'google%' AND ga.medium = 'cpc' AND LOWER(ga.cam_bit_3) = 'brand' ) THEN 'SEM Brand'
		 	WHEN chan.channel = 'organic' OR ga.medium = 'organic' OR (ga.source like '%google%' AND ga.medium = 'referral') THEN 'SEO'
		 	WHEN chan.channel = 'crm' OR ga.medium = 'email' THEN 'CRM'
		 	WHEN chan.channel = 'kooperation' OR ga.source like 'coop%' THEN 'Cooperations'
		 	WHEN chan.channel = 'twitter' OR chan.channel = 'youtube' OR ga.source like '%twitter%' OR ga.medium like '%twitter%' OR ga.source = '%youtube%' OR ga.medium like '%youtube%' THEN 'Social Media'
		 	WHEN chan.channel = 'praemienprogramm' OR ga.medium = 'referralpage' OR ga.source = 'praemienprogramm' then 'Referral Program'
		 	WHEN chan.channel = 'direct' OR ga.source = '(direct)' OR ga.source like '%.outfittery.%' OR chan.channel ='referral' OR (ga.source like 'outfittery.%' AND ga.medium='referral') THEN 'Direct'
		 	ELSE 'Direct'
		END as marketing_channel
	FROM
	(
		SELECT 
			vi.source, 
			vi.medium, 
			vi.campaign, 
			cam.cam_bit_1,
			cam.cam_bit_2,
			cam.cam_bit_3,
			cam.cam_bit_4,
			cam.cam_bit_5,
			cam.cam_bit_6,
			cam.cam_bit_7,
			cam.cam_bit_8,
			cam.cam_bit_9,
			cam.cam_bit_10,
			cam.cam_bit_11,
			cam.cam_bit_12,
			cam.cam_bit_13,
			cam.cam_bit_14,
			cam.cam_bit_15,
			cam.cam_bit_16,
			cam.cam_bit_17,
			cam.cam_bit_18,
			cam.cam_bit_19,
			cam.cam_bit_20,
			LOWER(vi.source)|| ' / ' || LOWER(vi.medium) || ' / ' || LOWER(vi.campaign) AS source_medium_campaign 
		FROM dwh.ga_visits vi,
		TEXTTABLE (vi.campaign columns
				cam_bit_1 string,
				cam_bit_2 string,
				cam_bit_3 string,
				cam_bit_4 string,
				cam_bit_5 string,
				cam_bit_6 string,
				cam_bit_7 string,
				cam_bit_8 string,
				cam_bit_9 string,
				cam_bit_10 string,
				cam_bit_11 string,
				cam_bit_12 string,
				cam_bit_13 string,
				cam_bit_14 string,
				cam_bit_15 string,
				cam_bit_16 string,
				cam_bit_17 string,
				cam_bit_18 string,
				cam_bit_19 string,
				cam_bit_20 string
				delimiter '_' ) cam
		GROUP BY 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24
		UNION SELECT
			utm.source, 
			utm.medium, 
			utm.campaign, 
			cam.cam_bit_1,
			cam.cam_bit_2,
			cam.cam_bit_3,
			cam.cam_bit_4,
			cam.cam_bit_5,
			cam.cam_bit_6,
			cam.cam_bit_7,
			cam.cam_bit_8,
			cam.cam_bit_9,
			cam.cam_bit_10,
			cam.cam_bit_11,
			cam.cam_bit_12,
			cam.cam_bit_13,
			cam.cam_bit_14,
			cam.cam_bit_15,
			cam.cam_bit_16,
			cam.cam_bit_17,
			cam.cam_bit_18,
			cam.cam_bit_19,
			cam.cam_bit_20,
			lower(utm.source)|| ' / ' || lower(utm.medium) || ' / ' || lower(utm.campaign) AS source_medium_campaign 
			FROM dwh.ga_information_utm utm,
			TEXTTABLE (utm.campaign columns
				cam_bit_1 string,
				cam_bit_2 string,
				cam_bit_3 string,
				cam_bit_4 string,
				cam_bit_5 string,
				cam_bit_6 string,
				cam_bit_7 string,
				cam_bit_8 string,
				cam_bit_9 string,
				cam_bit_10 string,
				cam_bit_11 string,
				cam_bit_12 string,
				cam_bit_13 string,
				cam_bit_14 string,
				cam_bit_15 string,
				cam_bit_16 string,
				cam_bit_17 string,
				cam_bit_18 string,
				cam_bit_19 string,
				cam_bit_20 string
				delimiter '_' ) cam
			GROUP BY 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24
	) ga
LEFT JOIN dwh.ga_channel_translation chan on lower(ga.source)|| ' / ' || lower(ga.medium) = lower(chan.source_medium)
) ga2


