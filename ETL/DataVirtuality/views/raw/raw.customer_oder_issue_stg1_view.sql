-- Name: raw.customer_oder_issue_stg1_view
-- Created: 2015-09-14 12:46:03
-- Updated: 2015-09-14 12:46:03

create view raw.customer_oder_issue_stg1_view
as
select week(a.date_created) as "Week_No", a.vol as "Repeat", b.vol as "follow_on" , (a.vol+b.vol) as "Total"
from (	select * from dwh.customer_order_may_aug_repeat
				order by date_created asc) a
left join
			(select * from raw.customer_order_issue_onlyfo 
				order by date_created asc) b
on a.date_created=b.date_created;


