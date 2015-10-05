-- Name: ob.article__molor
-- Created: 2015-06-11 18:38:28
-- Updated: 2015-06-19 11:41:35

CREATE VIEW ob.article__molor AS
SELECT
	item.article_id,
	item.item_no || '_' || item.color_code AS molor_id
FROM bi.item item
WHERE item.article_id IS NOT NULL
  AND item.item_status != 'Stop Amidala'
ORDER BY item.article_id ASC


