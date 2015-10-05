-- Name: ml.project_return_time
-- Created: 2015-04-24 18:18:53
-- Updated: 2015-04-24 18:18:53

CREATE VIEW ml.project_return_time AS
SELECT
co.order_id,
c.customer_id,
co.date_created,
co.date_shipped_internal,
co.date_completed,
co.date_returned,
c.customer_age
FROM
raw.customer_order co
JOIN
raw.customer c
ON co.customer_id = c.customer_id
WHERE
co.state IN ('Completed')
AND
co.date_created > '2014-01-01'
AND
co.shipping_country = 'DE'
AND
co.payment_method = 'Invoice'
AND
co.order_type = 'First Order'
AND
co.date_returned IS NOT NULL
AND 
date_shipped_internal < date_completed
AND
co.date_shipped_internal != co.date_created


