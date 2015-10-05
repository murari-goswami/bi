-- Name: tableau.ops_throughput_times_followons
-- Created: 2015-04-24 18:20:53
-- Updated: 2015-08-07 10:49:25

CREATE VIEW tableau.ops_throughput_times_followons AS

SELECT 
co.customer_id, 
co.shipping_country,
co.order_id, 
co.parent_order_id,
co.order_type, 
a.original_return_date,
co.date_created as followon_date_created,
co.date_stylist_picked as followon_date_picked,
co.date_shipped as followon_date_shipped,
co.date_returned as followon_date_returned,
sum(cal1.working_days) as total_working_days1,
sum(cal2.working_days)*-1 as total_working_days2
FROM bi.customer_order co
left join
(select
order_id,
date_returned as original_return_date,
order_state_number as parent_order_state
from
bi.customer_order) a
on a.order_id = parent_order_id
left join dwh.calendar cal1
on cal1."date" between cast(a.original_return_date as date) and cast(co.date_stylist_picked as date)
left join dwh.calendar cal2
on cal2."date" between cast(co.date_stylist_picked as date) and cast(a.original_return_date as date)
where co.parent_order_id is not null
and co.order_state_number >= 16 
and co.order_state_number <> 2048
and a.parent_order_state >= 16
and a.parent_order_state <> 2048
and co.date_stylist_picked is not null
group by 1,2,3,4,5,6,7,8,9,10


