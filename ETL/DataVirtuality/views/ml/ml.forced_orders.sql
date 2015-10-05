-- Name: ml.forced_orders
-- Created: 2015-06-09 18:20:27
-- Updated: 2015-06-09 18:57:47

CREATE VIEW ml.forced_orders AS
SELECT
co.order_id,
co.customer_id,
co.date_created,
co.order_state,
co.order_type,
co.sales_kept,
co.sales_channel,
CAST(bo.order_id IS NOT NULL AS INTEGER) AS "customer_complained"
FROM bi.customer_order co
LEFT JOIN "ml.orders_with_cs_reason_irrt_best" bo ON bo.order_id = co.order_id
LEFT JOIN bi.customer c ON c.customer_id = co.customer_id
WHERE co.date_created >= '2015-01-01'
AND co.date_created < '2015-05-01'


