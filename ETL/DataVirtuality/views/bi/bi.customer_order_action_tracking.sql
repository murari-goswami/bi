-- Name: bi.customer_order_action_tracking
-- Created: 2015-04-24 18:20:50
-- Updated: 2015-04-24 18:20:50

CREATE VIEW bi.customer_order_action_tracking AS

SELECT
	co.order_id,
	co.stylist_id,
	at.stylist_name,
	SUM(at.stylist_pick_minutes) 		AS stylist_pick_minutes,
	SUM(at.stylist_article_adds) 		AS stylist_article_adds,
	SUM(at.stylist_article_searches) 	AS stylist_article_searches,
	SUM(at.stylist_article_removals) 	AS stylist_article_removals,
	MIN(at.date_phone_call_started) 	AS date_phone_call_started,
	MAX(at.date_phone_call_ended) 		AS date_phone_call_ended
FROM 
	bi.customer_order AS co
	JOIN
	raw.stylist_action_tracking AS at
		 ON co.stylist_id = at.stylist_id
		AND co.order_id = at.order_id
GROUP BY 1,2,3


