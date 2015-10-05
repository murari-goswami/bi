-- Name: ml.customer_order_id_billed_before
-- Created: 2015-04-24 18:19:49
-- Updated: 2015-04-24 18:19:49

CREATE VIEW ml.customer_order_id_billed_before AS
SELECT
	co1.order_id AS order_id,
	SUM(co2.billing_total) AS billing_total
FROM bi.customer_order AS co1
INNER JOIN bi.customer_order AS co2
	ON co1.customer_id = co2.customer_id AND co1.date_stylist_picked > co2.date_stylist_picked
GROUP BY co1.order_id


