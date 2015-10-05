-- Name: forecast.customer_info
-- Created: 2015-05-21 14:53:49
-- Updated: 2015-05-21 14:53:49

CREATE VIEW forecast.customer_info AS
SELECT
	co.customer_id,
	co.date_shipped AS first_order_date_shipped,
	co.box_type AS first_order_box_type,
	co.shipping_country AS country,
	club.first_club_order_date_shipped
FROM "bi.customer_order" co
LEFT JOIN
(SELECT
	c.customer_id,
	c.date_shipped AS first_club_order_date_shipped
FROM
(SELECT 
	co2.customer_id,
    co2.date_shipped,
	ROW_NUMBER() OVER ( PARTITION BY co2.customer_id ORDER BY co2.date_shipped ASC) AS rank
 FROM "bi.customer_order" AS co2
 WHERE co2.order_type = 'Outfittery Club Order') AS c
WHERE c.rank = 1 ) AS club
	ON club.customer_id = co.customer_id
WHERE co.order_type = 'First Order'
AND co.date_shipped IS NOT NULL
ORDER BY co.customer_id


