-- Name: sandbox.insert_campaign_forecast
-- Created: 2015-07-31 16:43:49
-- Updated: 2015-07-31 18:40:36

CREATE VIEW sandbox.insert_campaign_forecast
AS

SELECT
	ab.date_created,
	ab.campaign_title,
	vc.date_discount_start,
	vc.promotion_start,
	vc.date_discount_end,
	fd.first_date_incoming,
	vc.promotion_end,
	vc.country,
	vc.campaign_type,
	vc.cluster,
	CASE 
		WHEN date_discount_end <= CURDATE() THEN 'Running'
		ELSE 'Finished'
	END status,
	TIMESTAMPDIFF(SQL_TSI_DAY, vc.promotion_start, ab.date_created) as days_since_promotion_start,
	TIMESTAMPDIFF(SQL_TSI_DAY, vc.date_discount_start, ab.date_created) as days_since_discount_start,
	TIMESTAMPDIFF(SQL_TSI_DAY, fd.first_date_incoming, ab.date_created) as days_since_first_order,
	co.orders_incoming	
FROM
(
	SELECT
	    c.date as date_created,
		x.campaign_title
	FROM dwh.calendar c 
	CROSS JOIN (SELECT campaign_title FROM  raw.marketing_voucher_campaign_details GROUP BY 1) x
	WHERE c.date > '2014'
	AND c.date < CURDATE()	
) ab	
LEFT JOIN 
(
	SELECT
		campaign_title, 
		date_discount_start,
		date_discount_end,
		promotion_start,
		promotion_end,
		country,
		campaign_type,
		cluster		
	FROM  raw.marketing_voucher_campaign_details
) vc ON vc.campaign_title = ab.campaign_title
LEFT JOIN
(
	SELECT
		RTRIM(LTRIM(cam.campaign_title)) as campaign_title,
		CAST(date_incoming as date) as date_incoming,
		SUM(CASE WHEN co.date_incoming is not null then 1 ELSE null END) AS orders_incoming
	FROM bi.customer_order co
	LEFT JOIN raw.discount_campaigns cam ON co.campaign_id = cam.campaign_id
	WHERE co.is_real_order = 'Real Order'
	AND date_incoming is not null
	AND cam.campaign_title is not null
	AND order_type = 'First Order'
	GROUP BY 1,2
) co ON co.campaign_title = ab.campaign_title AND co.date_incoming = ab.date_created
LEFT JOIN
(
	SELECT
		RTRIM(LTRIM(cam.campaign_title)) as campaign_title,
		MIN(CAST(date_incoming as date)) as first_date_incoming
	FROM bi.customer_order co
	LEFT JOIN raw.discount_campaigns cam ON co.campaign_id = cam.campaign_id
	WHERE co.is_real_order = 'Real Order'
	AND date_incoming is not null
	AND cam.campaign_title is not null
	AND order_type = 'First Order'
	GROUP BY 1
) fd ON fd.campaign_title = ab.campaign_title
WHERE ab.date_created >= vc.date_discount_start
AND ab.date_created <= vc.date_discount_end


