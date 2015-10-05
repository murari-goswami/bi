-- Name: raw.customer_order_phone_dates
-- Created: 2015-04-24 18:17:46
-- Updated: 2015-05-04 09:46:50

CREATE VIEW raw.customer_order_phone_dates
AS
SELECT
	order_id,
	date_phone_call,
	date_created,
	rank() OVER(PARTITION BY order_id ORDER BY date_created) as phone_date_count,
	rank() OVER(PARTITION BY order_id ORDER BY date_created desc) as phone_date_count_desc
FROM
(
SELECT 
	CAST(al.persisted_object_id as long) as order_id,
	/*can be replaced once parsetimestamp problem is solved
	--PARSETIMESTAMP(SUBSTRING(al.new_value, 5, 30), 'MMM dd HH:mm:ss z yyyy') as date_phone_call,*/
	PARSETIMESTAMP(SUBSTRING(al.new_value, 5, 30), 'MMM dd HH:mm:ss ''CEST'' yyyy') as date_phone_call,
	MIN(al.date_created) as date_created
FROM postgres.audit_log al
WHERE al.property_name = 'phoneDate'
GROUP BY al.persisted_object_id, al.new_value
) x


