-- Name: datamart.dim_order_position
-- Created: 2015-09-23 15:26:13
-- Updated: 2015-09-23 15:26:13

CREATE VIEW datamart.dim_order_position
AS

SELECT 
	fop.order_id, 
	fop.article_id,
	it.category, 
	it.product_group, 
	COALESCE(it.brand,art.article_brand) as brand,
	COALESCE(it.season,art.article_season) AS season,
	COALESCE(it.color,art.article_color) AS color,
	COALESCE(it.size,art.article_size) AS size,
	CASE
		WHEN brand='PAUL HUNTER' THEN '1'
		ELSE '0'
	END AS is_private_label,
	CASE
		WHEN stock_location_id=2 THEN '1'
		ELSE '0'
	END AS is_patner_stock,
	CASE
		WHEN COALESCE(it.ean,article_ean) in ('2009876543503','2009876543510','2009876543527','2009876636489','2009876543534','2009876543497') THEN '1'
		ELSE '0'
	END AS is_gift,
	CASE 
		WHEN it.item_status='Push' THEN 'Push'
		WHEN it.item_status='Stop Amidala' THEN 'Stop Amidala'
		WHEN it.item_status='Free' THEN 'Free'
	END AS item_status,
	CASE 
		WHEN it.item_status_purchase_description='Core' THEN 'Core'
		WHEN it.item_status_purchase_description='Promotion' THEN 'Promotion'
		WHEN it.item_status_purchase_description='Stop NOS' THEN 'Stop NOS'
	END AS item_status_purchase,
	it.item_status_internal,
	it.unit_price_de,
	it.unit_price_ch,
	it.unit_price_se,
	it.unit_price_nl,
	it.unit_price_lu,
	it.unit_price_be,
	it.unit_price_dk
	
FROM "raw.fact_order_position" fop 
LEFT JOIN "bi.item" it on it.article_id=fop.article_id
LEFT JOIN bi.article art on art.article_id=fop.article_id


