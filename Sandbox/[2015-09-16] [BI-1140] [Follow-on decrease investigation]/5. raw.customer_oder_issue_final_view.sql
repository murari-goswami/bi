CREATE view raw.customer_oder_issue_final_view
as
select cast(a.date_created as date) as "Date_Created", cast(a.vol as integer) as "Repeat", 
		cast(b.vol as integer)as "follow_on" , (a.vol+b.vol) as "Total"
from (	select * from dwh.customer_order_may_aug_repeat
				order by date_created asc) a
left join
			(select * from raw.customer_order_issue_onlyfo 
				order by date_created asc) b
on a.date_created=b.date_created;