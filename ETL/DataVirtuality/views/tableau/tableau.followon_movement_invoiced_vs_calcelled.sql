-- Name: tableau.followon_movement_invoiced_vs_calcelled
-- Created: 2015-10-01 10:23:28
-- Updated: 2015-10-01 10:26:47

CREATE view tableau.followon_movement_invoiced_vs_calcelled
as
select  case when used_invoice_number is not null then 'Invoiced'
	   		else 'Not-Invoiced'
	   end as invoice_state,        
       followon_date_created ,
	  
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


