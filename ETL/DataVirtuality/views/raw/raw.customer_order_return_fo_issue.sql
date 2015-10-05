-- Name: raw.customer_order_return_fo_issue
-- Created: 2015-09-14 14:57:12
-- Updated: 2015-09-14 14:57:12

create view raw.customer_order_return_fo_issue
as
select date_created,  'Repeat' as "Order_Type",repeat as volume from raw.customer_oder_issue_final_view
union
select date_created,  'Follow_On' as "Order_Type", follow_on as volume from raw.customer_oder_issue_final_view


