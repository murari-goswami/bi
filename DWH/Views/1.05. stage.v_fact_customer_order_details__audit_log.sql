create or replace view stage.v_fact_customer_order_details__audit_log
as
select
	cast(al.persisted_object_id as bigint) as order_id,
	max(case when al.property_name = 'paymentMethod' and (al.old_value = '4' or al.new_value = '4') then 1 else 0 end) as pre_pay,
	/*workaround to fix the parsetimestamp until problem is found*/
	to_date(substring(min(case when al.property_name = 'phoneDate' and (al.old_value is null or al.old_value = 'null') then al.new_value end), 5, 30), 'MON DD HH24:MI:SS ''CEST'' YYYY') as original_phone_date,
	min(case when al.property_name = 'state' and al.old_value = '4' and al.new_value = '8' then al.date_created end) as date_incoming,
	min(case when al.property_name = 'state' and al.old_value = '4' and al.new_value = '12' then al.date_created end) as date_incoming_no_call,
	min(case when al.property_name = 'state' and al.old_value = '8' and al.new_value = '2048' then al.date_created end) as date_cancelled,
	min(case when al.property_name = 'state' and al.old_value = '256' and al.new_value = '384' then al.date_created end) as date_returned_online,
	min(case when property_name = 'dateCompleted' and new_value is null and old_value is not null then cast(old_value as timestamp) end) as date_completed,
	min(case when property_name = 'dateReturned' and new_value is null and old_value is not null then cast(old_value as timestamp) end) as date_returned,
	min(case when al.property_name = 'paymentMethod' and al.old_value = '4' and al.new_value = '2' then al.date_created end) as date_prepay_to_credit_card,
	min(case when al.property_name = 'paymentMethod' and al.old_value = '1' and al.new_value = '6' then al.date_created end) as date_arvato_accepted
from stage.postgres_audit_log al
group by 1
;