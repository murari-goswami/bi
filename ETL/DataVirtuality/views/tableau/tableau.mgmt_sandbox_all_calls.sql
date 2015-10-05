-- Name: tableau.mgmt_sandbox_all_calls
-- Created: 2015-05-08 10:24:20
-- Updated: 2015-05-08 10:24:20

CREATE VIEW tableau.mgmt_sandbox_all_calls
AS

SELECT
	c.customer_id, 
	c.phone_number,
	n.date_called,
	n.waiting_time,
	CAST(CASE WHEN n.call_duration > 90 THEN n.call_duration ELSE null END as float)/60 as call_duration,
	n.disconnected_by,
	n.call_handled_by,
	n.call_queue,
	CASE WHEN n.call_duration > 90 THEN 1 ELSE 0 END as reached
FROM bi.customer c 
JOIN dwh.nfone_data n on n.phone_number = c.phone_number
WHERE n.date_called > '2015'
AND c.phone_number is not null


