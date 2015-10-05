-- Name: tableau.ops_followon_throughput
-- Created: 2015-04-29 18:25:46
-- Updated: 2015-08-07 10:49:13

CREATE VIEW tableau.ops_followon_throughput
AS

SELECT 
	co.id as order_id,
	CAST(co.date_picked AS DATE) as followon_date_picked,
	sum(cal1.working_days) as working_days
FROM 
	views.customer_order co
	join
		(select
			id,
			date_returned as original_return_date,
			state as parent_order_state
		from
			views.customer_order) a
		on a.id = parent_order_id
	join 
	dwh.calendar cal1
		on cal1."date" between cast(a.original_return_date as date) and cast(co.date_picked as date)
WHERE
	co.parent_order_id is not null
and co.state >= 16 
and co.state <> 2048
and a.parent_order_state >= 16
and a.parent_order_state <> 2048
and co.date_picked is not null
group by 1,2
HAVING 
	sum(cal1.working_days) IS NOT NULL


