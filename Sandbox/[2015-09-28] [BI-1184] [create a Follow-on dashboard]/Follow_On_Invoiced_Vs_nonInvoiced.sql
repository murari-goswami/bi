select date_created,
	   case when used_invoice_number is not null then 'Invoiced'
	   		else 'Not-Invoiced'
	   end as invoice_state,
	   count(distinct(order_id)) as Volume	     
from 
(
	select a.date_created,
           a.order_id,
           b.used_invoice_number
    from (
		select
			cast(date_created as date) as date_created, 
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
	group by 1,2;
==================================================================================================================================
Date : 01st October 2015
==================================================================================================================================
select  case when used_invoice_number is not null then 'Invoiced'
	   		else 'Not-Invoiced'
	   end as invoice_state,        
       followon_date_created, 
	   week(followon_date_created) as "follow_on_week_created",
	   count(distinct(order_id)) as Volume	     
from 
(
	select followon_date_created,
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
	group by 1,2;
	
	
	