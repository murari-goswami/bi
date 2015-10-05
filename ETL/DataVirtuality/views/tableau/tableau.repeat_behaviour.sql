-- Name: tableau.repeat_behaviour
-- Created: 2015-09-23 14:13:09
-- Updated: 2015-09-23 14:25:19

CREATE VIEW tableau.repeat_behaviour
AS

SELECT
CAST(date_incoming as date) as date_incoming,
shipping_country,
CASE 
	WHEN discount_marketing=25 then '25'
	WHEN discount_marketing=50 THEN '50'
	ELSE 'No Discount'
END AS discount_type,
count(distinct case when order_type='First Order' then order_id else null end) as first_incoming_order,
count(distinct case when order_type<>'First Order' then order_id else null end) as repeat_incoming_order,
count(distinct case when order_type='First Order' and date_invoiced is not null then order_id end) as first_invoiced_orders,
count(distinct case when order_type<>'First Order' and date_invoiced is not null then order_id end) as repeat_invoiced_orders,
avg(case when order_type='First Order' then sales_kept end) as avg_first_sales_kept,
avg(case when order_type<>'First Order' then sales_kept end) as avg_repeat_sales_kept
FROM bi.customer_order
GROUP BY 1,2,3


