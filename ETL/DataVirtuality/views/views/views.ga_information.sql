-- Name: views.ga_information
-- Created: 2015-04-24 18:17:17
-- Updated: 2015-07-08 14:43:27

CREATE view views.ga_information
as
/* GA data */
select
	foo.date_created,
	foo.hour_created,
	foo.transaction_id,
	foo.country,
	foo.channel,
	/* DETERMINING IF CUSTOMER WAS REFERRED OR NOT */
	case
		when foo.source= 'referral' and foo.medium= 'referralpage' then 'referred by customer'
		else 'not referred by customer'
	end as "referred_by_customer",
	/* RECONSTRUCTION OF MANGLED REFERRING CUSTOMER TOKEN TO LINK TO ACCOUNT LATER ON */
	case
		when foo.source= 'referral' and foo.medium= 'referralpage' then substring(foo.adcontent,20,13) || substring(foo.adcontent,0,19)
		else '(not set)'
	end as "referring_customer_token",
	foo.source,
	foo.medium,
	foo.source || ' / ' || foo.medium as "source_medium",
	foo.campaign,
	foo1.cam_bit_1,
	foo1.cam_bit_2,
	foo1.cam_bit_3,
	foo1.cam_bit_4,
	foo1.cam_bit_5,
	foo1.cam_bit_6,
	foo1.cam_bit_7,
	foo1.cam_bit_8,
	foo1.cam_bit_9,
	foo1.cam_bit_10,
	foo1.cam_bit_11,
	foo1.cam_bit_12,
	foo1.cam_bit_13,
	foo1.cam_bit_14,
	foo1.cam_bit_15,
	foo1.cam_bit_16,
	foo1.cam_bit_17,
	foo1.cam_bit_18,
	foo1.cam_bit_19,
	foo1.cam_bit_20,
	foo.keyword,
	foo.adcontent,
	foo.optimizely_campaign,
	'0' as visits_per_transactionid,
	foo.device_category,
	foo.java_enabled,
	foo.flash_version,
	foo.browser,
	foo.browser_version,
	foo.operating_system,
	foo.operating_system_version,
	foo.mobile_device_branding,
	foo.mobile_device_model,
	foo.mobile_device_info,
	foo.screen_colors,
	foo.screen_resolution
from (
	select
		row_number() over (partition by utm.transaction_id order by utm.date_created desc, utm.hour_created desc) as "rnum",
		utm.date_created,
		utm.hour_created,
		utm.transaction_id,
		utm.country,
		gct.channel,
		lower(utm.source) as "source",
		lower(utm.medium) as "medium",
		lower(utm.campaign) as "campaign",
		lower(misc2.adcontent) as "adcontent",
		key.keyword,
		sys.browser,
		sys.browser_version,
		sys.operating_system,
		sys.operating_system_version,
		dev.device_category,
		dev.mobile_device_branding,
		dev.mobile_device_model,
		dev.mobile_device_info,
		misc.java_enabled,
		misc.flash_version,
		misc.screen_colors,
		misc.screen_resolution,
		/*vis.visits, */
		misc2.optimizely as "optimizely_campaign"
	from dwh.ga_information_utm utm
	left join dwh.ga_information_system sys on utm.transaction_id = sys.transaction_id and utm.date_created = sys.date_created and utm.hour_created = sys.hour_created
	left join dwh.ga_information_device dev on utm.transaction_id = dev.transaction_id and  utm.date_created = dev.date_created and utm.hour_created = dev.hour_created
	left join dwh.ga_information_misc misc on utm.transaction_id = misc.transaction_id and utm.date_created = misc.date_created and utm.hour_created = misc.hour_created
	/*left join dwh.ga_information_visits vis on utm.transaction_id = vis.transaction_id and utm.date_created = vis.date_created and utm.hour_created = vis.hour_created Excluded due to poor data quality*/
	left join dwh.ga_information_keyword key on utm.transaction_id = key.transaction_id and utm.date_created = key.date_created and utm.hour_created = key.hour_created
	left join dwh.ga_information_misc2 misc2 on utm.transaction_id = misc2.transaction_id and utm.date_created = misc2.date_created  
	left join dwh.ga_channel_translation gct on lower(utm.source) || ' / ' || lower(utm.medium) = gct.source_medium 
	WHERE utm.transaction_id != 'undefined'
	) foo,
	texttable (foo.campaign columns
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
					delimiter '_' ) foo1
			where foo.rnum= '1'
