-- Name: bi.customer_order_phone_dates
-- Created: 2015-04-24 18:19:16
-- Updated: 2015-04-24 18:19:16

CREATE VIEW bi.customer_order_phone_dates
AS
SELECT 
	f.order_id,
	CASE 
		WHEN f.date_phone_call > TIMESTAMPADD(SQL_TSI_DAY, 30, CURDATE()) THEN null   /*Remove all stupid future dates*/
		WHEN CAST(EXTRACT(minute from f.date_phone_call) as float)/30 BETWEEN 0.0001 AND 0.9999   /*Make sure that only exact multiples of 30 minutes are used*/
		THEN TIMESTAMPADD(SQL_TSI_MINUTE, -extract(minute from f.date_phone_call), f.date_phone_call)
		ELSE f.date_phone_call
	END as date_phone_call,
	f.date_created,
	l.date_created as date_invalidated,
	f.phone_date_count,
	f.phone_date_count_desc
FROM raw.customer_order_phone_dates f
LEFT JOIN raw.customer_order_phone_dates l on f.order_id = l.order_id AND f.phone_date_count + 1 = l.phone_date_count


