create or replace view stage.v_dim_case
as
with

level_0 as (
	select
		co.order_id,
		co.order_id origin_order_id,
		co.date_created as orgin_date_created,
		0 as level
	from stage.v_dim_customer_order co
	where co.parent_order_id is null
),

level_1 as (
	select
		co.order_id,
		parent.origin_order_id,
		parent.orgin_date_created,
		1 as level
	from stage.v_dim_customer_order co
	inner join level_0 parent on parent.order_id = co.parent_order_id
),

level_2 as (
	select
		co.order_id,
		parent.origin_order_id,
		parent.orgin_date_created,
		2 as level
	from stage.v_dim_customer_order co
	inner join level_1 parent on parent.order_id = co.parent_order_id
),

level_3 as (
	select
		co.order_id,
		parent.origin_order_id,
		parent.orgin_date_created,
		3 as level
	from stage.v_dim_customer_order co
	inner join level_2 parent on parent.order_id = co.parent_order_id
),

level_4 as (
	select
		co.order_id,
		parent.origin_order_id,
		parent.orgin_date_created,
		4 as level
	from stage.v_dim_customer_order co
	inner join level_3 parent on parent.order_id = co.parent_order_id
),

level_5 as (
	select
		co.order_id,
		parent.origin_order_id,
		parent.orgin_date_created,
		5 as level
	from stage.v_dim_customer_order co
	inner join level_4 parent on parent.order_id = co.parent_order_id
),

level_6 as (
	select
		co.order_id,
		parent.origin_order_id,
		parent.orgin_date_created,
		6 as level
	from stage.v_dim_customer_order co
	inner join level_5 parent on parent.order_id = co.parent_order_id
),

level_7 as (
	select
		co.order_id,
		parent.origin_order_id,
		parent.orgin_date_created,
		7 as level
	from stage.v_dim_customer_order co
	inner join level_6 parent on parent.order_id = co.parent_order_id
),

all_levels as (
	select * from level_0
	union
	select * from level_1
	union
	select * from level_2
	union
	select * from level_3
	union
	select * from level_4
	union
	select * from level_5
	union
	select * from level_6
	union
	select * from level_7
),

cases as (
	select
		co.customer_id,
		co.order_id case_id,
		co.date_created case_date_created,
		rank() over(partition by co.customer_id order by co.date_created asc) case_no
	from level_0
		left join stage.v_dim_customer_order co on co.order_id = level_0.origin_order_id
)

select
	co.order_id,
	cases.case_id,
	cases.case_date_created,
	cases.case_no,
	all_levels.level as level
from stage.v_dim_customer_order co
	left join all_levels on all_levels.order_id = co.order_id
	left join cases on cases.case_id = all_levels.origin_order_id
;