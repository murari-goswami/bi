create view raw.customer_order_issue_onlyfo as
select cast(date_created as date) as date_created, count(*) as vol 
from dwh.customer_order_apr_aug
where cast(date_created as date) between '2015-05-01' and '2015-08-31'
and order_type in ('Repeat Order Follow-on', 'First Order Follow-on')
group by cast(date_created as date)
order by date_created asc;
