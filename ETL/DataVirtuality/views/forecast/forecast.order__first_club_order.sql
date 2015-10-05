-- Name: forecast.order__first_club_order
-- Created: 2015-05-11 14:48:00
-- Updated: 2015-05-11 14:48:00

CREATE VIEW forecast.order__first_club_order AS
SELECT
	fo.order_id,
	CASE WHEN fo.rank = 1 THEN true ELSE false END AS is_first_club_order,
	CASE WHEN fo.rank != 1 THEN true ELSE false END AS is_non_first_club_order
FROM
(SELECT
	co.customer_id,
	co.order_id,
	co.date_shipped,
	ROW_NUMBER() OVER ( PARTITION BY co.customer_id ORDER BY co.date_shipped ASC) AS rank
FROM "bi.customer_order" co
WHERE co.order_type = 'Outfittery Club Order') AS fo


