-- Name: views.ownstock_article
-- Created: 2015-04-24 18:18:06
-- Updated: 2015-04-24 18:18:06

CREATE view "views.ownstock_article"
as

SELECT
  ao.article_id,
  p.ean,
  ao.brand,
  ao.article_name,
  p.oo_id,
  p.supplier_availability,
  p.commodity_group1,
  p.commodity_group2,
  p.commodity_group3,
  p.commodity_group4,
  p.commodity_group5,
  p.country_of_production,
  p.processing_code,
  p.color1,
  p.supplier_sku,
  p.supplier_color_code,
  p.supplier_color_name,
  p.purchase_price,
  p.pic1,
  p.color1_shade,
  p.nos,
  p.season,
  p.amidala_deactive,
  p.amidala_categories,
  p.supplier_size,
  p.eu_size,
  p.supplier_length,
  p.eu_length,
  p.alternative_supplier_sku,
  p.push,
  p.reduced,
  p.season_start,
  p.net_weight_gram,
  p.gross_weight_gram,
  p.de_customs_tarff_number,
  p.ch_customs_tariff_number,
  p.age,
  p.style,
  p.core_article,
  p.o_parentId,
  p.o_published,
  p.o_creationDate,
  p.basic_unit,
  p."date",
  p.hanging_garments,
  p.percentage1_upper_fabric,
  p.upper_fabric_share1,
  p.percentage2_upper_fabric,
  p.upper_fabric_share2,
  p.percentage3_upper_fabric,
  p.upper_fabric_share3,
  p.percentage4_upper_fabric,
  p.upper_fabric_share4,
  p.activation_ch,
  p.o_id,
  p.o_modificationDate,
  p.o_userOwner,
  p.o_userModification,
  p.date_available,
  p.promotion_item,
  p.production_textile,
  p.reason_deactive,
  p.check_tariff_numbers,
  p.price_retail_de,
  p.price_retail_original,
  p.price_retail_chf,
  p.price_retail_original_chf,
  p.price_retail_dkk,
  p.price_retail_original_dkk,
  p.price_retail_sek,
  p.price_retail_original_sek,
  p.price_retail_benelux,
  p.price_retail_original_benelux,
  p.AccessoiresTextil_fineness_of_material,
  p.AccessoiresTextil_percentage1_upper_fabric,
  p.AccessoiresTextil_percentage2_upper_fabric,
  p.AccessoiresTextil_percentage3_upper_fabric,
  p.AccessoiresTextil_upper_fabric_share1,
  p.AccessoiresTextil_upper_fabric_share2,
  p.AccessoiresTextil_upper_fabric_share3,
  p.additional_levy,
  p.amidala_check,
  p.commodity_group6,
  p.Guertel_percentage1_upper_fabric,
  p.Guertel_percentage2_upper_fabric,
  p.Guertel_upper_fabric_share1,
  p.Guertel_upper_fabric_share2,
  p.pic2,
  p.pic3,
  p.pic4,
  p.pic5,
  p.price_retail_at,
  p.price_retail_ch,
  p.StyleBekleidung_percentage1_upper_fabric,
  p.StyleBekleidung_percentage2_upper_fabric,
  p.StyleBekleidung_percentage3_upper_fabric,
  p.StyleBekleidung_upper_fabric_share1,
  p.StyleBekleidung_upper_fabric_share2,
  p.StyleSchuhe_inner_material_shoes,
  p.StyleSchuhe_lining_shoes,
  p.StyleSchuhe_sole_shoes,
  p.StyleSchuhe_upper_material_shoes,
  p.customs_tariff_number,
  ao.MStyle_Bekleidung_upper_fabric_share3,
  ao.supplier_article_id,
  ao.supplier_article_article_id,
  ao.supplier_article_sku,
  ao.supplier_article_purchase_price,
  ao.supplier_article_ean,
  ao.supplier_article_image_url,
  ao.supplier_article_partner_shop_url,
  ao.supplier_article_manufacturer_sku,
  ao.article_title,
  ao.article_color,
  ao.article_size,
  ao.article_sku,
  ao.article_model_id,
  ao.supplier_id,
  ao.category as article_category,
  ao.article_brand,
  ao.article_ean,
  ao.MStyle_Bekleidung_percentage3_upper_fabric,
  ao.MStyle_Bekleidung_percentage4_upper_fabric,
  ao.MStyle_Bekleidung_upper_fabric_share4,
  ao.stock_type
FROM views.pim_article p
JOIN
(
	SELECT *
	FROM
	(
		SELECT 
			row_number() over (partition by a.ean order by CASE WHEN a.supplier_id = 15 THEN 1 ELSE 0 END DESC, a.supplier_id desc) as rnum,
			a.*,
			/*--Gets oo_id from pim if oo_id is null in article table*/
			CASE when a.oo_id IS NULL THEN p.oo_id else a.oo_id end as oo_id_new,
			/*--Assigns stock_type if ean is from Z-Stock or Own Stock*/
			CASE when a.oo_id IS NULL OR a1.nb_of_dup>=2 THEN 'Patner Stock' else 'Own Stock' end as stock_type
		FROM views.article a
		LEFT JOIN views.pim_article p on p.ean=a.ean
		INNER JOIN
		(
			SELECT 
				a.ean,
				count(*) AS nb_of_dup
			FROM views.article a
			WHERE a.ean IS NOT NULL
			GROUP BY 1
		)a1 on a1.ean=a.ean
	)a2  
	WHERE a2.rnum=1 and a2.oo_id_new IS NOT NULL
)ao on p.oo_id=oo_id_new


