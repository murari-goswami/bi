-- Name: tableau.bisdev_days_returned_followon_orders
-- Created: 2015-05-05 09:55:38
-- Updated: 2015-05-05 09:55:38

CREATE VIEW tableau.bisdev_days_returned_followon_orders
AS

SELECT 
	co.customer_id, 
	co.id, 
	co.parent_order_id,
	co.order_type, 
	co.date_returned, 
	a.original_return_date,
	co.date_shipped
FROM views.customer_order co
LEFT JOIN
(
	select
		id,
		date_returned as original_return_date
	from views.customer_order
) a
on a.id = parent_order_id
where co.parent_order_id is not null


