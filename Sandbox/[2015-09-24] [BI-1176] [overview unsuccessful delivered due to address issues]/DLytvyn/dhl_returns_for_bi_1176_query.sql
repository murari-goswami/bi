select
	formatdate(date_shipped,'yyyy-MM') as month_shipped,
	shipping_country,
	order_type,
	--order_state,
	delivery_status,
	is_payed,
	sum(sales_sent) as sales_sent,
	count(order_id) as order_count
from (
	select
		o.order_id,
		cast (o.date_shipped as date) as date_shipped,
		o.shipping_country,
		o.order_type,
		--o.order_state,
		case
			when r.outfittery_order_id is null then 'success'
			else 'bounced'
		end as delivery_status,
		case
			when o.sales_kept > 0 then 1
			else 0
		end as is_payed,
		cast(coalesce(o.sales_sent, 0.0) as double) as sales_sent
	from bi.customer_order o
		left join dwh.dhl_returns_for_bi_1176 r
			on r.outfittery_order_id = o.order_id
			and r.returns_comment in ('addressee unknown','changed adresse','addressee has moved')
	where o.date_shipped >= '2015-01-01'
) t
group by 1,2,3,4,5
order by 1,2,3,4,5
;