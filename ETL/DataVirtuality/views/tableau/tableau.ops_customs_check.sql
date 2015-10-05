-- Name: tableau.ops_customs_check
-- Created: 2015-06-25 11:49:27
-- Updated: 2015-06-29 15:33:20

CREATE VIEW tableau.ops_customs_check AS

SELECT
	stock.article_id,
	i.item_description,
	i.pic1,
	i.ean,
	i.item_status,
	i.net_weight,
	i.season,
	i.tariff_no,
	i.tariff_no_ch,
	i.brand,
	im.material

FROM
	raw.stock_levels_daily_snapshot stock
	LEFT JOIN
	bi.item i
		ON stock.article_id = i.article_id
	LEFT JOIN
	raw.nav_item_materials im
		ON i.item_no = im.item_no


