-- Name: tableau.data_source_own_stock_2
-- Created: 2015-06-03 10:21:33
-- Updated: 2015-08-18 18:50:01

CREATE VIEW tableau.data_source_own_stock_2 AS

SELECT 
	inv.article_id,
	inv.date_created,
	CAST(inv.quantity AS SMALLINT) quantity,
	CAST(inv.reserved AS SMALLINT) reserved,
	CAST(inv.quantity2 AS SMALLINT) quantity2,
	CAST(inv.reserved2 AS SMALLINT) reserved2,
	CAST(inv.quantity_ow_dlv AS SMALLINT) quantity_ow_dlv,
	CAST(inv.quantity_z_dlv AS SMALLINT) quantity_z_dlv,
	CAST(inv.quantity_ow_lret AS SMALLINT) quantity_ow_lret,
	CAST(inv.quantity_z_lret AS SMALLINT) quantity_z_lret,
	CAST(inv.pop_fulfilled_quantity AS INTEGER) pop_fulfilled_quantity,
	CAST(inv.pop_quantity AS INTEGER) pop_quantity,
	CAST(inv.pop_initial_quantity AS INTEGER) pop_initial_quantity,
	ROUND(CAST(inv.pop_retail_price_min AS DECIMAL), 2) pop_retail_price_min,
	ROUND(CAST(inv.pop_purchase_price_min AS DECIMAL), 2) pop_purchase_price_min,
	ROUND(CAST(inv.pop_retail_price_max AS DECIMAL), 2) pop_retail_price_max,
	ROUND(CAST(inv.pop_purchase_price_max AS DECIMAL), 2) pop_purchase_price_max,
	ROUND(CAST(inv.pop_retail_price_avg AS DECIMAL), 2) pop_retail_price_avg,
	ROUND(CAST(inv.pop_purchase_price_avg AS DECIMAL), 2) pop_purchase_price_avg,
	ROUND(CAST(inv.pop_intial_quantity_retail AS DECIMAL), 2) pop_intial_quantity_retail,
	ROUND(CAST(inv.pop_intial_quantity_purchase AS DECIMAL), 2) pop_intial_quantity_purchase,
	ROUND(CAST(inv.pop_quantity_retail AS DECIMAL), 2) pop_quantity_retail,
	ROUND(CAST(inv.pop_quantity_purchase AS DECIMAL), 2) pop_quantity_purchase,
	ROUND(CAST(inv.pop_fulfilled_quantity_retail AS DECIMAL), 2) pop_fulfilled_quantity_retail,
	ROUND(CAST(inv.pop_fulfilled_quantity_purchase AS DECIMAL), 2) pop_fulfilled_quantity_purchase,
	CAST(inv.final_stock AS SMALLINT) final_stock,
	CAST(inv.final_reserved AS SMALLINT) final_reserved,
	ROUND(CAST(inv.avg_purchase_price_128_all AS DECIMAL), 2) avg_purchase_price_128_all,
	ROUND(CAST(inv.avg_retail_price_128_all AS DECIMAL), 2) avg_retail_price_128_all,
	CAST(inv.shipped_128_all AS SMALLINT) shipped_128_all,
	ROUND(CAST(inv.shipped_128_ek_all AS DECIMAL), 2) shipped_128_ek_all,
	ROUND(CAST(inv.shipped_128_vk_all AS DECIMAL), 2) shipped_128_vk_all,
	CAST(inv.shipped_128_de AS SMALLINT) shipped_128_de,
	ROUND(CAST(inv.shipped_128_ek_de AS DECIMAL), 2) shipped_128_ek_de,
	ROUND(CAST(inv.shipped_128_vk_de AS DECIMAL), 2) shipped_128_vk_de,
	CAST(inv.shipped_128_at AS SMALLINT) shipped_128_at,
	ROUND(CAST(inv.shipped_128_ek_at AS DECIMAL), 2) shipped_128_ek_at,
	ROUND(CAST(inv.shipped_128_vk_at AS DECIMAL), 2) shipped_128_vk_at,
	CAST(inv.shipped_128_ch AS SMALLINT) shipped_128_ch,
	ROUND(CAST(inv.shipped_128_ek_ch AS DECIMAL), 2) shipped_128_ek_ch,
	ROUND(CAST(inv.shipped_128_vk_ch AS DECIMAL), 2) shipped_128_vk_ch,
	CAST(inv.shipped_128_nl AS SMALLINT) shipped_128_nl,
	ROUND(CAST(inv.shipped_128_ek_nl AS DECIMAL), 2) shipped_128_ek_nl,
	ROUND(CAST(inv.shipped_128_vk_nl AS DECIMAL), 2) shipped_128_vk_nl,
	CAST(inv.shipped_128_dk AS SMALLINT) shipped_128_dk,
	ROUND(CAST(inv.shipped_128_ek_dk AS DECIMAL), 2) shipped_128_ek_dk,
	ROUND(CAST(inv.shipped_128_vk_dk AS DECIMAL), 2) shipped_128_vk_dk,
	CAST(inv.shipped_128_se AS SMALLINT) shipped_128_se,
	ROUND(CAST(inv.shipped_128_ek_se AS DECIMAL), 2) shipped_128_ek_se,
	ROUND(CAST(inv.shipped_128_vk_se AS DECIMAL), 2) shipped_128_vk_se,
	CAST(inv.shipped_128_lu AS SMALLINT) shipped_128_lu,
	ROUND(CAST(inv.shipped_128_ek_lu AS DECIMAL), 2) shipped_128_ek_lu,
	ROUND(CAST(inv.shipped_128_vk_lu AS DECIMAL), 2) shipped_128_vk_lu,
	CAST(inv.shipped_128_be AS SMALLINT) shipped_128_be,
	ROUND(CAST(inv.shipped_128_ek_be AS DECIMAL), 2) shipped_128_ek_be,
	ROUND(CAST(inv.shipped_128_vk_be AS DECIMAL), 2) shipped_128_vk_be,
	CAST(inv.completed_1024_all AS SMALLINT) completed_1024_all,
	ROUND(CAST(inv.completed_1024_ek_all AS DECIMAL), 2) completed_1024_ek_all,
	ROUND(CAST(inv.completed_1024_vk_all AS DECIMAL), 2) completed_1024_vk_all,
	CAST(inv.completed_1024_de AS SMALLINT) completed_1024_de,
	ROUND(CAST(inv.completed_1024_ek_de AS DECIMAL), 2) completed_1024_ek_de,
	ROUND(CAST(inv.completed_1024_vk_de AS DECIMAL), 2) completed_1024_vk_de,
	CAST(inv.completed_1024_at AS SMALLINT) completed_1024_at,
	ROUND(CAST(inv.completed_1024_ek_at AS DECIMAL), 2) completed_1024_ek_at,
	ROUND(CAST(inv.completed_1024_vk_at AS DECIMAL), 2) completed_1024_vk_at,
	CAST(inv.completed_1024_ch AS SMALLINT) completed_1024_ch,
	ROUND(CAST(inv.completed_1024_ek_ch AS DECIMAL), 2) completed_1024_ek_ch,
	ROUND(CAST(inv.completed_1024_vk_ch AS DECIMAL), 2) completed_1024_vk_ch,
	CAST(inv.completed_1024_nl AS SMALLINT) completed_1024_nl,
	ROUND(CAST(inv.completed_1024_ek_nl AS DECIMAL), 2) completed_1024_ek_nl,
	ROUND(CAST(inv.completed_1024_vk_nl AS DECIMAL), 2) completed_1024_vk_nl,
	CAST(inv.completed_1024_dk AS SMALLINT) completed_1024_dk,
	ROUND(CAST(inv.completed_1024_ek_dk AS DECIMAL), 2) completed_1024_ek_dk,
	ROUND(CAST(inv.completed_1024_vk_dk AS DECIMAL), 2) completed_1024_vk_dk,
	CAST(inv.completed_1024_se AS SMALLINT) completed_1024_se,
	ROUND(CAST(inv.completed_1024_ek_se AS DECIMAL), 2) completed_1024_ek_se,
	ROUND(CAST(inv.completed_1024_vk_se AS DECIMAL), 2) completed_1024_vk_se,
	CAST(inv.completed_1024_lu AS SMALLINT) completed_1024_lu,
	ROUND(CAST(inv.completed_1024_ek_lu AS DECIMAL), 2) completed_1024_ek_lu,
	ROUND(CAST(inv.completed_1024_vk_lu AS DECIMAL), 2) completed_1024_vk_lu,
	CAST(inv.completed_1024_be AS SMALLINT) completed_1024_be,
	ROUND(CAST(inv.completed_1024_ek_be AS DECIMAL), 2) completed_1024_ek_be,
	ROUND(CAST(inv.completed_1024_vk_be AS DECIMAL), 2) completed_1024_vk_be,
	ROUND(CAST(inv.avg_retail_price_1024_all AS DECIMAL), 2) avg_retail_price_1024_all,
	ROUND(CAST(inv.avg_retail_price_1024_de AS DECIMAL), 2) avg_retail_price_1024_de,
	ROUND(CAST(inv.avg_retail_price_1024_at AS DECIMAL), 2) avg_retail_price_1024_at,
	ROUND(CAST(inv.avg_retail_price_1024_ch AS DECIMAL), 2) avg_retail_price_1024_ch,
	ROUND(CAST(inv.avg_retail_price_1024_nl AS DECIMAL), 2) avg_retail_price_1024_nl,
	ROUND(CAST(inv.avg_retail_price_1024_dk AS DECIMAL), 2) avg_retail_price_1024_dk,
	ROUND(CAST(inv.avg_retail_price_1024_se AS DECIMAL), 2) avg_retail_price_1024_se,
	ROUND(CAST(inv.avg_retail_price_1024_lu AS DECIMAL), 2) avg_retail_price_1024_lu,
	ROUND(CAST(inv.avg_retail_price_1024_be AS DECIMAL), 2) avg_retail_price_1024_be,
	CAST(inv.returned_512_all AS SMALLINT) returned_512_all,
	ROUND(CAST(inv.returned_512_ek_all AS DECIMAL), 2) returned_512_ek_all,
	ROUND(CAST(inv.returned_512_vk_all AS DECIMAL), 2) returned_512_vk_all,
	ROUND(CAST(inv.avg_purchase_price_512_all AS DECIMAL), 2) avg_purchase_price_512_all,
	ROUND(CAST(inv.avg_retail_price_512_all AS DECIMAL), 2) avg_retail_price_512_all,
	CAST(inv.returned_512_de AS SMALLINT) returned_512_de,
	ROUND(CAST(inv.returned_512_ek_de AS DECIMAL), 2) returned_512_ek_de,
	ROUND(CAST(inv.returned_512_vk_de AS DECIMAL), 2) returned_512_vk_de,
	CAST(inv.returned_512_at AS SMALLINT) returned_512_at,
	ROUND(CAST(inv.returned_512_ek_at AS DECIMAL), 2) returned_512_ek_at,
	ROUND(CAST(inv.returned_512_vk_at AS DECIMAL), 2) returned_512_vk_at,
	CAST(inv.returned_512_ch AS SMALLINT) returned_512_ch,
	ROUND(CAST(inv.returned_512_ek_ch AS DECIMAL), 2) returned_512_ek_ch,
	ROUND(CAST(inv.returned_512_vk_ch AS DECIMAL), 2) returned_512_vk_ch,
	CAST(inv.returned_512_nl AS SMALLINT) returned_512_nl,
	ROUND(CAST(inv.returned_512_ek_nl AS DECIMAL), 2) returned_512_ek_nl,
	ROUND(CAST(inv.returned_512_vk_nl AS DECIMAL), 2) returned_512_vk_nl,
	CAST(inv.returned_512_dk AS SMALLINT) returned_512_dk,
	ROUND(CAST(inv.returned_512_ek_dk AS DECIMAL), 2) returned_512_ek_dk,
	ROUND(CAST(inv.returned_512_vk_dk AS DECIMAL), 2) returned_512_vk_dk,
	CAST(inv.returned_512_se AS SMALLINT) returned_512_se,
	ROUND(CAST(inv.returned_512_ek_se AS DECIMAL), 2) returned_512_ek_se,
	ROUND(CAST(inv.returned_512_vk_se AS DECIMAL), 2) returned_512_vk_se,
	CAST(inv.returned_512_lu AS SMALLINT) returned_512_lu,
	ROUND(CAST(inv.returned_512_ek_lu AS DECIMAL), 2) returned_512_ek_lu,
	ROUND(CAST(inv.returned_512_vk_lu AS DECIMAL), 2) returned_512_vk_lu,
	CAST(inv.returned_512_be AS SMALLINT) returned_512_be,
	ROUND(CAST(inv.returned_512_ek_be AS DECIMAL), 2) returned_512_ek_be,
	ROUND(CAST(inv.returned_512_vk_be AS DECIMAL), 2) returned_512_vk_be,
	CAST(inv.lost_1536_all AS SMALLINT) lost_1536_all,
	ROUND(CAST(inv.lost_1536_ek_all AS DECIMAL), 2) lost_1536_ek_all,
	ROUND(CAST(inv.lost_1536_vk_all AS DECIMAL), 2) lost_1536_vk_all,
	CAST(inv.sum_virtual_stock_quantity AS SMALLINT) sum_virtual_stock_quantity,
	ROUND(CAST(inv.sum_vk_stock AS DECIMAL), 2) sum_vk_stock,
	ROUND(CAST(inv.sum_ek_stock AS DECIMAL), 2) sum_ek_stock,
	ROUND(CAST(inv.avg_virtual_stock_vk AS DECIMAL), 2) avg_virtual_stock_vk,
	ROUND(CAST(inv.avg_virtual_stock_ek AS DECIMAL), 2) avg_virtual_stock_ek,
	ROUND(CAST(inv.avg_purchase_price_128_partner AS DECIMAL), 2) avg_purchase_price_128_partner,
	ROUND(CAST(inv.avg_retail_price_128_partner AS DECIMAL), 2) avg_retail_price_128_partner,
	CAST(inv.shipped_128_partner AS SMALLINT) shipped_128_partner,
	ROUND(CAST(inv.shipped_128_ek_partner AS DECIMAL), 2) shipped_128_ek_partner,
	ROUND(CAST(inv.shipped_128_vk_partner AS DECIMAL), 2) shipped_128_vk_partner,
	ROUND(CAST(inv.shipped_128_de_partner AS DECIMAL), 2) shipped_128_de_partner,
	ROUND(CAST(inv.shipped_128_ek_de_partner AS DECIMAL), 2) shipped_128_ek_de_partner,
	ROUND(CAST(inv.shipped_128_vk_de_partner AS DECIMAL), 2) shipped_128_vk_de_partner,
	ROUND(CAST(inv.shipped_128_at_partner AS DECIMAL), 2) shipped_128_at_partner,
	ROUND(CAST(inv.shipped_128_ek_at_partner AS DECIMAL), 2) shipped_128_ek_at_partner,
	ROUND(CAST(inv.shipped_128_vk_at_partner AS DECIMAL), 2) shipped_128_vk_at_partner,
	CAST(inv.shipped_128_ch_partner AS SMALLINT) shipped_128_ch_partner,
	ROUND(CAST(inv.shipped_128_ek_ch_partner AS DECIMAL), 2) shipped_128_ek_ch_partner,
	ROUND(CAST(inv.shipped_128_vk_ch_partner AS DECIMAL), 2) shipped_128_vk_ch_partner,
	CAST(inv.shipped_128_nl_partner AS SMALLINT) shipped_128_nl_partner,
	ROUND(CAST(inv.shipped_128_ek_nl_partner AS DECIMAL), 2) shipped_128_ek_nl_partner,
	ROUND(CAST(inv.shipped_128_vk_nl_partner AS DECIMAL), 2) shipped_128_vk_nl_partner,
	CAST(inv.shipped_128_dk_partner AS SMALLINT) shipped_128_dk_partner,
	ROUND(CAST(inv.shipped_128_ek_dk_partner AS DECIMAL), 2) shipped_128_ek_dk_partner,
	ROUND(CAST(inv.shipped_128_vk_dk_partner AS DECIMAL), 2) shipped_128_vk_dk_partner,
	CAST(inv.shipped_128_se_partner AS SMALLINT) shipped_128_se_partner,
	ROUND(CAST(inv.shipped_128_ek_se_partner AS DECIMAL), 2) shipped_128_ek_se_partner,
	ROUND(CAST(inv.shipped_128_vk_se_partner AS DECIMAL), 2) shipped_128_vk_se_partner,
	CAST(inv.shipped_128_lu_partner AS SMALLINT) shipped_128_lu_partner,
	ROUND(CAST(inv.shipped_128_ek_lu_partner AS DECIMAL), 2) shipped_128_ek_lu_partner,
	ROUND(CAST(inv.shipped_128_vk_lu_partner AS DECIMAL), 2) shipped_128_vk_lu_partner,
	CAST(inv.shipped_128_be_partner AS SMALLINT) shipped_128_be_partner,
	ROUND(CAST(inv.shipped_128_ek_be_partner AS DECIMAL), 2) shipped_128_ek_be_partner,
	ROUND(CAST(inv.shipped_128_vk_be_partner AS DECIMAL), 2) shipped_128_vk_be_partner,
	CAST(inv.completed_1024_partner AS SMALLINT) completed_1024_partner,
	ROUND(CAST(inv.completed_1024_ek_partner AS DECIMAL), 2) completed_1024_ek_partner,
	ROUND(CAST(inv.completed_1024_vk_partner AS DECIMAL), 2) completed_1024_vk_partner,
	ROUND(CAST(inv.avg_retail_price_1024_de_partner AS DECIMAL), 2) avg_retail_price_1024_de_partner,
	CAST(inv.completed_1024_de_partner AS SMALLINT) completed_1024_de_partner,
	ROUND(CAST(inv.completed_1024_ek_de_partner AS DECIMAL), 2) completed_1024_ek_de_partner,
	ROUND(CAST(inv.completed_1024_vk_de_partner AS DECIMAL), 2) completed_1024_vk_de_partner,
	ROUND(CAST(inv.avg_retail_price_1024_at_partner AS DECIMAL), 2) avg_retail_price_1024_at_partner,
	CAST(inv.completed_1024_at_partner AS SMALLINT) completed_1024_at_partner,
	ROUND(CAST(inv.completed_1024_ek_at_partner AS DECIMAL), 2) completed_1024_ek_at_partner,
	ROUND(CAST(inv.completed_1024_vk_at_partner AS DECIMAL), 2) completed_1024_vk_at_partner,
	ROUND(CAST(inv.avg_retail_price_1024_ch_partner AS DECIMAL), 2) avg_retail_price_1024_ch_partner,
	CAST(inv.completed_1024_ch_partner AS SMALLINT) completed_1024_ch_partner,
	ROUND(CAST(inv.completed_1024_ek_ch_partner AS DECIMAL), 2) completed_1024_ek_ch_partner,
	ROUND(CAST(inv.completed_1024_vk_ch_partner AS DECIMAL), 2) completed_1024_vk_ch_partner,
	ROUND(CAST(inv.avg_retail_price_1024_nl_partner AS DECIMAL), 2) avg_retail_price_1024_nl_partner,
	CAST(inv.completed_1024_nl_partner AS SMALLINT) completed_1024_nl_partner,
	ROUND(CAST(inv.completed_1024_ek_nl_partner AS DECIMAL), 2) completed_1024_ek_nl_partner,
	ROUND(CAST(inv.completed_1024_vk_nl_partner AS DECIMAL), 2) completed_1024_vk_nl_partner,
	ROUND(CAST(inv.avg_retail_price_1024_dk_partner AS DECIMAL), 2) avg_retail_price_1024_dk_partner,
	CAST(inv.completed_1024_dk_partner AS SMALLINT) completed_1024_dk_partner,
	ROUND(CAST(inv.completed_1024_ek_dk_partner AS DECIMAL), 2) completed_1024_ek_dk_partner,
	ROUND(CAST(inv.completed_1024_vk_dk_partner AS DECIMAL), 2) completed_1024_vk_dk_partner,
	ROUND(CAST(inv.avg_retail_price_1024_se_partner AS DECIMAL), 2) avg_retail_price_1024_se_partner,
	CAST(inv.completed_1024_se_partner AS SMALLINT) completed_1024_se_partner,
	ROUND(CAST(inv.completed_1024_ek_se_partner AS DECIMAL), 2) completed_1024_ek_se_partner,
	ROUND(CAST(inv.completed_1024_vk_se_partner AS DECIMAL), 2) completed_1024_vk_se_partner,
	ROUND(CAST(inv.avg_retail_price_1024_lu_partner AS DECIMAL), 2) avg_retail_price_1024_lu_partner,
	CAST(inv.completed_1024_lu_partner AS SMALLINT) completed_1024_lu_partner,
	ROUND(CAST(inv.completed_1024_ek_lu_partner AS DECIMAL), 2) completed_1024_ek_lu_partner,
	ROUND(CAST(inv.completed_1024_vk_lu_partner AS DECIMAL), 2) completed_1024_vk_lu_partner,
	ROUND(CAST(inv.avg_retail_price_1024_be_partner AS DECIMAL), 2) avg_retail_price_1024_be_partner,
	CAST(inv.completed_1024_be_partner AS SMALLINT) completed_1024_be_partner,
	ROUND(CAST(inv.completed_1024_ek_be_partner AS DECIMAL), 2) completed_1024_ek_be_partner,
	ROUND(CAST(inv.completed_1024_vk_be_partner AS DECIMAL), 2) completed_1024_vk_be_partner,
	ROUND(CAST(inv.avg_purchase_price_1024_partner AS DECIMAL), 2) avg_purchase_price_1024_partner,
	ROUND(CAST(inv.avg_retail_price_1024_partner AS DECIMAL), 2) avg_retail_price_1024_partner,
	CAST(inv.returned_512_partner AS SMALLINT) returned_512_partner,
	ROUND(CAST(inv.returned_512_ek_partner AS DECIMAL), 2) returned_512_ek_partner,
	ROUND(CAST(inv.returned_512_vk_partner AS DECIMAL), 2) returned_512_vk_partner,
	ROUND(CAST(inv.avg_purchase_price_512_partner AS DECIMAL), 2) avg_purchase_price_512_partner,
	ROUND(CAST(inv.avg_retail_price_512_partner AS DECIMAL), 2) avg_retail_price_512_partner,
	CAST(inv.sum_virtual_stock_quantity_partner AS SMALLINT) sum_virtual_stock_quantity_partner,
	ROUND(CAST(inv.sum_vk_stock_partner AS DECIMAL), 2) sum_vk_stock_partner,
	ROUND(CAST(inv.sum_ek_stock_partner AS DECIMAL), 2) sum_ek_stock_partner,
	ROUND(CAST(inv.avg_virtual_stock_vk_partner AS DECIMAL), 2) avg_virtual_stock_vk_partner,
	ROUND(CAST(inv.avg_virtual_stock_ek_partner AS DECIMAL), 2) avg_virtual_stock_ek_partner,
	
	item.item_no,
	item.variant_code,
	item.supplier_article_id,
	item.parent_no,
	item.ean,
	item.vendor_item_no,
	item.item_description,
	item.item_status_purchase_description,
	item.category,
	item.product_group,
	item.item_status,
	item.item_status_internal,
	CASE
		WHEN item.countries_blocked IS NULL THEN 'not blacklisted'
		ELSE item.countries_blocked
	END AS countries_blocked,
	item.net_weight,
	item.gross_weight,
	item.unit_of_measure,
	item.country_region_of_origin,
	item.tariff_no,
	item.tariff_no_ch,
	item.color,
	item.supplier_color,
	item.size,
	item.season,
	item.brand,
	item.has_picture,
	item.pic1,
	item.unit_cost,
	item.unit_price_be,
	item.unit_price_ch,
	item.unit_price_de,
	item.unit_price_dk,
	item.unit_price_lu,
	item.unit_price_nl,
	item.unit_price_se,
	item.has_material_code,
	item.has_quantity,
	item.pool,
	item.buyer,
	item.paul_hunter,
	item.sample_size,
	/* the following are actually at the item_no level, not the article_id level */
	book.date_po_received_min,
	book.date_po_received_max,
	CAST(TIMESTAMPDIFF(SQL_TSI_DAY,book.date_po_received_min,CURDATE()) AS SMALLINT) AS days_since_first_received_into_inventory,
	CAST(TIMESTAMPDIFF(SQL_TSI_DAY,book.date_po_received_min, book.date_po_received_max) AS SMALLINT) AS days_in_inventory

