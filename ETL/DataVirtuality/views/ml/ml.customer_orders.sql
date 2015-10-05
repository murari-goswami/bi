-- Name: ml.customer_orders
-- Created: 2015-04-24 18:19:53
-- Updated: 2015-04-24 18:19:53

CREATE VIEW ml.customer_orders AS
SELECT
	order_agg.customer_id,
 	CAST(trim(trailing ',' from replace(to_chars(order_agg.order_blob, 'UTF-8'), unescape('\n'), ',')) AS STRING) AS order_ids
FROM
(SELECT
	co.customer_id,
	textagg(co.order_id QUOTE '') AS order_blob
FROM bi.customer_order AS co
GROUP BY co.customer_id) AS order_agg
ORDER BY customer_id ASC


