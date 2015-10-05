-- Name: raw.snowplow_pageviews
-- Created: 2015-04-24 18:17:53
-- Updated: 2015-09-07 14:40:46

CREATE view raw.snowplow_pageviews
AS

SELECT
	fi.visitor_id,
	fi.user_id,
	fi.visitor_session_id,
	dense_rank() OVER (PARTITION BY fi.visitor_session_id ORDER BY fi.date_created ASC, fi.channel_rank ASC, fi.campaign_rank ASC) as pageview_count,
	fi.date_created,
	fi.device_type,
	fi.br_family,
	fi.br_type,
	fi.os_name,
	fi.os_family,
	fi.geo_country,
	fi.url_host,
	fi.url_path,
	fi.url_query,
	fi.source,
	fi.medium,
	fi.campaign,
	fi.term,
	/* Start Subchannel logic */
	CASE
		WHEN fi.marketing_channel = 'Direct' AND source is null THEN 'Direct Type-in'
	 	WHEN fi.marketing_channel = 'Direct' AND source is not null THEN 'Organic referral'
	 	WHEN fi.marketing_channel = 'Remarketing' THEN 'Remarketing'
	 	WHEN fi.marketing_channel = 'SEM Brand' THEN 'Google'
	 	WHEN fi.marketing_channel = 'Facebook' THEN 'CPC'
	 	WHEN fi.marketing_channel = 'Cooperations' THEN 'Web-contact'
	 	WHEN fi.marketing_channel = 'Referral Program' THEN 'Online'
	 	/*	Affiliate sub-channels */
	 	WHEN fi.marketing_channel = 'Affiliate' AND (fi.source || fi.medium || fi.campaign LIKE '%affilinet%' OR fi.source || fi.medium || fi.campaign LIKE '%affili.net%') THEN 'Affilinet'
	 	WHEN fi.marketing_channel = 'Affiliate' AND fi.source || fi.medium || fi.campaign LIKE '%daisycon%' THEN 'Daisycon'
	 	WHEN fi.marketing_channel = 'Affiliate' AND fi.source || fi.medium || fi.campaign LIKE '%mitarbeiterangebote%' THEN 'Corporate Benefit Program'
	 	WHEN fi.marketing_channel = 'Affiliate' AND fi.source || fi.medium || fi.campaign NOT LIKE '%daisycon%' AND fi.source || fi.medium || fi.campaign NOT LIKE '%affilinet%' AND fi.source || fi.medium || fi.campaign NOT LIKE '%affili.net%' AND fi.source || fi.medium || fi.campaign NOT LIKE '%mitarbeiterangebote%' THEN 'Other Platform'
		/*	SEO sub-channels */
		WHEN fi.marketing_channel = 'SEO' AND fi.source || fi.medium || fi.campaign LIKE '%google%' THEN 'Google'
		WHEN fi.marketing_channel = 'SEO' AND fi.source || fi.medium || fi.campaign LIKE '%bing%' THEN 'Bing'
		WHEN fi.marketing_channel = 'SEO' AND fi.source || fi.medium || fi.campaign LIKE '%yahoo%' THEN 'Yahoo'
		WHEN fi.marketing_channel = 'SEO' AND fi.source || fi.medium || fi.campaign NOT LIKE '%yahoo%' AND fi.source || fi.medium || fi.campaign NOT LIKE '%google%' AND fi.source || fi.medium || fi.campaign NOT LIKE '%bing%' THEN 'Blog'
		/*	SEM Non-brand sub-channels */
		WHEN fi.marketing_channel = 'SEM Non-brand' AND fi.source || fi.medium || fi.campaign LIKE '%google%' THEN 'Google'
		WHEN fi.marketing_channel = 'SEM Non-brand' AND fi.source || fi.medium || fi.campaign LIKE '%bing%' THEN 'Bing'
		WHEN fi.marketing_channel = 'SEM Non-brand' AND fi.source || fi.medium || fi.campaign LIKE '%yahoo%' THEN 'Yahoo'
		WHEN fi.marketing_channel = 'SEM Non-brand' AND fi.source || fi.medium || fi.campaign NOT LIKE '%yahoo%' AND fi.source || fi.medium || fi.campaign NOT LIKE '%google%' AND fi.source || fi.medium || fi.campaign NOT LIKE '%bing%' THEN 'Blog'
		/*	Display */
		WHEN fi.marketing_channel = 'Display' AND fi.source || fi.medium || fi.campaign LIKE '%gdn%' THEN 'GDN'
		WHEN fi.marketing_channel = 'Display' AND fi.source || fi.medium || fi.campaign NOT LIKE '%gdn%'THEN 'Other'
		/*	Social Media */
		WHEN fi.marketing_channel = 'Social Media' AND fi.source || fi.medium || fi.campaign LIKE '%twitter%' THEN 'Twitter'
		WHEN fi.marketing_channel = 'Social Media' AND fi.source || fi.medium || fi.campaign LIKE '%youtube%' THEN 'Youtube'
		WHEN fi.marketing_channel = 'Social Media' AND fi.source || fi.medium || fi.campaign LIKE '%facebook%' THEN 'Facebook'
		WHEN fi.marketing_channel = 'Social Media' AND fi.source || fi.medium || fi.campaign LIKE '%linkedin.com%' THEN 'LinkedIn'
		WHEN fi.marketing_channel = 'Social Media' AND fi.source || fi.medium || fi.campaign LIKE '%xing.com%' THEN 'Xing'
		/*	CRM */
		WHEN fi.marketing_channel = 'CRM' AND fi.source || fi.medium || fi.campaign LIKE '%remarketing%' THEN 'Remarketing'
		WHEN fi.marketing_channel = 'CRM' AND fi.source || fi.medium || fi.campaign NOT LIKE '%remarketing%' THEN 'Email'
		ELSE 'Other'
	END as marketing_subchannel,
	/* End Subchannel logic */
	
	fi.marketing_channel,
	fi.session_count
