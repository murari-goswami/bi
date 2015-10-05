-- Name: tableau.mkt_web_campaign_details
-- Created: 2015-08-20 12:14:02
-- Updated: 2015-08-21 11:53:50

CREATE VIEW tableau.mkt_web_campaign_details
AS

SELECT
	ba.date_incoming,
	ba.domain,
	ba.customer_age,
	ba.box_type,
	ba.marketing_channel,
	ba.marketing_subchannel,
	ba.source,
	ba.medium,
	ba.campaign,
	ba.term,
	ba.incoming_first_orders as incoming_first_orders_unattributed,
	ba.invoiced_first_orders as invoiced_first_orders_unattributed,
	ba.sales_sent as sales_sent_unattributed,
	ba.sales_kept as sales_kept_unattributed, 
	ba.billing_net_sales as billing_net_sales_unattributed,
	bb.incoming_first_orders as incoming_first_orders_attributed,
	bb.invoiced_first_orders as invoiced_first_orders_attributed,
	bb.sales_sent as sales_sent_attributed,
	bb.sales_kept as sales_kept_attributed, 
	bb.billing_net_sales as billing_net_sales_attributed
FROM
(
	SELECT
	  	cast(co.date_incoming as date) as date_incoming,
	  	cu.default_domain as domain,
	  	cu.customer_age,
	  	co.box_type,
	  	ua.marketing_channel,
	    ua.marketing_subchannel,
	    ua.source,
	    ua.medium,
	    ua.campaign,
	    ua.term,
	    COUNT(co.order_id) as incoming_first_orders,
	  	SUM(CASE WHEN co.date_invoiced is not null AND co.order_state_number >= 16 AND co.order_state_number < 2048 AND co.date_stylist_picked is not null THEN 1 ELSE 0 END) as invoiced_first_orders,
	 	SUM(co.sales_sent) as sales_sent,
	  	SUM(co.sales_kept) as sales_kept,
	  	SUM(co.billing_net_sales) as billing_net_sales
	FROM bi.customer_order co
	LEFT JOIN
	(
		SELECT
			order_id,
			contact_timestamp,
			marketing_channel, 
			marketing_subchannel,
			source,
			medium,
			campaign,
			term
		FROM
		(
			SELECT
				order_id,
				contact_timestamp,
				marketing_channel,
				marketing_subchannel,
				source,
				medium,
				campaign,
				term,
				RANK () OVER (PARTITION BY order_id ORDER BY contact_timestamp DESC, channel_rank ASC, campaign_rank ASC ) as contact_count_desc
			FROM
			(
				SELECT 
					order_id,
					contact_timestamp,
					marketing_channel,
					marketing_subchannel,
					source,
					medium,
					campaign,
					term,
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
					RAND() as campaign_rank
				FROM raw.marketing_contacts_web
				) ab
		) bc
		WHERE contact_count_desc = 1
	) ua ON ua.order_id = co.order_id
	LEFT JOIN "bi.customer" cu ON cu.customer_id = co.customer_id
	WHERE co.date_incoming is not null
	AND co.is_real_order = 'Real Order'
	AND order_type = 'First Order'
	AND marketing_channel is not null
	GROUP BY 1,2,3,4,5,6,7,8,9,10
) ba
LEFT JOIN
(
	SELECT
  	cast(co.date_incoming as date) as date_incoming,
  	cu.default_domain as domain,
  	cu.customer_age,
  	co.box_type,
  	oa.marketing_channel,
    oa.marketing_subchannel,
    oa.source,
    oa.medium,
    oa.marketing_campaign as campaign,
    oa.term,
  	SUM(oa.contact_weight) as incoming_first_orders,
  	SUM(CASE WHEN co.date_invoiced is not null AND co.order_state_number >= 16 AND co.order_state_number < 2048 AND co.date_stylist_picked is not null THEN oa.contact_weight ELSE 0 END) as invoiced_first_orders,
 	SUM(oa.contact_weight*co.sales_sent) as sales_sent,
  	SUM(oa.contact_weight*co.sales_kept) as sales_kept,
  	SUM(oa.contact_weight*co.billing_net_sales) as billing_net_sales 
FROM bi.customer_order co
LEFT JOIN bi.marketing_order_attribution oa ON oa.order_id = co.order_id
LEFT JOIN "bi.customer" cu ON cu.customer_id = co.customer_id
WHERE co.date_incoming is not null
AND co.is_real_order = 'Real Order'
AND order_type = 'First Order'
AND contact_type = 'Web'
AND marketing_channel is not null
GROUP BY 1,2,3,4,5,6,7,8,9,10
) bb ON 
	ba.date_incoming = bb.date_incoming AND
	ba.domain=bb.domain AND 
	ba.customer_age = bb.customer_age AND
	ba.box_type=bb.box_type AND
	ba.marketing_channel = bb.marketing_channel AND
	ba.marketing_subchannel = bb.marketing_subchannel AND
	ba.source = bb.source AND
	ba.medium = bb.medium AND
	ba.campaign= bb.campaign


