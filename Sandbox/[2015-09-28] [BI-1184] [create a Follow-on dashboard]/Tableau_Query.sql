select case when used_invoice_number is not null then 'Invoiced'
	   		else 'Not-Invoiced'
	   end as invoice_state,
	   cast(followon_date_created as date) as followon_date_created, 
       week(cast(followon_date_created as date)) week_created_followon,
	   count(order_id) as Volume	     
from 
(
	select a.followon_date_created,
           a.order_id,
           b.used_invoice_number
    from (
		select
			cast(date_created as date) as followon_date_created,  
			order_id
		from "raw.customer_order" 
		where cast(date_created as date)  >= '2015-01-01'
			and order_type in ('Repeat Order Follow-on', 'First Order Follow-on')) as a	
	left join
	( 
		select orderid,used_invoice_number
			from "postgres.doc_data_manifest_shipping" 
			where cast(date_created as date)  >= '2015-01-01' 
	) as b
	on  a.order_id = b.orderid) tab
	group by 1,2,3,

	select 	cast(last_updated as date) as date_invoiced,
		sales_channel,
		order_state,
		case
			when order_type = 'Repeat Order' then 'Repeat'
			else 'Follow_On'
		end as order_type,
		count(distinct order_id) as volume
from
(
   select date_shipped, sales_channel, order_state, order_type, order_id, last_updated
   from (
   		select date_shipped, sales_channel, order_state, order_type, order_id   	       
		from "bi.customer_order" 
		where cast(date_shipped as date)  >= '2015-01-01'
			and order_type in ('Repeat Order', 'Repeat Order Follow-on', 'First Order Follow-on')) as co		
	left join
	( 
		select distinct orderid,used_invoice_number, cast(last_updated as date) as last_updated
		from "postgres.doc_data_manifest_shipping" 
		where cast(date_created as date)  >= '2015-01-01' 
	) as ddms	
	on  co.order_id = ddms.orderid 
) as t
group by 1,2,3,4;

