alter view raw.customer_order_issue_full_30days_all
as
select
	cast(a.date_shipped as date) as date_created,
	case
		when a.order_type = 'Repeat Order' then 'Repeat'
		else 'Follow_On'
	end as order_type,
	count(distinct a.order_id) as volume
from dwh.customer_order_apr_sep a
where cast(a.date_shipped as date)  >= '2015-05-01'
	and a.order_state != 'Cancelled'
	and a.order_type in ('Repeat Order', 'Repeat Order Follow-on', 'First Order Follow-on')
	and exists (
		select 1
		from dwh.customer_order_apr_sep b
		where a.customer_id = b.customer_id
			and b.order_id != a.order_id
			and b.order_state != 'Cancelled'
			and cast(b.date_shipped as date) >= '2015-04-01'
			--and cast(b.date_created as date) between cast(TIMESTAMPADD(SQL_TSI_DAY, -30, a.date_created) as date) and cast(a.date_created as date)
			and TIMESTAMPDIFF(SQL_TSI_DAY, b.date_shipped, a.date_shipped) <= 31 -- Within 30 days
			and TIMESTAMPDIFF(SQL_TSI_DAY, b.date_shipped, a.date_shipped) >= 0 -- But not later
	)
group by 1,2
;