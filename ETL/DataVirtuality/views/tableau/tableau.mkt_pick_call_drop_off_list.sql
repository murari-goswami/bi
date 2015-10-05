-- Name: tableau.mkt_pick_call_drop_off_list
-- Created: 2015-06-16 12:09:38
-- Updated: 2015-06-16 12:09:38

CREATE VIEW tableau.mkt_pick_call_drop_off_list
AS
SELECT
	cu.customer_id,
	cu.date_created,
	cu.phone_number,
	cu.first_name,
	cu.last_name,
	cu.default_domain,
	sf.date_last_contacted,
	sf.last_call_reactivation,
	sf.last_reactivation_result
FROM bi.customer cu
LEFT JOIN raw.stylist st ON st.stylist_id = cu.stylist_id
LEFT JOIN
(
SELECT	
	customer_id,
	COUNT(order_id) as order_count
FROM bi.customer_order
WHERE date_invoiced is not null
GROUP BY 1
) co ON co.customer_id = cu.customer_id
LEFT JOIN
(
	SELECT 
		customer_id,
		date_last_contacted,
		last_call_reactivation,
		last_reactivation_result
FROM raw.customer_salesforce
) sf ON sf.customer_id = cu.customer_id
WHERE st.role = 'Fake'
AND phone_number is not null
AND co.order_count is null
ORDER BY 2


