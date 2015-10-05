-- Name: ml.article_push
-- Created: 2015-04-24 18:19:27
-- Updated: 2015-04-24 18:19:27

CREATE VIEW ml.article_push AS
SELECT
	aa.article_id AS article_id,
	CASE WHEN ap.attribute_identifier = 'true' THEN 1
	 	 WHEN ap.attribute_identifier = 'push_own_stock' THEN 1
	     WHEN ap.attribute_identifier = 'false' THEN 0
	     ELSE NULL
	  END AS push_item
FROM ml.article_attribute AS aa
JOIN ml.attribute_push AS ap
	ON aa.attribute_id = ap.attribute_id


