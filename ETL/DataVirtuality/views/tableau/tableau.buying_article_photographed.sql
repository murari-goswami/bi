-- Name: tableau.buying_article_photographed
-- Created: 2015-04-24 18:19:26
-- Updated: 2015-06-04 13:59:25

CREATE VIEW tableau.buying_article_photographed AS

SELECT 
	ap.*,
	item.season,
	item.item_description,
	item.brand,
	item.parent_no
FROM 
	dwh.article_picture ap
	LEFT JOIN 
	bi.item
		 ON ap.ean = item.ean


