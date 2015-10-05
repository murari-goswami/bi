-- Name: raw.customer_order_details__audit_log
-- Created: 2015-04-24 18:17:21
-- Updated: 2015-09-18 12:55:53

CREATE VIEW raw.customer_order_details__audit_log
AS

SELECT 
	CAST(al.persisted_object_id as long) as order_id,
	MAX(CASE WHEN al.property_name = 'paymentMethod' AND (al.old_value = '4' OR al.new_value = '4') THEN 1 ELSE 0 END) as pre_pay,
	/*workaround to fix the parsetimestamp until problem is found*/
	PARSETIMESTAMP(SUBSTRING(MIN(CASE WHEN al.property_name = 'phoneDate' AND (al.old_value is null OR al.old_value = 'null') THEN al.new_value END), 5, 30), 'MMM dd HH:mm:ss ''CEST'' yyyy') as original_phone_date,
	                                                                                                                                                                                                               	MIN(case when al.property_name='state' and al.old_value=4 and al.new_value=8 then al.date_created end) as date_incoming,                                                                                                                                                                         	MIN(case when al.property_name='state' and al.old_value=4 and al.new_value=12 then al.date_created end) as date_incoming_no_call,
	MIN(case when al.property_name='state' and al.old_value=8 and al.new_value=2048 then al.date_created end) as date_cancelled,
	MIN(case when al.property_name='state' and al.old_value=256 and al.new_value=384 then al.date_created end) as date_returned_online,
	MIN(CASE WHEN property_name='dateCompleted' and new_value is null and old_value is not null then cast(old_value as timestamp) END) as date_completed,
	MIN(CASE WHEN property_name='dateReturned' and new_value is null and old_value is not null then cast(old_value as timestamp) END) as date_returned,
	MIN(case when al.property_name='paymentMethod' and al.old_value=4 and al.new_value=2 then al.date_created end) as date_prepay_to_credit_card,
	MIN(case when al.property_name='paymentMethod' and al.old_value=1 and al.new_value=6 then al.date_created end) as date_arvato_accepted,
	MIN(case when al.property_name='paymentMethod' and al.old_value=2 and al.new_value=1 then al.date_created end) as date_cc_to_invoice
FROM postgres.audit_log al
GROUP BY 1


