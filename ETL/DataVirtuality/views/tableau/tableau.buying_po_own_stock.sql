-- Name: tableau.buying_po_own_stock
-- Created: 2015-04-29 15:30:07
-- Updated: 2015-05-13 11:38:00

CREATE VIEW tableau.buying_po_own_stock AS

SELECT
pop.id,
pop.purchase_order_id,
pop.ean,
pop.article_id,
pop.earliest_delivery_date,
pop.fulfilled_quantity,
pop.initial_quantity,
pop.purchase_price,
pop.quantity,
pop.retail_price,

/*Purchase Order*/
po.season,
po.date_created as purchase_order_date_created,
po.stock_location_id as purchase_order_stock_location_id,
po.supplier_id as purchase_order_supplier_id,

/*Stock Booked*/
sma.min_date_created,
sma.max_date_created,
sma.dd_quantity_good,

/*Own Stock Articles*/
owa.o_parentId,
owa.season as ownstock_article_season,
owa.o_published,
owa.brand,
owa.date,
owa.article_name,
owa.article_size,
owa.supplier_sku,
owa.supplier_color_name,
owa.commodity_group1,
owa.commodity_group2,
owa.commodity_group3,
owa.commodity_group4

FROM views.purchase_order_position pop
JOIN views.purchase_order po ON pop.purchase_order_id = po.id
LEFT JOIN views.ownstock_article owa ON pop.article_id = owa.article_id
LEFT JOIN views.ownstock_article osa ON pop.article_id = osa.article_id
LEFT JOIN 
	(	SELECT
			article_id,
			purchase_order_id,
			MIN(date_stock_booked) AS min_date_created,
			MAX(date_stock_booked) AS max_date_created,
			SUM(po_bookings) AS dd_quantity_good
		FROM
			bi.stock_booked
		WHERE 
			po_bookings IS NOT NULL
		GROUP BY 1,2
	) AS sma
		ON pop.article_id = sma.article_id AND pop.purchase_order_id = sma.purchase_order_id


