-- Name: raw.customer_state_change
-- Created: 2015-05-20 14:23:34
-- Updated: 2015-05-20 15:32:08

CREATE view raw.customer_state_change
AS

with audit as
(
	SELECT 
		persisted_object_id AS order_id,
		old_value,
		new_value,
		max(date_created) as date_created
	FROM postgres.audit_log 
	where property_name='state'
	group by 1,2,3
)
SELECT
	order_id,
	MAX(CASE WHEN old_value=4 AND new_value=8 THEN date_created ELSE NULL END) AS date_created_8,
	MAX(CASE WHEN old_value=8 AND new_value=16 THEN date_created ELSE NULL END) AS date_created_16,
	MAX(CASE WHEN old_value=16 AND new_value=24 THEN date_created ELSE NULL END) AS date_created_24,
	MAX(CASE WHEN old_value=16 AND new_value=128 THEN date_created ELSE NULL END) AS date_created_16_128,
	MAX(CASE WHEN old_value=24 AND new_value=128 THEN date_created ELSE NULL END) AS date_created_24_128,
	MAX(CASE WHEN old_value=128 AND new_value=256 THEN date_created ELSE NULL END) AS date_created_256,
	/*Returned*/
	MAX(CASE WHEN old_value=128 AND new_value=384 THEN date_created ELSE NULL END) AS date_created_128_384,	
	MAX(CASE WHEN old_value=128 AND new_value=512 THEN date_created ELSE NULL END) AS date_created_128_512,	
	MAX(CASE WHEN old_value=256 AND new_value=512 THEN date_created ELSE NULL END) AS date_created_256_512,
	MAX(CASE WHEN old_value=384 AND new_value=512 THEN date_created ELSE NULL END) AS date_created_384_512,
	/*Completed*/
	MAX(CASE WHEN old_value=128 AND new_value=1024 THEN date_created ELSE NULL END) AS date_created_128_1024,
	MAX(CASE WHEN old_value=256 AND new_value=1024 THEN date_created ELSE NULL END) AS date_created_256_1024,
	MAX(CASE WHEN old_value=512 AND new_value=1024 THEN date_created ELSE NULL END) AS date_created_512_1024,
	/*Cancelled*/
	MAX(CASE WHEN old_value=8 AND new_value=2048 THEN date_created ELSE NULL END) AS date_created_2048
FROM audit
GROUP BY 1


