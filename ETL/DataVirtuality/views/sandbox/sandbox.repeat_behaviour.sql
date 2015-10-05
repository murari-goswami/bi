-- Name: sandbox.repeat_behaviour
-- Created: 2015-09-23 12:18:46
-- Updated: 2015-09-23 12:23:44

CREATE VIEW sandbox.repeat_behaviour
as

SELECT
CAST(date_incoming as date) as date_incoming,
shipping_country,
CASE 
	WHEN discount_marketing=25 then '25'
	WHEN discount_marketing=50 THEN '50'
	ELSE 'No Discount'
END AS discount_type,
order_type,
count(*) as incoming_order,
count(distinct case when date_invoiced is not null then order_id end) as invoiced_orders,
avg(sales_kept) as avg_sales_kept
FROM bi.customer_order
GROUP BY 1,2,3,4


