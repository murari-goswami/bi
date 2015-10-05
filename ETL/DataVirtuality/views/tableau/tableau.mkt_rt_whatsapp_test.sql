-- Name: tableau.mkt_rt_whatsapp_test
-- Created: 2015-08-10 11:27:31
-- Updated: 2015-08-10 11:27:31

CREATE VIEW tableau.mkt_rt_whatsapp_test
AS

SELECT
	cu.customer_id,
	cu.first_name,
	cu.last_name,
	cu.phone_number,
	st.stylist,
	COUNT(co.order_id) as order_count,
	SUM(billing_total) as billing_total,
	MAX(CAST(date_incoming as date)) as last_order_date,
	TIMESTAMPDIFF(SQL_TSI_DAY,MAX(date_incoming), CURDATE()) as days_since_last_order	
FROM bi.customer cu
LEFT JOIN raw.stylist st ON st.stylist_id = cu.new_stylist_id
LEFT JOIN bi.customer_order co ON cu.customer_id = co.customer_id
WHERE phone_number is not null
AND co.date_paid is not null
AND user_type = 'Real User'
AND is_real_order = 'Real Order'
GROUP BY 1,2,3,4,5
HAVING MAX(date_incoming) >= TIMESTAMPADD(SQL_TSI_MONTH, -6, CURDATE())