AND foo.date_created < '2015-05-28'
UNION
/* Snowplow data */
SELECT
	CAST(sp.date_created as date) as date_created,
	HOUR(sp.date_created) as hour_created,
	sp.order_id as transaction_id,
	domain as country,
	 CASE 
		WHEN marketing_channel = 'Direct' THEN 'direct'
		WHEN marketing_channel = 'SEM Non-brand' THEN 'google sem'
		WHEN marketing_channel = 'CRM' THEN	'crm'
		WHEN marketing_channel = 'Cooperations' THEN 'kooperation'
		WHEN marketing_channel = 'Facebook' THEN 'facebook'
		WHEN marketing_channel = 'SEO' THEN	'organic'
		WHEN marketing_channel = 'Display' THEN	'display'
		WHEN marketing_channel = 'Affiliate' THEN 'affiliate'
		WHEN marketing_channel = 'SEM Brand' THEN 'google sem'
		WHEN marketing_channel = 'Social Media' THEN 'social media'
		WHEN marketing_channel = 'Remarketing' THEN	'remarketing'
		WHEN marketing_channel = 'Referral Program' THEN 'praemienprogramm'
	END AS channel,
	null as referred_by_customer,
	null as referring_customer_token,
	LOWER(source) as source,
	LOWER(medium) as medium,
	LOWER(source) || ' / ' || LOWER(medium) as source_medium,
	LOWER(campaign) as campaign,
	sp3.cam_bit_1,
	sp3.cam_bit_2,
	sp3.cam_bit_3,
	sp3.cam_bit_4,
	sp3.cam_bit_5,
	sp3.cam_bit_6,
	sp3.cam_bit_7,
	sp3.cam_bit_8,
	sp3.cam_bit_9,
	sp3.cam_bit_10,
	sp3.cam_bit_11,
	sp3.cam_bit_12,
	sp3.cam_bit_13,
	sp3.cam_bit_14,
	sp3.cam_bit_15,
	sp3.cam_bit_16,
	sp3.cam_bit_17,
	sp3.cam_bit_18,
	sp3.cam_bit_19,
	sp3.cam_bit_20,
	null as keyword,
	null as adcontent,
	null as optimizely_campaign,
	'0' as visits_per_transactionid,
	CASE 
    	WHEN device_type = 'Computer' THEN 'desktop'
        WHEN device_type = 'Mobile' THEN 'mobile'
        WHEN device_type = 'Tablet' THEN 'tablet'   
    END AS device_category,
    null as java_enabled,
    null as flash_version,
    br_family as browser,
	br_type as browswer_version,
	os_family as operating_system,
	os_name as operating_system_version,
	null as mobile_device_brand,
	null as mobile_device_model,
	null as mobile_device_info,
	null as screen_colors,
	null as screen_resolution
FROM raw.snowplow_transactions sp
LEFT JOIN
(
	SELECT
		sp2.order_id,
		ab.cam_bit_1,
		ab.cam_bit_2,
		ab.cam_bit_3,
		ab.cam_bit_4,
		ab.cam_bit_5,
		ab.cam_bit_6,
		ab.cam_bit_7,
		ab.cam_bit_8,
		ab.cam_bit_9,
		ab.cam_bit_10,
		ab.cam_bit_11,
		ab.cam_bit_12,
		ab.cam_bit_13,
		ab.cam_bit_14,
		ab.cam_bit_15,
		ab.cam_bit_16,
		ab.cam_bit_17,
		ab.cam_bit_18,
		ab.cam_bit_19,
		ab.cam_bit_20
	FROM
	(
		SELECT
			order_id,
			campaign
		FROM raw.snowplow_transactions 
		) sp2,
		texttable(LOWER(sp2.campaign) columns
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
							delimiter '_' ) ab	
) sp3 ON sp.order_id = sp3.order_id
WHERE CAST(date_created as date) >= '2015-05-28'


