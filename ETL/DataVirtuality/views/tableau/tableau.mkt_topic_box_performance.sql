-- Name: tableau.mkt_topic_box_performance
-- Created: 2015-05-15 16:32:26
-- Updated: 2015-05-15 16:32:26

CREATE VIEW tableau.mkt_topic_box_performance
AS
SELECT 
	co.customer_id,
	co.order_id,
	CAST(co.date_incoming as date) as date_incoming,
	co.preview_id,
	pr.preview_name,
	pr.preview_type,
	co.order_state,
	co.shipping_country,
	co.order_type,
	co.box_type,
	co.sales_sent,
	co.articles_sent,
	co.sales_kept,
	co.articles_kept,
	co.billing_total,
	CASE WHEN co.date_invoiced is not null THEN 1 ELSE 0 END as order_invoiced,
	CASE WHEN bc.device_category is not null THEN bc.device_category
	ELSE 'Unknown'
	END AS device_category
FROM bi.customer_order co
LEFT JOIN raw.previews pr ON pr.preview_id = co.preview_id 
LEFT JOIN 
(
	SELECT
		DISTINCT 
		transaction_id,
		device_category
	FROM
	(
		SELECT 
			date_created,
			transaction_id,
			dense_rank() OVER (PARTITION BY transaction_id ORDER BY date_created ASC) as contact_count_asc,
			device_category
		FROM "dwh.ga_information_device"
	) ab 
	WHERE ab.contact_count_asc = 1
) bc on bc.transaction_id = co.order_id
WHERE co.preview_id is not null
AND is_real_order = 'Real Order'
AND date_incoming is not null


