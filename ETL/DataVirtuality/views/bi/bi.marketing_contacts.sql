-- Name: bi.marketing_contacts
-- Created: 2015-04-24 18:24:06
-- Updated: 2015-08-21 11:29:50

CREATE VIEW bi.marketing_contacts
AS

/* SELECT * statement necessary for materialization, otherwise error will occur */
SELECT 
	*
FROM
(
	SELECT
		data.order_id,
		dense_rank() OVER (PARTITION BY data.order_id ORDER BY data.contact_timestamp ASC, data.channel_rank ASC, data.campaign_rank ASC) as contact_count_asc,
		dense_rank() OVER (PARTITION BY data.order_id ORDER BY data.contact_timestamp DESC, data.channel_rank DESC, data.campaign_rank DESC) as contact_count_desc,
		data.contact_timestamp,
		data.marketing_channel,
		data.marketing_subchannel,
		data.source,
		data.medium,
		data.marketing_campaign,
		data.term,
		data.contact_type
	FROM 
	(
		SELECT 
			rd.order_id,
			rd.contact_timestamp,
			rd.marketing_channel,
			rd.marketing_sub_channel as marketing_subchannel,
			rd.cluster as source,
			rd.publisher as medium,
			rd.marketing_campaign,
			null as term,
			2 as channel_rank,
			RAND() as campaign_rank,
			'Discounts' as contact_type
			FROM raw.marketing_contacts_discounts rd
		  	WHERE rd.marketing_channel != 'Other voucher'	
	 	UNION ALL
		SELECT 
			rtv.order_id,
			rtv.contact_timestamp,
			rtv.marketing_channel,
			rtv.format as marketing_subchannel,
			rtv.tv_spot_station as source,
			rtv.tv_program as medium,
			rtv.tv_spot_name as campaign,
			null as term,
			1 as channel_rank,
			RAND() as campaign_rank,
			'TV' as contact_type
		FROM raw.marketing_contacts_tv rtv
		UNION ALL 
		SELECT 
			ga2.order_id,
			ga2.contact_timestamp,
			ga2.marketing_channel,
			ga2.marketing_subchannel,
			ga2.source,
			ga2.medium,
			ga2.campaign,
			ga2.term,
			/* Ranks channels in case of 2 visits with exact same timestamp but different channels */
			CASE 
				WHEN marketing_channel = 'Facebook' THEN 3
				WHEN marketing_channel = 'SEM Non-brand' THEN 4
				WHEN marketing_channel = 'Display' THEN 5
				WHEN marketing_channel = 'Referral Program' THEN 6
				WHEN marketing_channel = 'Remarketing' THEN 7
				WHEN marketing_channel = 'Affiliate' THEN 8
				WHEN marketing_channel = 'CRM' THEN 9
				WHEN marketing_channel = 'Social Media' THEN 10
				WHEN marketing_channel = 'SEM Brand' THEN 11
				WHEN marketing_channel = 'SEO' THEN 12
				WHEN marketing_channel = 'Direct' THEN 13
				END as channel_rank,
			RAND() as campaign_rank,
			'Web' as contact_type
		FROM
		(
			SELECT 
				ga.order_id,
				ga.contact_timestamp,
				ga.marketing_channel,
				ga.marketing_subchannel,
				ga.source,
				ga.medium,
				ga.campaign,
				ga.term,
				/* Filters out visits associated with TV contacts (visits throught Direct, SEM brand and SEO that happened within an our before or after a TV contact*/		
				CASE 
					WHEN (tv.order_id is not null AND ga.marketing_channel IN ('Direct', 'SEM Brand', 'SEO') AND TIMESTAMPDIFF(SQL_TSI_MINUTE, ga.contact_timestamp, tv.contact_timestamp) BETWEEN -59 AND 59) THEN 'true'
		 			ELSE 'false' 
		 		END as tv_visit,
		 		/* Filters out all branded contacts once a voucher is present */
		 			CASE 
					WHEN di.order_id is not null AND di.marketing_channel != 'Other voucher' AND ga.marketing_channel IN ('Direct', 'SEM Brand', 'SEO') THEN true
		 			ELSE 'false' 
		 		END as branded_voucher_visit,
		 		/* Filters out a GA contact associated with a voucher if that visit is the same channel as the voucher and took place witin a timeframe of an 90 min. from the order being placed  */
		 			CASE 
					WHEN di.marketing_channel = ga.marketing_channel AND TIMESTAMPDIFF(SQL_TSI_MINUTE, ga.contact_timestamp, di.contact_timestamp) BETWEEN -90 AND 90 THEN 'true'
		 			ELSE 'false' 
		 		END as voucher_same_channel_contact,
		 		/* Filters out any GA brand contact that is made after a paid channel was already present */
		 			CASE
		 			WHEN ga.marketing_channel IN ('Direct', 'SEM Brand', 'SEO') AND ga.contact_timestamp > fo.first_paid_channel THEN 'true'
		 			ELSE 'false'
		 			END as brand_contact_after_paid_contact
		 	FROM raw.marketing_contacts_web ga
			LEFT JOIN raw.marketing_contacts_tv tv ON tv.order_id = ga.order_id
			LEFT JOIN raw.marketing_contacts_discounts di ON di.order_id = ga.order_id
			LEFT JOIN 
			(
				SELECT 
					order_id,
					MIN(contact_timestamp) as first_paid_channel
				FROM "raw.marketing_contacts_web" 
				WHERE marketing_channel NOT IN ('Direct', 'SEM Brand', 'SEO')
				GROUP BY 1
			) fo ON fo.order_id = ga.order_id
		) ga2
		WHERE ga2.tv_visit = 'false'
		AND ga2.branded_voucher_visit = 'false'
		AND ga2.voucher_same_channel_contact = 'false'
		AND ga2.brand_contact_after_paid_contact = 'false'
	) data
) ab


