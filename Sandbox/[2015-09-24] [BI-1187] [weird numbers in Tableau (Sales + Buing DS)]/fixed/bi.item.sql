-- Name: bi.item
-- Created: 2015-04-27 18:59:47
-- Updated: 2015-08-18 18:46:31

CREATE VIEW bi.item 
AS

SELECT
	aiv.article_id,
	aiv.supplier_article_id,
	item.item_no,
	item.variant_code,
	item.item_no ||' - '|| item.color AS item_no_color,
	item.parent_no,
	item.ean,
	item.vendor_item_no,
	item.item_description,
	item.item_status_purchase,
	item.item_status_purchase_description,
	item.category_code,	
	item.category,
	item.product_group_code,
	item.product_group,
	item.item_status,
	item.item_status_internal,
	item.countries_blocked,
	item.net_weight,
	item.gross_weight,
	item.unit_of_measure,
	item.country_region_of_origin,
	item.tariff_no,
	item.tariff_no_ch,
	item.color_code,
	item.color,
	item.supplier_color,
	item.size,
	item.size_component_group,
	/* item.material_code,
	item.material, */
	item.season,
	item.brand_code,
	item.brand,
	item.has_picture,
	REPLACE(item.pic1,'\\10.0.0.4\','http://article.apps.outfittery.de/resize/catalog/') AS pic1,
	REPLACE(item.pic2,'\\10.0.0.4\','http://article.apps.outfittery.de/resize/catalog/') AS pic2,
	REPLACE(item.pic3,'\\10.0.0.4\','http://article.apps.outfittery.de/resize/catalog/') AS pic3,
	REPLACE(item.pic4,'\\10.0.0.4\','http://article.apps.outfittery.de/resize/catalog/') AS pic4,
	REPLACE(item.pic5,'\\10.0.0.4\','http://article.apps.outfittery.de/resize/catalog/') AS pic5,
	REPLACE(item.pic6,'\\10.0.0.4\','http://article.apps.outfittery.de/resize/catalog/') AS pic6,
	item.unit_cost,
	item.unit_price_be,
	item.unit_price_ch,
	item.unit_price_de,
	item.unit_price_dk,
	item.unit_price_fi,
	item.unit_price_gb,
	item.unit_price_lu,
	item.unit_price_nl,
	item.unit_price_pl,
	item.unit_price_se,
	CASE 
		WHEN "brand"='PAUL HUNTER' then 1
		ELSE 0 
	END AS paul_hunter,
	COALESCE(mt.has_material_code,0) AS has_material_code,
	COALESCE(mt.has_quantity,0) AS has_quantity,
	br.pool,
	br.buyer,
	case when a_sample.sample_size is null then 'N'
	     else a_sample.sample_size
	end as sample_size
	
FROM
	raw.nav_item as item
	LEFT JOIN
	raw.ami_article_item_variant AS aiv
		 ON item.item_no 		= aiv.item_no
		AND item.variant_code 	= aiv.variant_code
	LEFT JOIN
	(
		SELECT 
			item_no,
			MAX(CASE WHEN material_code IS NOT NULL THEN 1 ELSE 0 END) has_material_code,
			MAX(CASE WHEN quantity>1 THEN 1 ELSE 0 END) has_quantity
		FROM "raw.nav_item_materials"
		GROUP BY 1
	)mt on item.item_no=mt.item_no
	LEFT JOIN
	(
		SELECT 
			"name",
			pool,
			buyer 
		FROM "dwh.brands" 
		WHERE pool is not null
		GROUP BY 1,2,3
	) br on br."name"=item.brand
	LEFT JOIN dwh.article_size_sample a_sample
		on a_sample.category=item.category
		and item.size=a_sample.size
		and a_sample.size_group_code = item.size_component_group
