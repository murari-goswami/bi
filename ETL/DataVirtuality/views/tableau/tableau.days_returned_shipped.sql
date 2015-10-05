-- Name: tableau.days_returned_shipped
-- Created: 2015-04-24 18:23:53
-- Updated: 2015-04-24 18:23:53

create view tableau.days_returned_shipped
as
SELECT 
co.customer_id, 
co.id, 
co.parent_order_id,
co.order_type, 
co.date_returned, 
a.original_return_date,
co.date_shipped
FROM views.customer_order co
left join
(select
id,
date_returned as original_return_date
from
views.customer_order) a
on a.id = parent_order_id
where co.parent_order_id is not null


