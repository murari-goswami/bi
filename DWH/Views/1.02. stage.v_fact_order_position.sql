create or replace view stage.v_fact_order_position
as
select
	op.id as order_position_id,
	op.order_id,
	op.state,
	op.quantity,
	op.stock_location_id,
	case when op.is_gift = 0 and op.state >= 16 and op.state <= 2048 then op.quantity else null end as items_picked_wt_can,
	case when op.is_gift = 0 and op.state >= 16 and op.state < 2048 then op.quantity else null end as items_picked,
	case when op.is_gift = 0 and op.state >= 128 and op.state < 2048 then op.quantity else null end as items_sent,
	case when op.is_gift = 0 and op.state = 1024 then op.quantity else null end as items_kept,
	case when op.is_gift = 0 and op.state = 512  then op.quantity else null end as items_returned,
	case when op.is_gift = 0 and op.state = 1536 then op.quantity else null end as items_lost,
	case when op.is_gift = 0 and op.state = 2048 then op.quantity else null end as items_cancelled,
	round(cast(op.purchase_price as decimal), 2) as cost_in_eur,
	round(cast(op.retail_price as decimal), 2) as sales_in_local_currency
from (
	select
		o.id,
		o.order_id,
		o.state,
		o.quantity,
		o.stock_location_id,
		o.purchase_price,
		o.retail_price,
		case when (o.retail_price = 0 and sa.article_id is not null) then 1 else 0 end as is_gift
	from stage.postgres_order_position o
		/* need to join to supplier article to check if items are gifts.
		it needs to be a subselect due to duplicates in the table */
		left join (
			select distinct
				sa.article_id
			from stage.postgres_supplier_article sa 
			where sa.supplier_id = 15
		) sa on sa.article_id = o.article_id
) op
;