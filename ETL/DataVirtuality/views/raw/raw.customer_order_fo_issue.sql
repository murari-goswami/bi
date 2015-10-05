-- Name: raw.customer_order_fo_issue
-- Created: 2015-09-11 17:16:37
-- Updated: 2015-09-11 17:33:29

CREATE view raw.customer_order_fo_issue as
select * from dwh.customer_order_apr_aug a
where cast(date_created as date) between '2015-05-01' and '2015-08-31'
and order_type = 'Repeat Order'
and exists (select 1 from dwh.customer_order_apr_aug b
		where a.customer_id = b.customer_id
		and cast(date_created as date) between cast (TIMESTAMPADD (SQL_TSI_DAY,-30,date_created) as date)
									   and cast(date_created as date));