FROM
(
	SELECT
		ra.visitor_id,
		ra.user_id,
		ra.visitor_session_id,
		ra.date_created,
		ra.device_type,
		ra.br_family,
		ra.br_type,
		ra.os_name,
		ra.os_family,
		ra.geo_country,
		ra.url_host,
		ra.url_path,
		ra.url_query,
		ra.source,
		ra.medium,
		ra.campaign,
		CASE 
			WHEN ra.term is not null THEN ra.term
			WHEN ra.publisher_domain is not null THEN ra.publisher_domain
			ELSE null
		END AS term,
		ra.marketing_channel,
		ra.session_count,
		CASE 
			WHEN ra.marketing_channel = 'Facebook' THEN 1
			WHEN ra.marketing_channel = 'SEM Non-brand' THEN 2
			WHEN ra.marketing_channel = 'Display' THEN 3
			WHEN ra.marketing_channel = 'Referral Program' THEN 4
			WHEN ra.marketing_channel = 'Remarketing' THEN 4
			WHEN ra.marketing_channel = 'Affiliate' THEN 6
			WHEN ra.marketing_channel = 'CRM' THEN 7
			WHEN ra.marketing_channel = 'Social Media' THEN 8
			WHEN ra.marketing_channel = 'SEM Brand' THEN 9
			WHEN ra.marketing_channel = 'SEO' THEN 10
			WHEN ra.marketing_channel = 'Direct' THEN 11
		END as channel_rank,
		RAND() as campaign_rank
	FROM(
		SELECT
			DISTINCT
			sp.visitor_id,
			sp.user_id,
			sp.visitor_id ||'-'|| sp.session_count as visitor_session_id,
			sp.date_created,
			sp.device_type,
			sp.br_family,
			sp.br_type,
			sp.os_name,
			sp.os_family,
			sp.geo_country,
			sp.url_host,
			sp.url_path,
			sp.url_query,
			sp.source_final as source,
			sp.medium_final as medium,
			sp.campaign_final as campaign,
			sp.term_final as term,
			sp.publisher_domain,
			CASE
			WHEN chan.channel = 'praemienprogramm' OR sp.medium_final = 'referralpage' OR sp.source_final = 'praemienprogramm' then 'Referral Program'
			WHEN chan.channel ='remarketing' OR LOWER(sp.campaign_final || sp.source_final || sp.medium_final) like '%remarketing%' THEN 'Remarketing'
			WHEN chan.channel = 'twitter' OR chan.channel = 'youtube' OR LOWER(sp.campaign_final || sp.source_final || sp.medium_final) like '%twitter%' OR LOWER(sp.campaign_final || sp.source_final || sp.medium_final) like '%youtube%' OR LOWER(sp.campaign_final || sp.source_final || sp.medium_final) like '%linkedin%' OR LOWER(sp.campaign_final || sp.source_final || sp.medium_final) like '%xing%' OR LOWER(sp.campaign_final || sp.source_final || sp.medium_final) like '%google+%' OR LOWER(sp.source_final) like '%instagram%' THEN 'Social Media'
			WHEN chan.channel ='display' OR LOWER(sp.campaign_final || sp.source_final || sp.medium_final) like '%display%' THEN 'Display'
			WHEN chan.channel = 'affiliate' OR LOWER(sp.campaign_final || sp.source_final || sp.medium_final) like '%affili%' OR LOWER(sp.campaign_final || sp.source_final || sp.medium_final) like '%mitarbeiterangebote%' THEN 'Affiliate'
			WHEN chan.channel = 'facebook' OR LOWER(sp.campaign_final) like '%facebook%' OR LOWER(sp.source_final) like '%facebook%' OR LOWER(sp.medium_final) like '%facebook%' THEN 'Facebook'
			WHEN LOWER(sp.source_final) like '%google%' AND lower(sp.medium_final) = 'cpc' AND (LOWER(sp.campaign_final)  like '%brand%' OR LOWER(sp.campaign_final) is null) OR LOWER(sp.term_final) like '%outfitt%' THEN 'SEM Brand'
			WHEN (LOWER(sp.source_final) like '%google%' AND lower(sp.medium_final) = 'cpc' AND LOWER(sp.campaign_final) not like '%brand%' ) OR (LOWER(sp.source_final) LIKE 'bing%')  THEN 'SEM Non-brand'
			WHEN chan.channel = 'organic' OR LOWER(sp.medium_final) = 'organic' OR LOWER(sp.medium_final) = 'search' OR (sp.source_final like '%google%' AND LOWER(sp.medium_final) != 'cpc') THEN 'SEO'
			WHEN chan.channel = 'crm' OR sp.medium_final = 'email' OR LOWER(sp.source_final) like '%mail%' OR LOWER(sp.campaign_final || sp.source_final || sp.medium_final) LIKE '%crm%' OR LOWER(sp.source_final) = 'news.outfittery.com' THEN 'CRM' 
			WHEN chan.channel = 'kooperation' OR LOWER(sp.source_final) like 'coop%' THEN 'Cooperations'
			ELSE 'Direct'
			END AS marketing_channel,
			sp.session_count
		FROM
		(
			SELECT
				ab.visitor_id,
				ab.user_id,
				ab.date_created,
				ab.device_type,
				ab.br_family,
				ab.br_type,
				ab.os_name,
				ab.os_family,
				ab.geo_country,
				ab.url_host,
				ab.url_path,
				ab.url_query,
				ab.utm_source,
				ab.utm_medium,
				ab.utm_campaign,
				ab.utm_term,
				ab.gclid,
				ad.campaign as gclid_campaign,
				af.publisher_domain,
				ab.referrer_url_host,
				ab.referrer_url_path,
				ab.referrer_url_query,
				ab.referrer_source,
				ab.referrer_medium,
				ab.referrer_term,
				CASE
					WHEN ab.gclid is not null THEN 'Google' 
					WHEN ab.utm_source is not null THEN utm_source 
					WHEN ab.utm_source is null AND ab.referrer_source is not null THEN ab.referrer_source
					WHEN ab.utm_source is null AND ab.referrer_source is null AND ab.referrer_url_host like '%www.%' THEN SUBSTRING(ab.referrer_url_host,5)
					ELSE ab.referrer_url_host
				END AS source_final,
				CASE 
					WHEN ab.gclid is not null THEN 'CPC'
					WHEN ab.utm_medium is not null THEN utm_medium
					WHEN ab.utm_medium is null AND ab.referrer_medium is not null THEN ab.referrer_medium
					ELSE null
				END AS medium_final,
				CASE 
					WHEN ab.gclid is not null THEN ad.campaign
					WHEN ab.utm_campaign is not null THEN utm_campaign
					ELSE null
				END AS campaign_final,
				CASE 
					WHEN ab.utm_term is not null THEN ab.utm_term
					ELSE ab.referrer_term
				END AS term_final,		
				ab.session_count	
			FROM
			(
				SELECT
					domain_userid as visitor_id,
					user_id,
					MODIFYTIMEZONE(collector_tstamp,'UTC+1') as date_created,
					dvce_type as device_type,
					br_family,
					br_type,
					os_name,
					os_family,
					page_urlhost as url_host,
					geo_country,
					page_urlpath as url_path,
					page_urlquery as url_query,
					mkt_source as utm_source,
					mkt_medium as utm_medium,
					mkt_campaign as utm_campaign,
					mkt_term as utm_term,
					CASE 
						WHEN page_urlquery like '%gclid%' AND SUBSTRING(page_urlquery,LOCATE('gclid=',page_urlquery)+6) not like '%&%' THEN SUBSTRING(page_urlquery,LOCATE('gclid=',page_urlquery)+6) 
						WHEN page_urlquery like '%gclid%' AND SUBSTRING(page_urlquery,LOCATE('gclid=',page_urlquery)+6) like '%&%' THEN 		LEFT(LEFT(SUBSTRING(page_urlquery,LOCATE('gclid=',page_urlquery)+6),LOCATE('&',SUBSTRING(page_urlquery,LOCATE('gclid=',page_urlquery)+6))),LENGTH(LEFT(SUBSTRING(page_urlquery,LOCATE('gclid=',page_urlquery)+6),LOCATE('&',SUBSTRING(page_urlquery,LOCATE('gclid=',page_urlquery)+6))))-1) 
						ELSE null 
					END as gclid,
					CASE
						WHEN page_urlquery like '%publisherID=%' THEN LEFT(SUBSTRING(page_urlquery,LOCATE('publisherID=', page_urlquery)+12),6)
						ELSE null
					END AS publisher_id,
					refr_urlhost as referrer_url_host,
					refr_urlpath as referrer_url_path,
					refr_urlquery as referrer_url_query,
					refr_source as referrer_source,
					refr_medium as referrer_medium,
					refr_term as referrer_term,
					domain_sessionidx as session_count
				FROM raw.snowplow_events
				WHERE event = 'page_view'
				/* --Filter out own IP and bot traffic-- */
				AND user_ipaddress NOT LIKE '213.61.116.%'
				AND br_type != 'Robot'
				/* --Filter out domain tracking mistakes-- */
				AND ( page_urlhost = 'www.outfittery.de' OR page_urlhost = 'static.outfittery.de'  
				OR page_urlhost = 'www.outfittery.at' OR page_urlhost = 'static.outfittery.at'  
				OR page_urlhost = 'www.outfittery.ch' OR page_urlhost = 'static.outfittery.ch'  
				OR page_urlhost = 'www.outfittery.nl' OR page_urlhost = 'static.outfittery.nl' 
				OR page_urlhost = 'www.outfittery.be' OR page_urlhost = 'static.outfittery.be'  
				OR page_urlhost = 'www.outfittery.lu' OR page_urlhost = 'static.outfittery.lu'  
				OR page_urlhost = 'www.outfittery.dk' OR page_urlhost = 'static.outfittery.dk'  
				OR page_urlhost = 'www.outfittery.no' OR page_urlhost = 'static.outfittery.no'  
				OR page_urlhost = 'www.outfittery.se' OR page_urlhost = 'static.outfittery.se'  
				OR page_urlhost = 'www.outfittery.com' OR page_urlhost = 'static.outfittery.com')
				AND CAST(collector_tstamp as date) >= '2015-04'
			) ab
			LEFT JOIN dwh.ga_information_adwords ad ON ad.gclid = ab.gclid
			LEFT JOIN dwh.marketing_affilinet_publishers af ON ab.publisher_id = af.publisher_id
		) sp
		LEFT JOIN dwh.ga_channel_translation chan on lower(sp.source_final)|| ' / ' || lower(sp.medium_final) = lower(chan.source_medium)
	) ra
) fi


