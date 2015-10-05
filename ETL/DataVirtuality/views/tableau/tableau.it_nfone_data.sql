-- Name: tableau.it_nfone_data
-- Created: 2015-05-15 12:51:36
-- Updated: 2015-05-15 12:51:36

CREATE VIEW tableau.it_nfone_data
as

SELECT 
	cast(date_called as date) as date_called,
	call_queue,
	call_handled_by,
	phone_number,
	MAX(CASE WHEN n.call_duration > 90 THEN 'Success' ELSE 'No Success' END) as reached,
	COUNT(n.phone_number) as num_tries,
	SUM(CASE WHEN n.call_duration > 90 THEN 1 ELSE 0 END) as num_succesful_tries,
	MAX(CASE WHEN n.call_duration > 90 THEN n.call_duration ELSE null END)/60 as max_call_duration
from "dwh.nfone_data" n
GROUP BY 1,2,3,4


