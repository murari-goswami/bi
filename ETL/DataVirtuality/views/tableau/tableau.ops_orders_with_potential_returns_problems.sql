-- Name: tableau.ops_orders_with_potential_returns_problems
-- Created: 2015-04-24 18:24:08
-- Updated: 2015-04-24 18:24:08

CREATE view tableau.ops_orders_with_potential_returns_problems
as
SELECT  
co.order_id,
co.customer_id,
co.articles_sent as total_articles,
co.order_state,
co.date_created,
co.date_invoiced,
co.shipping_country,
CASE WHEN co.articles_kept = co.articles_sent THEN 'Potential Issue' ELSE 'OK' END as problem_rating,
x.return_track_and_trace_number
FROM bi.customer_order co
LEFT JOIN 
(
	SELECT 
	dd.order_id,
	dd.return_track_and_trace_number
	FROM bi.customer_order_logistics dd
	GROUP BY 1,2
) x on x.order_id = co.order_id
WHERE co.date_invoiced > '2014-09%'
AND co.order_state_number > 24
AND co.articles_sent > 0


