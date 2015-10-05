-- Name: tableau.buying_sandbox_articles_photo
-- Created: 2015-05-20 10:12:21
-- Updated: 2015-05-20 10:12:21

CREATE VIEW tableau.buying_sandbox_articles_photo
AS

SELECT
	poa.purchase_order_id,
	poa.date_poa_delivery_earliest as earliest_delivery_date,
	poa.date_poa_delivery_latest as latest_delivery_date,
	poa.stock_ordered_initially as quantity,
	poa.stock_fulfilled as fullfilled_quantity,
	po.po_season as season,
	art.article_o_parent_id as o_parentId,
	art.article_pic1 as pic1,
	sm.dd_quantity_good
FROM
raw.purchase_order_articles poa
JOIN raw.purchase_order po on po.purchase_order_id=poa.purchase_order_id
LEFT JOIN bi.article art on art.article_id=poa.article_id
LEFT JOIN
(
	SELECT 
		sb.purchase_order_id,
		sb.article_id, 
		sum(sb.stock_booked) dd_quantity_good
	FROM raw.stock_booked sb
	JOIN raw.purchase_order po on po.purchase_order_id=sb.purchase_order_id
	WHERE sb.stock_booking_code=1
	GROUP BY 1,2
)sm on po.purchase_order_id=poa.purchase_order_id AND sm.article_id=poa.article_id


