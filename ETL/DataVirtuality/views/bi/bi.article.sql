-- Name: bi.article
-- Created: 2015-04-24 18:19:31
-- Updated: 2015-04-24 18:19:31

CREATE VIEW bi.article AS

SELECT
	a.article_id,
	a.article_ean,
	amc.attribute_id AS article_attribute_id,
	a.article_oo_id,
	a.article_o_parent_id,
	/* a.article_sku,  THIS FIELD ALMOST ALWAYS NULL
	a.article_manufacturer_sku,
	a.article_manufacturer_alternative_sku, */
	a.article_supplier_sku, 
	a.article_supplier_alternative_sku,
	a.article_model_id,
	a.article_model_o_id,
	a.article_in_pim,
	a.article_suppliers,
	a.article_ever_supplied_by_outfittery,
	a.article_date_created,
	a.article_latest_delivery_date,
	a.article_earliest_delivery_date,
	a.article_amidala_active,
	a.article_amidala_deactive,
	a.article_reason_amidala_deactive,
	a.article_activation_ch,
	a.article_core_item,
	a.article_published,
	a.article_name,
	a.article_pic1,
	a.article_title,
	COALESCE(b.name, a.article_brand) AS article_brand,
	b.marketing_cluster AS article_marketing_cluster,
	CASE WHEN cg1.title_en IS NOT NULL THEN cg1.title_en ELSE a.article_commodity_group1 END AS article_commodity_group1,
	CASE WHEN cg2.title_en IS NOT NULL THEN cg2.title_en ELSE a.article_commodity_group2 END AS article_commodity_group2,
	CASE WHEN cg3.title_en IS NOT NULL THEN cg3.title_en ELSE a.article_commodity_group3 END AS article_commodity_group3,
	CASE WHEN cg4.title_en IS NOT NULL THEN cg4.title_en ELSE a.article_commodity_group4 END AS article_commodity_group4,
	CASE WHEN cg5.title_en IS NOT NULL THEN cg5.title_en ELSE a.article_commodity_group5 END AS article_commodity_group5,
	a.article_category,
	a.article_basic_unit,
	a.article_color,
	a.article_color1,
	a.article_color1_shade,
	a.article_supplier_color_code,
	a.article_supplier_color_name,
	/*	a.article_manufacturer_color_code,
	a.article_manufacturer_color_name, */
	a.article_hanging_garment,
	a.article_size,
	a.article_eu_size,
	a.article_supplier_size,
	a.article_eu_length,
	a.article_supplier_length,
	a.article_gross_weight_gram,
	a.article_net_weight_gram,
	a.article_image_url,
	a.article_country_of_production,
	a.article_country_of_origin,
	a.article_buyer,
	a.article_customs_tariff_number,
	a.article_customs_tariff_number_ch,
	a.article_customs_tariff_number_de,
	a.article_check_tariff_numbers,
	a.article_amidala_categories,
	a.article_promotion_item,
	a.article_push_stock,
	a.article_nos,
	a.article_never_out_of_stock,
	a.article_supplier_availability,
	a.article_season_start,
	a.article_season,
	a.article_cost,
	a.article_sales_price_de,
	a.article_sales_price_at,
	a.article_sales_price_ch,
	a.article_sales_price_original,
	a.article_sales_price_reduced
FROM
		  raw.article a
LEFT JOIN dwh.brands b ON b.name_db = a.article_brand
LEFT JOIN dwh.commodity_group1 cg1 ON cg1.commodity_group1 = a.article_commodity_group1
LEFT JOIN dwh.commodity_group2 cg2 ON cg2.commodity_group2 = a.article_commodity_group2
LEFT JOIN dwh.commodity_group3 cg3 ON cg3.commodity_group3 = a.article_commodity_group3
LEFT JOIN dwh.commodity_group4 cg4 ON cg4.commodity_group4 = a.article_commodity_group4
LEFT JOIN dwh.commodity_group5 cg5 ON cg5.commodity_group5 = a.article_commodity_group5
LEFT JOIN ml.article_amidala_category amc ON a.article_id = amc.article_id


