-- Name: ml.stylist_order_time
-- Created: 2015-04-27 17:51:50
-- Updated: 2015-04-28 17:53:10

CREATE VIEW ml.stylist_order_time AS
SELECT
	atl.order_id,
   	atl.customer_id,
	atl.stylist_id,
	atl.time_spent_on_order,
	atl.start_time,
	atl.finish_time,
	atl.box_type
FROM
(SELECT DISTINCT
	aa.order_id,
   	co.customer_id,
	ato.stylist_id,
	aa.time_spent_on_order,
	aa.start_time,
	aa.finish_time,
	co.box_type,
	ROW_NUMBER() OVER (PARTITION BY aa.order_id ORDER BY aa.time_spent_on_order DESC) AS rk
FROM
(SELECT
   	a.order_id,
   	TIMESTAMPDIFF(SQL_TSI_MINUTE, MIN(a.date), MAX(a.date)) AS time_spent_on_order,
   	MIN(a.date) AS start_time,
 	MAX(a.date) AS finish_time
FROM
  	(SELECT
  		*
  	 FROM ml.action_tracking AS at
     	WHERE at.action IN ('ARTICLE_ADD', 'ARTICLE_REMOVE', 'INITIAL', 'SEARCH', 'PHONE_INTERFACE_START'))
     AS a
GROUP BY a.order_id) AS aa
JOIN ml.action_tracking AS ato
	ON ato.order_id = aa.order_id
JOIN bi.customer_order AS co
	ON co.order_id = aa.order_id) AS atl
WHERE atl.rk = 1
  AND atl.start_time > '2015-04-01'


