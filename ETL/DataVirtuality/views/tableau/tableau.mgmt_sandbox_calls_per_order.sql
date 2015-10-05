-- Name: tableau.mgmt_sandbox_calls_per_order
-- Created: 2015-05-08 10:29:47
-- Updated: 2015-05-08 10:29:47

CREATE VIEW tableau.mgmt_sandbox_calls_per_order
AS

SELECT 
	cso.order_id,
	c.phone_number,
	co.date_phone_call,
	cso.not_reached,
	cso.new_phone_appointment,
	cso.wrong_phone_number,
	n.call_queue,
	MAX(CASE WHEN n.call_duration > 90 THEN 1 ELSE 0 END) as reached,
	COUNT(n.phone_number) as num_tries,
	SUM(CASE WHEN n.call_duration > 90 THEN 1 ELSE 0 END) as num_succesful_tries,
	MAX(CASE WHEN n.call_duration > 90 THEN n.call_duration ELSE null END)/60 as max_call_duration,
	MAX(CASE WHEN n.phone_number is not null THEN 1 ELSE 0 END) as matching_nfone_data
FROM bi.customer_order co 
JOIN bi.customer c on c.customer_id = co.customer_id
JOIN raw.customer_order_salesforce cso on CAST(co.order_id as string) = cso.order_id
LEFT JOIN dwh.nfone_data n on n.phone_number = c.phone_number
WHERE co.order_type = 'First Order'
AND c.phone_number is not null
AND c.phone_number like '+%'
AND co.date_phone_call is not null
AND co.date_phone_call > '2015'
GROUP BY 1,2,3,4,5,6,7


