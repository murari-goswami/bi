-- Name: tableau.product_optimizely_performance
-- Created: 2015-05-05 12:28:57
-- Updated: 2015-09-07 12:37:42

CREATE VIEW tableau.product_optimizely_performance
AS

SELECT
	op.transaction_id,
	op.optimizely_test_type,
	op.optimizely_test_name as optimizely_test_name_full,
	LEFT(op.optimizely_test_name,LOCATE('):',op.optimizely_test_name)) as optimizely_test_name,
	SUBSTRING(op.optimizely_test_name,LOCATE('):',op.optimizely_test_name)+3) as optimizely_test_version,
	CASE 
		WHEN dv.device_category is not null THEN dv.device_category
		ELSE 'desktop'
	END as device_category,
	co.date_created,
	co.date_stylist_picked,
	co.date_incoming,
	co.date_invoiced,
	co.date_completed,
	co.order_type,
	CASE WHEN co.date_incoming is not null THEN 1 ELSE 0 END AS order_incoming,
	CASE WHEN co.date_invoiced is not null THEN 1 ELSE 0 END AS order_invoiced,
	CASE WHEN cu.phone_number IS NOT NULL THEN 1 ELSE 0 END AS has_phone_number,
	CASE WHEN cos.not_reached=1 THEN 'Not Reached' ELSE 'Reached' END AS reached,
	co.sales_channel,
	co.shipping_country,
	co.revenue_state,
	co.box_type,
	co.sales_sent,
	co.sales_kept,
	co.billing_total,
	cos.date_feedback_call
FROM dwh.ga_information_optimizely op
LEFT JOIN 
(
	SELECT
		a.*,
		b.optimizely_test_type,
		b.optimizely_test_name
	FROM bi.customer_order a
	LEFT JOIN 
	(
		SELECT 
			row_number() OVER(PARTITION BY transaction_id ORDER BY date_created desc) as rank_opt, t.* 
		FROM dwh.ga_information_optimizely t
	)b on b.transaction_id=a.order_id AND b.rank_opt=1
) co ON co.order_id = op.transaction_id and op.optimizely_test_type=co.optimizely_test_type and op.optimizely_test_name=co.optimizely_test_name
LEFT JOIN bi.customer_order_salesforce cos ON co.order_id = cos.order_id
LEFT JOIN bi.customer cu ON cu.customer_id = co.customer_id
LEFT JOIN
(
	SELECT
		transaction_id,
		device_category
	FROM
	(
		SELECT
			DISTINCT
			transaction_id,
			device_category 
		FROM
		(	
			SELECT 
				transaction_id,
				date_created,
				hour_created,
				device_category,
				rank() OVER (PARTITION BY transaction_id ORDER BY date_created ASC, hour_created ASC) as order_count
			FROM "dwh.ga_information_device"
		) ga
		WHERE order_count = 1
	) ga2
) dv ON dv.transaction_id = op.transaction_id


