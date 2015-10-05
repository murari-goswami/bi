-- Name: tableau.mkt_2nd_step_conversion_report
-- Created: 2015-04-24 18:23:51
-- Updated: 2015-07-31 14:49:56

CREATE VIEW tableau.mkt_2nd_step_conversion_report
AS

SELECT
	co.order_id,
	CASE 
		WHEN co.date_stylist_picked is not null 
			AND co.order_state_number >= 16
			AND co.order_state_number < 2048
		THEN 1
		ELSE COALESCE(ssf.conversion_rate, 0)
	END as processed_order,
	CASE 
		WHEN co.date_stylist_picked is not null 
			AND co.order_state_number >= 16
			AND co.order_state_number < 2048
		THEN co.order_id
		ELSE null
	END as processed_order_id,
	co.order_state,
	co.shipping_country,
	co.order_type,
	co.payment_type,
	co.box_type || CASE WHEN co.pre_pay = 1 THEN ' Pre-pay' ELSE '' END as box_type,
	CASE 
		WHEN co.order_type in ('Outfittery Club Order', 'First Order Follow-on', 'Repeat Order Follow-on') THEN '(not set)'
		WHEN mo.marketing_channel is null THEN '(not set)' ELSE mo.marketing_channel 
	END as marketing_channel,
	co.sales_channel,
	co.date_incoming,
	co.date_phone_call,
	cu.age_group,
	cu.customer_age
FROM bi.customer_order co
LEFT JOIN bi.customer_order_2nd_step_conversion_forecast ssf on ssf.box_type = co.box_type AND ssf.pre_pay = co.pre_pay AND ssf.days_from_incoming = TIMESTAMPDIFF(SQL_TSI_DAY, date_incoming, CURDATE())
LEFT JOIN 
(
	SELECT 
		order_id, 
		marketing_channel
	FROM bi.marketing_contacts
	WHERE contact_count_desc = 1
) mo ON mo.order_id = co.order_id
LEFT JOIN bi.customer cu on cu.customer_id = co.customer_id
WHERE co.is_real_order = 'Real Order'
AND co.date_incoming > '2014'
AND co.shipping_country is not null