FROM
	views.inventory AS inv
	LEFT JOIN
	bi.item
		 ON inv.article_id = item.article_id
	LEFT JOIN
	bi.po_received_dates AS book
		ON inv.article_id = book.article_id
WHERE
	/* the following filter is used to eliminate rows with no useable data */
	COALESCE(ABS(inv.quantity),0) + 
	COALESCE(ABS(inv.reserved),0) + 
	COALESCE(ABS(inv.quantity2),0) + 
	COALESCE(ABS(inv.reserved2),0) + 
	COALESCE(ABS(inv.quantity_ow_dlv),0) + 
	COALESCE(ABS(inv.quantity_z_dlv),0) + 
	COALESCE(ABS(inv.quantity_ow_lret),0) + 
	COALESCE(ABS(inv.quantity_z_lret),0) + 
	COALESCE(ABS(inv.pop_fulfilled_quantity),0) + 
	COALESCE(ABS(inv.pop_quantity),0) + 
	COALESCE(ABS(inv.pop_initial_quantity),0) + 
	COALESCE(ABS(inv.final_stock),0) + 
	COALESCE(ABS(inv.final_reserved),0) + 
	COALESCE(ABS(inv.shipped_128_all),0) + 
	COALESCE(ABS(inv.completed_1024_all),0) + 
	COALESCE(ABS(inv.returned_512_all),0) + 
	COALESCE(ABS(inv.lost_1536_all),0) + 
	COALESCE(ABS(inv.sum_virtual_stock_quantity),0) + 
	COALESCE(ABS(inv.shipped_128_partner),0) + 
	COALESCE(ABS(inv.completed_1024_partner),0) + 
	COALESCE(ABS(inv.returned_512_partner),0) + 
	COALESCE(ABS(inv.sum_virtual_stock_quantity_partner),0)
	>0

/*  LIMIT 100000 */

