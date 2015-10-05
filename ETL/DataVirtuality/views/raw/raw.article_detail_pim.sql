-- Name: raw.article_detail_pim
-- Created: 2015-04-24 18:17:14
-- Updated: 2015-04-24 18:17:14

CREATE VIEW raw.article_detail_pim
AS
SELECT
	o.oo_id,
	o.o_parentId as o_parent_id,
	o.sku,
	o.supplier_sku,
	o.alternative_supplier_sku,		
	o.ean,
	o.o_key as "key",
	o.buyer,		
	o.supplier_availability,
	o.nos,
	o.season,
	o.season_start,	
	o.brand as brand,
	o.article_name,
	o.supplier_article_name,
	o.o_published as published,	
	o.promotion_item,
	o.core_article,	
	o.push,
	o.reduced,
	o.amidala_deactive,	
	LEFT(CAST(o.amidala_categories AS STRING),4000) AS amidala_categories,
	o.reason_deactive,
	CASE 
		WHEN o.age = 'all' THEN 'all'
		WHEN o.age = 'over_40' THEN 'over 40'
		ELSE 'under 40'
	END as age_group,
	substring(cast(o.style as string), 2, (Length(cast (o.style as string)) -2)) as style,		
	o.commodity_group1,
	o.commodity_group2,
	o.commodity_group3,
	o.commodity_group4,
	o.commodity_group5,
	o.country_of_origin,
	o.country_of_production,
	cast(o.country_block as string) as country_block,	
	o.basic_unit,
	o.color1,
	o.color2,
	o.color3,
	o.color1_shade,	
	o.supplier_color_code,
	o.supplier_color_name,
	
/* Dates */
	FROM_UNIXTIME(cast(o."date" as integer)) as pim_date,
	FROM_UNIXTIME(cast(o.o_creationDate as integer)) as date_created,
	FROM_UNIXTIME(cast(o.o_modificationDate as integer)) as date_updated,	
	FROM_UNIXTIME(cast(o.latest_delivery_date as integer)) as date_latest_delivery,
	FROM_UNIXTIME(cast(o.earliest_delivery_date as integer)) as date_earliest_delivery,

/* Prices & Customs */
	o.purchase_price,
	o.price_retail_original,		
	o.price_retail_de,
	o.price_retail_at,
	CASE WHEN o.price_retail_ch is null or o.price_retail_ch=6110209100 THEN null ELSE cast(o.price_retail_ch as double) END as price_retail_ch,
	o.price_retail_benelux,
	o.price_retail_original_benelux,
	o.price_retail_chf,
	o.price_retail_original_chf,
	o.price_retail_dkk,
	o.price_retail_original_dkk,
	o.price_retail_sek,
	o.price_retail_original_sek,
	o.check_tariff_numbers,
	cast(o.additional_levy as string) as additional_levy,
	o.customs_tariff_number,
	case when o.de_customs_tarff_number is null then 0 else cast(o.de_customs_tarff_number as bigint) end as customs_tariff_number_de,
	case when o.ch_customs_tariff_number is null then 0 else cast(o.ch_customs_tariff_number as bigint) end as customs_tariff_number_ch,	

	o.supplier_finish,
	o.pic1,
	o.pic2,
	o.pic3,
	o.pic4,
	o.pic5,	
	o.pic6,	
	o.pic_raw,
	
	o.net_weight,
	o.gross_weight,
	o.net_weight_gram,
	o.gross_weight_gram,	
	o.supplier_size,
	o.eu_size,
	o.supplier_length,
	o.eu_length,

	cast(at.fineness_of_material as string) as accessories_fineness_of_material, 
	cast(at.percentage1_upper_fabric as string) as accessories_percentage_of_fabric_1, 
	cast(at.upper_fabric_share1 as string) as accessories_upper_fabric_1,
	cast(at.percentage2_upper_fabric as string) as accessories_percentage_of_fabric_2,
	cast(at.upper_fabric_share2 as string) as accessories_upper_fabric_2,
	cast(at.percentage3_upper_fabric as string) as accessories_percentage_of_fabric_3,
	cast(at.upper_fabric_share3 as string) as accessories_upper_fabric_3,

	cast(ag.percentage1_upper_fabric as string) as belt_percentage_of_upper_fabric_1,
	cast(ag.upper_fabric_share1 as string) as belt_upper_fabric_1,
	cast(ag.percentage2_upper_fabric as string) as belt_percentage_of_upper_fabric_2,
	cast(ag.upper_fabric_share2 as string) as belt_upper_fabric_2,

	SUBSTRING(cast(ms.upper_material_shoes as varchar), 2,(Length(cast(ms.upper_material_shoes as varchar))-2)) as shoes_upper_material,
	SUBSTRING(cast(ms.inner_material_shoes as varchar), 2,(Length(cast(ms.inner_material_shoes as varchar))-2)) as shoes_inner_material,
	cast(ms.sole_shoes as string) as shoes_sole,
	cast(ms.lining_shoes as string) as soes_lining,

	cast(msb.upper_fabric_share1 as string) as apparel_upper_fabric_1,
	cast(msb.percentage1_upper_fabric as string) as apparel_percentage_of_upper_fabric_1,
	cast(msb.percentage2_upper_fabric as string) as apparel_percentage_of_upper_fabric_2,
	cast(msb.upper_fabric_share2 as string) as apparel_upper_fabric_2,
	cast(msb.upper_fabric_share3 as string) as apparel_upper_fabric_3,
	cast(msb.percentage3_upper_fabric as string) as apparel_percentage_of_upper_fabric_3,

	o.hanging_garments,	
	o.production_textile,
	o.percentage4_upper_fabric,
	o.upper_fabric_share4,
	o.activation_ch,
	o.o_path,
	o.check_material_style_attributes,
	o.check_fitting,
	o.check_schulung,
	o.check_details,
	o.amidala_check,
	o.processing_code
FROM pim.object_17 o
LEFT JOIN pim.object_17 as parent ON parent.o_id = o.o_parentId
LEFT JOIN pim.object_17 as parent_parent ON parent_parent.o_id = parent.o_parentId
LEFT JOIN pim.object_brick_query_MaterialStyleAccessoiresTextil_17 at ON at.o_id = o.o_parentId 
LEFT JOIN pim.object_brick_query_MaterialStyleAccessoiresGuertel_17 ag ON ag.o_id = o.o_parentId
LEFT JOIN pim.object_brick_query_MaterialStyleSchuhe_17 ms on ms.o_id = o.o_parentId
LEFT JOIN pim.object_brick_query_MaterialStyleBekleidung_17 msb on msb.o_id = o.o_parentId


