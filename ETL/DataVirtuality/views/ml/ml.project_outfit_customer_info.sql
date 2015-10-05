-- Name: ml.project_outfit_customer_info
-- Created: 2015-04-24 18:23:04
-- Updated: 2015-04-24 18:23:04

CREATE VIEW ml.project_outfit_customer_info AS
SELECT 
	c.customer_id,
	c.first_name,
	c.last_name,
	cos.order_ids
FROM bi.customer AS c
INNER JOIN ml.customer_orders AS cos
	ON cos.customer_id = c.customer_id


