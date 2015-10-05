-- Name: views.purchase_order_position
-- Created: 2015-04-24 18:17:14
-- Updated: 2015-04-24 18:17:14

CREATE VIEW views.purchase_order_position AS 

SELECT 
	pop.id, 
	pop.article_id, 
	pop.purchase_order_id, 
	pop.date_created, 
	pop.fulfilled_quantity, 
	pop.last_updated, 
	pop.quantity, 
	pop.supplier_order_number, 
	pop.date_canceled, 
	pop.date_fulfilled, 
	pop.order_position_id, 
	pop.state, 
	pop.initial_quantity, 
	pop.retail_price, 
	pop.purchase_price, 
	pop.purchase_order_positions_idx, 
	pop.earliest_delivery_date, 
	pop.latest_delivery_date, 
	case when pim.ean is null then sa.ean else pim.ean end as ean, 
	pim.article_name, 
	pim.color1, 
	pim.eu_size, 
	pim.hanging_garments, 
	pim.pic1, 
	pim.supplier_sku, 
	pim.alternative_supplier_sku, 
	pim.commodity_group3,
	pim.eu_length 
FROM postgres.purchase_order_position pop 
LEFT JOIN postgres.supplier_article sa ON sa.article_id = pop.article_id
LEFT JOIN 
(
	SELECT 
		o.ean, 
		o.article_name, 
		o.color1, 
		o.eu_size,
		o.pic1, 
		o.hanging_garments, 
		o.supplier_sku, 
		o.alternative_supplier_sku, 
		o.eu_length,
		CASE 
			WHEN cg3.title_de is not null THEN cg3.title_de 
			ELSE o.commodity_group3 
		END as commodity_group3
  	FROM pim.object_17 o
	INNER JOIN pim.object_17 AS parent ON parent.o_id = o.o_parentid 
	INNER JOIN pim.object_17 AS parent_parent ON parent_parent.o_id = parent.o_parentid
	LEFT JOIN dwh.commodity_group3 cg3 ON cg3.commodity_group3 = o.commodity_group3
)AS pim ON pim.ean = sa.ean
WHERE sa.supplier_id = 15


/* reverting to original code for erp
SELECT 
	poa.poa_id AS id, 
	poa.article_id, 
	poa.purchase_order_id, 
	poa.date_poa_created AS date_created, 
	CAST(poa.stock_booked AS INTEGER) AS fulfilled_quantity, 
	poa.date_poa_updated AS last_updated, 
	poa.stock_ordered_revised AS quantity, 
	poa.poa_supplier_order_number AS supplier_order_number, 
	poa.date_poa_cancelled AS date_canceled, 
	CAST(poa.date_stock_booked_min AS TIMESTAMP) AS date_fulfilled, 
	poa.order_position_id AS order_position_id, 
	CAST(poa.poa_state_number AS INTEGER) AS state, 
	CAST(poa.stock_ordered_initially AS LONG) AS initial_quantity, 
	poa.article_sales_price AS retail_price, 
	poa.article_cost AS purchase_price, 
	CAST(poa.poa_position_number AS INTEGER) AS purchase_order_positions_idx, 
	CAST(poa.date_poa_delivery_earliest AS TIMESTAMP) AS earliest_delivery_date, 
	CAST(poa.date_poa_delivery_latest AS TIMESTAMP) AS latest_delivery_date, 
	CAST(a.article_ean AS STRING(4000)) AS ean,
	a.article_name,
	a.article_color1 AS color1,
	CAST(a.article_eu_size AS STRING(255)) AS eu_size,
	a.article_hanging_garment AS hanging_garments,
	a.article_pic1 AS pic1,
	CAST(a.article_supplier_sku AS STRING(255)) AS supplier_sku,
	CAST(a.article_supplier_alternative_sku AS STRING(255)) AS alternative_supplier_sku,
	pim.commodity_group3,
	CAST(a.article_eu_length AS STRING(255)) AS eu_length
FROM
	bi.purchase_order_articles poa
	JOIN
	bi.article a
		ON a.article_id = poa.article_id
	LEFT JOIN
	(
		SELECT DISTINCT
			o.ean,
			COALESCE(cg3.title_de, o.commodity_group3) AS commodity_group3
	  	FROM raw.article_detail_pim o
	  	INNER JOIN raw.article_detail_pim AS parent ON parent.oo_id = o.o_parent_id
		INNER JOIN raw.article_detail_pim AS parent_parent ON parent_parent.oo_id = parent.o_parent_id
		LEFT JOIN dwh.commodity_group3 cg3 ON cg3.commodity_group3 = o.commodity_group3
	) AS pim ON pim.ean = poa.article_ean
WHERE 
	a.article_ever_supplied_by_outfittery = 'Outfittery'
AND poa.driving_tbl_poa IS NOT NULL	
*/


