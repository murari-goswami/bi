alter view raw.customer_order_issue_full_30days_repeats
as
select
	cast(a.date_shipped as date) as date_created,
	'Repeat' as order_type,
	count(distinct a.order_id) as volume
from dwh.customer_order_apr_sep a
where cast(a.date_shipped as date) >= '2015-05-01'
	and a.order_type = 'Repeat Order'
	and exists (
		select 1
		from dwh.customer_order_apr_sep b
		where a.customer_id = b.customer_id
			and cast(b.date_shipped as date) between cast(TIMESTAMPADD(SQL_TSI_DAY, -30, a.date_shipped) as date) and cast(a.date_shipped as date)
	)
group by cast(a.date_shipped as date)

union all

select
	cast(a.date_shipped as date) as date_created,
	'Follow_On' as order_type,
	count(distinct a.order_id) as volume
from dwh.customer_order_apr_sep a
where cast(a.date_shipped as date) >= '2015-05-01'
	and a.order_type in ('Repeat Order Follow-on', 'First Order Follow-on')
group by cast(a.date_shipped as date)
;