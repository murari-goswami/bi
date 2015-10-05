-- Name: bi.customer_order_fo_rep_view
-- Created: 2015-09-14 18:01:03
-- Updated: 2015-09-14 18:01:03

create view bi.customer_order_fo_rep_view as
select
	cast(o1.date_created as date) as date_created,
	case when o1.order_type like '%Follow%' then 'Follow-on' else 'Repeat' end as order_type,
	count(*) as cnt
from dwh.customer_order_apr_aug o1                        where o1.order_state != 'Cancelled'
	and cast(o1.date_created as date) between '2015-05-01' and '2015-08-31'
	and o1.order_type != 'First Order'                                 	and exists (
		select 1 from dwh.customer_order_apr_aug o2
		where o2.order_id != o1.order_id                     			and o2.customer_id = o1.customer_id                          			and TIMESTAMPDIFF(SQL_TSI_DAY, o2.date_created, o1.date_created) <= 30                    			and TIMESTAMPDIFF(SQL_TSI_DAY, o2.date_created, o1.date_created) > 0                   			and o2.order_state != 'Cancelled'
	)
group by 1, 2
order by 1, 2;


