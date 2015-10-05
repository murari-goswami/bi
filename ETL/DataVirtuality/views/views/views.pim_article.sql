-- Name: views.pim_article
-- Created: 2015-04-24 18:17:22
-- Updated: 2015-04-24 18:17:22

CREATE VIEW views.pim_article
AS
SELECT
	o.oo_id,
	o.oo_classId,
	o.oo_className,
	o.sku,
	o.ean,
	o.supplier_availability,
	case when b.name is not null then b.name else o.brand end as brand,
	o.article_name,
  	CASE WHEN cg1.title_de is not null THEN cg1.title_de ELSE o.commodity_group1 END as commodity_group1,
  	CASE WHEN cg2.title_de is not null THEN cg2.title_de ELSE o.commodity_group2 END as commodity_group2,
  	CASE WHEN cg3.title_de is not null THEN cg3.title_de ELSE o.commodity_group3 END as commodity_group3,
  	CASE WHEN cg4.title_de is not null THEN cg4.title_de ELSE o.commodity_group4 END as commodity_group4,
  	CASE WHEN cg5.title_de is not null THEN cg5.title_de ELSE o.commodity_group5 END as commodity_group5,
  	o.commodity_group6,
	o.buyer,
	o.country_of_origin,
	o.country_of_production,
	o.processing_code,
	o.basic_unit,
	o.color1,
	o.color2,
	o.color3,
	o.supplier_sku,
	o.supplier_article_name,
	o.supplier_color_code,
	o.supplier_color_name,
	o.purchase_price,
	o.push_types,
	o.price_retail_benelux,
	o.price_retail_original_benelux,
	o.price_retail_chf,
	o.price_retail_original_chf,
	o.price_retail_dkk,
	o.price_retail_original_dkk,
	o.price_retail_sek,
	o.price_retail_original_sek,
	o.net_weight,
	o.gross_weight,
	o.check_tariff_numbers,
	cast(o.additional_levy as string) as additional_levy,
	o.customs_tariff_number,
	cast(o.country_block as string) as country_block,
	o.supplier_finish,
	o.pic1,
	o.pic2,
	o.pic3,
	o.color1_shade,
	o.nos,
	o.season,
	o.check_material_style_attributes,
	o.check_fitting,
	o.pic4,
	o.amidala_deactive,
	o.check_schulung,
	cast(o.amidala_categories as string) as amidala_categories,
	o.check_details,
	o.price_retail_de,
	o.price_retail_at,
	case when o.price_retail_ch is null or o.price_retail_ch=6110209100 then 0 else cast(o.price_retail_ch as double) end as price_retail_ch,
	o.price_retail_original,
	o.supplier_size,
	o.eu_size,
	o.supplier_length,
	o.eu_length,
	o.alternative_supplier_sku,
	o.amidala_check,
	o.pic5,
	FROM_UNIXTIME(cast(o.date as integer)) as "date",
	FROM_UNIXTIME(cast(o.latest_delivery_date as integer)) as latest_delivery_date,
	FROM_UNIXTIME(cast(o.earliest_delivery_date as integer)) as earliest_delivery_date,
	FROM_UNIXTIME(cast(o.o_creationDate as integer)) as o_creationDate,
	FROM_UNIXTIME(cast(o.o_modificationDate as integer)) as o_modificationDate,
	FROM_UNIXTIME(cast(o.date_available as integer)) as date_available,
	o.pic6,
	o.hanging_garments,
	o.pic_raw,
	o.push,
	o.reduced,
	o.season_start,
	o.net_weight_gram,
	o.gross_weight_gram,
	case when o.de_customs_tarff_number is null then 0 else cast(o.de_customs_tarff_number as bigint) end as de_customs_tarff_number,
	case when o.ch_customs_tariff_number is null then 0 else cast(o.ch_customs_tariff_number as bigint) end as ch_customs_tariff_number,
	o.percentage1_upper_fabric,
	o.upper_fabric_share1,
	o.percentage2_upper_fabric,
	o.upper_fabric_share2,
	o.percentage3_upper_fabric,
	o.upper_fabric_share3,
	o.percentage4_upper_fabric,
	o.upper_fabric_share4,
	o.age, 
	substring(cast(o.style as string), 2, (Length(cast (o.style as string)) -2)) as style,
	o.activation_ch,
	o.core_article,
	o.o_id,
	o.o_parentId,
	o.o_type,
	o.o_key,
	o.o_path,
	o.o_index,
	o.o_published,
	o.o_userOwner,
	o.o_userModification,
	o.o_classId,
	o.o_className, 
	o.promotion_item,
	o.production_textile,
	o.reason_deactive,
	guertel_closure_accessories,
	guertel_special_charakteristics_accessories,
	guertel_details,
	handschuhe_closure_accessories,
	handschuhe_special_charakteristics_accessories,
	handschuhe_details,
	closure_trousers,
	trousers_pocket,
	trousers_crease,
	trousers_tuck,
	special_attributes_trousers,
	trousers_details,
	konfektion_collar,
	konfektion_closure_tops,
	konfektion_closure_trousers,
	konfektion_slit,
	konfektion_pockets_tops,
	konfektion_trousers_pocket,
	konfektion_crease,
	konfektion_tuck,
	konfektion_special_attributes_tops,
	konfektion_special_attributes_trousers,
	konfektion_details,
	Kopfaccessoires_circumference_cm,
	Kopfaccessoires_closure_accessories,
	Kopfaccessoires_special_charakteristics_accessories,
	Kopfaccessoires_details,
	KrawatteFliege_lenght_cm,
	KrawatteFliege_width_cm,
	KrawatteFliege_width,
	KrawatteFliege_special_charakteristics_accessories,
	KrawatteFliege_details,
	Oberteile_type_print,
	Oberteile_closure_tops,
	Oberteile_pockets_tops,
	Oberteile_collar,
	Oberteile_hood,
	Oberteile_slit,
	Oberteile_special_attributes_tops,
	Oberteile_details,
	Oberteile_quality_print,
	Outdoor_closure_tops,
	Outdoor_collar,
	Outdoor_slit,
	Outdoor_hood,
	Outdoor_pockets_tops,
	Outdoor_special_attributes_tops,
	Outdoor_Oberteile_details,
	Schunhe_toe_shoes,
	Schuhe_closure_shoes,
	Schuhe_height_upper_cm,
	Schuhe_width_upper_cm,
	Schuhe_height_heel_cm,
	Schuhe_heel,
	Schuhe_footbed,
	Schuhe_details,
	Socken_details,
	TuecherSchals_lenght_cm,
	TuecherSchals_width_cm,
	TuecherSchals_diameter_cm,
	TuecherSchals_special_charakteristics_accessories,
	TuecherSchals_details,
	Hosen_lenght_pants,
	Hosen_fit,
	Hosen_waist_line,
	Hosen_crotch,
	Hosen_fitting_trousers,
	Hosen_fitting_extras,
	Hosen_fitting_normalizer,
	Konfektion_fit,
	Konfektion_blazer_length,
	Konfektion_fitting_top,
	Konfektion_fitting_trousers,
	Konfektion_fitting_extras,
	Konfektion_waist_line,
	Konfektion_fitting_normalizer,
	Oberteile_sleeve_length,
	Oberteile_fit,
	Oberteile_fitting_top,
	Oberteile_fitting_extras,
	Oberteile_fitting_normalizer,
	Oberteile_lenght_top,
	Oberteile_sleeves_length,
	Outdoor_fit,
	Outdoor_length_coat,
	Outdoor_fitting_extras,
	Outdoor_fitting_normalizer,
	Outdoor_fitting_top,
	Schuhe_width_shoes,
	Schuhe_fitting_shoes,
	Schuhe_fitting_normalizer,
	Schuhe_fitting_extras,
	Guertel_percentage1_upper_fabric,
	Guertel_upper_fabric_share1,
	Guertel_production_information,
	Guertel_pattern,
	Guertel_finish_metal,
	Guertel_finish_leather,
	Guertel_quality_upper_fabric,
	Guertel_quality_finishing,
	Guertel_outfittery_occasion,
	Guertel_outfittery_style,
	Guertel_percentage2_upper_fabric,
	Guertel_upper_fabric_share2,
	AccessoiresTextil_percentage1_upper_fabric,
	AccessoiresTextil_percentage2_upper_fabric,
	AccessoiresTextil_upper_fabric_share2,
	AccessoiresTextil_percentage1_material_lining,
	AccessoiresTextil_material_lining_share1,
	AccessoiresTextil_materialname_fabric_upper,
	AccessoiresTextil_care_instructions,
	AccessoiresTextil_production_information,
	AccessoiresTextil_pattern,
	AccessoiresTextil_fineness_of_material,
	AccessoiresTextil_finish_textile,
	AccessoiresTextil_quality_upper_fabric,
	AccessoiresTextil_quality_finishing,
	AccessoiresTextil_outfittery_style,
	AccessoiresTextil_outfittery_occasion,
	AccessoiresTextil_upper_fabric_share1,
	AccessoiresTextil_percentage3_upper_fabric,
	AccessoiresTextil_upper_fabric_share3,
	AccessoiresTextil_percentage2_material_lining,
	AccessoiresTextil_material_lining_share2,
	AccessoiresTextil_elasticity,
	AccessoiresTextil_outfittery_upper_fabric,
	AccessoiresTextil_lining_textile,
	StyleBekleidung_pattern,
	StyleBekleidung_care_instructions,
	StyleBekleidung_production_information,
	StyleBekleidung_lining_textile,
	StyleBekleidung_materialname_fabric_upper,
	StyleBekleidung_outfittery_upper_fabric,
	StyleBekleidung_fineness_of_material,
	StyleBekleidung_quality_upper_fabric,
	StyleBekleidung_quality_finishing,
	StyleBekleidung_finish_textile,
	StyleBekleidung_elasticity,
	StyleBekleidung_outfittery_style,
	StyleBekleidung_outfittery_occasion,
	StyleBekleidung_upper_fabric_share1,
	StyleBekleidung_percentage1_upper_fabric,
	StyleBekleidung_percentage2_upper_fabric,
	StyleBekleidung_upper_fabric_share2,
	StyleBekleidung_material_lining_share1,
	StyleBekleidung_percentage1_material_lining,
	StyleBekleidung_percentage3_upper_fabric,
	StyleBekleidung_upper_fabric_share3,
	StyleBekleidung_percentage2_material_lining,
	StyleBekleidung_material_lining_share2,
	StyleBekleidung_percentage4_upper_fabric,
	StyleBekleidung_upper_fabric_share4,
	StyleBekleidung_material_extra,
	StyleBekleidung_percentage1_material_sleeve_lining,
	StyleBekleidung_material_sleeve_lining,
	StyleSchuhe_upper_material_shoes,
	StyleSchuhe_lining_shoes,
	StyleSchuhe_innersole_shoes,
	StyleSchuhe_soletype_shoes,
	StyleSchuhe_pattern,
	StyleSchuhe_finish_leather,
	StyleSchuhe_quality_upper_fabric,
	StyleSchuhe_quality_finishing,
	StyleSchuhe_outfittery_style,
	StyleSchuhe_outfittery_occasion,
	StyleSchuhe_production_information,
	StyleSchuhe_sole_shoes,
	StyleSchuhe_inner_material_shoes
FROM pim.object_17 o
JOIN pim.object_17 as parent ON parent.o_id = o.o_parentId
JOIN pim.object_17 as parent_parent ON parent_parent.o_id = parent.o_parentId
LEFT JOIN dwh.brands b on b.name_db = o.brand 
LEFT JOIN dwh.commodity_group1 cg1 ON cg1.commodity_group1 = o.commodity_group1
LEFT JOIN dwh.commodity_group2 cg2 ON cg2.commodity_group2 = o.commodity_group2
LEFT JOIN dwh.commodity_group3 cg3 ON cg3.commodity_group3 = o.commodity_group3
LEFT JOIN dwh.commodity_group4 cg4 ON cg4.commodity_group4 = o.commodity_group4
LEFT JOIN dwh.commodity_group5 cg5 ON cg5.commodity_group5 = o.commodity_group5
LEFT JOIN 
(
	SELECT 
		o_id,
		belt_width_cm,
		SUBSTRING(cast(closure_accessories as varchar), 2,(Length(cast(closure_accessories as varchar))-2)) as "guertel_closure_accessories",
		SUBSTRING(cast(special_charakteristics_accessories as varchar), 2,(Length(cast(special_charakteristics_accessories as varchar))-2)) as "guertel_special_charakteristics_accessories",
		cast(details as varchar) as "guertel_details" 
	FROM pim.object_brick_query_DetailsGuertel_17
	) DetailsGuertel on DetailsGuertel.o_id = o.o_parentId
LEFT JOIN
(
	SELECT o_id,
		lenght_cm,
		SUBSTRING(cast(closure_accessories as varchar), 2,(Length(cast(closure_accessories as varchar))-2)) as "handschuhe_closure_accessories",
		SUBSTRING(cast(special_charakteristics_accessories as varchar), 2,(Length(cast(special_charakteristics_accessories as varchar))-2)) as "handschuhe_special_charakteristics_accessories",
		cast(details as varchar) as "handschuhe_details" 
	FROM "pim"."object_brick_query_DetailsHandschuhe_17"
) DetailsHandschuhe on DetailsHandschuhe.o_id = o.o_parentId
LEFT JOIN
(
	SELECT o_id,
		SUBSTRING(cast(closure_trousers as varchar), 2,(Length(cast(closure_trousers as varchar))-2)) as "closure_trousers",
		SUBSTRING(cast(trousers_pocket as varchar), 2,(Length(cast(trousers_pocket as varchar))-2)) as "trousers_pocket",
		cast(crease as boolean) as trousers_crease,
		cast(tuck as boolean) as trousers_tuck,
		SUBSTRING(cast(special_attributes_trousers as varchar), 2,(Length(cast(special_attributes_trousers as varchar))-2)) as "special_attributes_trousers",
		cast(details as varchar) as "trousers_details" 
	FROM "pim"."object_brick_query_DetailsHosen_17"
) DetailsHosen on DetailsHosen.o_id = o.o_parentId
LEFT JOIN
(
	SELECT o_id,
		SUBSTRING(cast(collar as varchar), 2,(Length(cast(collar as varchar))-2)) as konfektion_collar,
		SUBSTRING(cast(closure_tops as varchar), 2,(Length(cast(closure_tops as varchar))-2)) as konfektion_closure_tops,
		SUBSTRING(cast(closure_trousers as varchar), 2,(Length(cast(closure_trousers as varchar))-2)) as konfektion_closure_trousers,
		cast(slit as varchar) as konfektion_slit,
		SUBSTRING(cast(pockets_tops as varchar), 2,(Length(cast(pockets_tops as varchar))-2)) as konfektion_pockets_tops,
		SUBSTRING(cast(trousers_pocket as varchar), 2,(Length(cast(trousers_pocket as varchar))-2)) as konfektion_trousers_pocket,
		cast(crease as boolean) as konfektion_crease,
		cast(tuck as varchar) as konfektion_tuck,
		SUBSTRING(cast(special_attributes_tops as varchar), 2,(Length(cast(special_attributes_tops as varchar))-2)) as konfektion_special_attributes_tops,
		SUBSTRING(cast(special_attributes_trousers as varchar), 2,(Length(cast(special_attributes_trousers as varchar))-2)) as konfektion_special_attributes_trousers,
		cast(details as varchar) as konfektion_details
	FROM "pim"."object_brick_query_DetailsKonfektion_17"
) DetailsKonfektion on DetailsKonfektion.o_id = o.o_parentId
LEFT JOIN
(
	SELECT o_id,
		cast(circumference_cm as string) as Kopfaccessoires_circumference_cm,
		SUBSTRING(cast(closure_accessories as varchar), 2,(Length(cast(closure_accessories as varchar))-2)) as Kopfaccessoires_closure_accessories,
		SUBSTRING(cast(special_charakteristics_accessories as varchar), 2,(Length(cast(special_charakteristics_accessories as varchar))-2)) as Kopfaccessoires_special_charakteristics_accessories,
		cast(details as varchar) as Kopfaccessoires_details 
	FROM "pim"."object_brick_query_DetailsKopfaccessoires_17"
) DetailsKopfaccessoires on DetailsKopfaccessoires.o_id = o.o_parentId
LEFT JOIN
(
	SELECT o_id,
		cast(lenght_cm as string) as KrawatteFliege_lenght_cm,
		cast(width_cm as string) as KrawatteFliege_width_cm,
		cast(width as string) as KrawatteFliege_width,
		SUBSTRING(cast(special_charakteristics_accessories as varchar), 2,(Length(cast(special_charakteristics_accessories as varchar))-2)) as KrawatteFliege_special_charakteristics_accessories,
		cast(details as varchar) as KrawatteFliege_details 
	FROM "pim"."object_brick_query_DetailsKrawatteFliege_17"
) KrawatteFliege on KrawatteFliege.o_id = o.o_parentId
LEFT JOIN
(
	SELECT o_id,
		SUBSTRING(cast(type_print as varchar), 2,(Length(cast(type_print as varchar))-2)) as Oberteile_type_print,
		SUBSTRING(cast(closure_tops as varchar), 2,(Length(cast(closure_tops as varchar))-2)) as Oberteile_closure_tops,
		SUBSTRING(cast(pockets_tops as varchar), 2,(Length(cast(pockets_tops as varchar))-2)) as Oberteile_pockets_tops,
		SUBSTRING(cast(collar as varchar), 2,(Length(cast(collar as varchar))-2)) as Oberteile_collar,
		SUBSTRING(cast(hood as varchar), 2,(Length(cast(hood as varchar))-2)) as Oberteile_hood,
		cast(slit as string) as Oberteile_slit,
		SUBSTRING(cast(special_attributes_tops as varchar), 2,(Length(cast(special_attributes_tops as varchar))-2)) as Oberteile_special_attributes_tops,
		cast(details as varchar) as Oberteile_details,
		cast(quality_print as string) as Oberteile_quality_print 
	FROM "pim"."object_brick_query_DetailsOberteile_17"
) DetailsOberteile on DetailsOberteile.o_id = o.o_parentId
LEFT JOIN
(
	SELECT o_id,
		SUBSTRING(cast(closure_tops as varchar), 2,(Length(cast(closure_tops as varchar))-2)) as Outdoor_closure_tops,
		SUBSTRING(cast(collar as varchar), 2,(Length(cast(collar as varchar))-2)) as Outdoor_collar,
		cast(slit as string) as Outdoor_slit,
		SUBSTRING(cast(hood as varchar), 2,(Length(cast(hood as varchar))-2)) as Outdoor_hood,
		SUBSTRING(cast(pockets_tops as varchar), 2,(Length(cast(pockets_tops as varchar))-2)) as Outdoor_pockets_tops,
		SUBSTRING(cast(special_attributes_tops as varchar), 2,(Length(cast(special_attributes_tops as varchar))-2)) as Outdoor_special_attributes_tops,
		cast(details as varchar) as Outdoor_Oberteile_details
	FROM "pim"."object_brick_query_DetailsOutdoor_17"
) DetailsOutdoor on DetailsOutdoor.o_id = o.o_parentId
LEFT JOIN
(
	SELECT o_id,
		cast(toe_shoes as string) as Schunhe_toe_shoes,
		SUBSTRING(cast(closure_shoes as varchar), 2,(Length(cast(closure_shoes as varchar))-2)) as Schuhe_closure_shoes,
		cast(height_upper_cm as string) as Schuhe_height_upper_cm,
		cast(width_upper_cm as string) as Schuhe_width_upper_cm,
		cast(height_heel_cm as string) as Schuhe_height_heel_cm,
		cast(heel as boolean) as Schuhe_heel,
		SUBSTRING(cast(footbed as varchar), 2,(Length(cast(footbed as varchar))-2)) as Schuhe_footbed,
		cast(details as varchar) as Schuhe_details 
	FROM "pim"."object_brick_query_DetailsSchuhe_17"
	) DetailsSchuhe on DetailsSchuhe.o_id = o.o_parentId
LEFT JOIN
(
	SELECT o_id,
		cast(details as varchar) as Socken_details 
	FROM "pim"."object_brick_query_DetailsSocken_17"
) DetailsSocken on DetailsSocken.o_id = o.o_parentId
LEFT JOIN
(
	SELECT o_id,
		cast(lenght_cm as string) as TuecherSchals_lenght_cm,
		cast(width_cm as string) as TuecherSchals_width_cm,
		cast(diameter_cm as string) as TuecherSchals_diameter_cm,
		SUBSTRING(cast(special_charakteristics_accessories as varchar), 2,(Length(cast(special_charakteristics_accessories as varchar))-2)) as TuecherSchals_special_charakteristics_accessories,
		cast(details as varchar) as TuecherSchals_details 
	FROM "pim"."object_brick_query_DetailsTuecherSchals_17"
) DetailsTuecherSchals on DetailsTuecherSchals.o_id = o.o_parentId
LEFT JOIN
(
	SELECT o_id,
		SUBSTRING(cast(special_characteristics_underwear as varchar), 2,(Length(cast(special_characteristics_underwear as varchar))-2)) as Unterhosen_special_characteristics_underwear,
		cast(details as varchar) as Unterhosen_details 
	FROM "pim"."object_brick_query_DetailsUnterhosen_17"
) DetailsUnterhosen on DetailsUnterhosen.o_id = o.o_parentId 
LEFT JOIN
(
	SELECT o_id,
		cast(lenght_pants as string) as Hosen_lenght_pants,
		cast(fit as string) as Hosen_fit,
		cast(waist_line as string) as Hosen_waist_line,
		cast(crotch as string) as Hosen_crotch,
		SUBSTRING(cast(fitting_trousers as varchar), 2,(Length(cast(fitting_trousers as varchar))-2)) as Hosen_fitting_trousers,
		SUBSTRING(cast(fitting_extras as varchar), 2,(Length(cast(fitting_extras as varchar))-2)) as Hosen_fitting_extras,
		cast(fitting_normalizer as string) as Hosen_fitting_normalizer
	FROM "pim"."object_brick_query_FittingHosen_17"
) FittingHosen ON FittingHosen.o_id = o.o_parentId 
LEFT JOIN
(
	SELECT o_id,
		cast(fit as string) as Konfektion_fit,
		cast(blazer_length as string) as Konfektion_blazer_length,
		SUBSTRING(cast(fitting_top as varchar), 2,(Length(cast(fitting_top as varchar))-2)) as Konfektion_fitting_top,
		SUBSTRING(cast(fitting_trousers as varchar), 2,(Length(cast(fitting_trousers as varchar))-2)) as Konfektion_fitting_trousers,
		SUBSTRING(cast(fitting_extras as varchar), 2,(Length(cast(fitting_extras as varchar))-2)) as Konfektion_fitting_extras,
		cast(waist_line as string) as Konfektion_waist_line,
		cast(fitting_normalizer as string) as Konfektion_fitting_normalizer
	FROM "pim"."object_brick_query_FittingKonfektion_17"
) FittingKonfektion on FittingKonfektion.o_id = o.o_parentId 
LEFT JOIN
(
	SELECT o_id,
		SUBSTRING(cast(sleeve_length as varchar), 2,(Length(cast(sleeve_length as varchar))-2)) as Oberteile_sleeve_length,
		cast(fit as string) as Oberteile_fit,
		SUBSTRING(cast(fitting_top as varchar), 2,(Length(cast(fitting_top as varchar))-2)) as Oberteile_fitting_top,
		SUBSTRING(cast(fitting_extras as varchar), 2,(Length(cast(fitting_extras as varchar))-2)) as Oberteile_fitting_extras,
		cast(fitting_normalizer as string) as Oberteile_fitting_normalizer,
		cast(lenght_top as string) as Oberteile_lenght_top,
		cast(width_top as string) as Oberteile_width_top,
		cast(sleeves_length as string) as Oberteile_sleeves_length
	FROM "pim"."object_brick_query_FittingOberteile_17"
) FittingOberteile on FittingOberteile.o_id = o.o_parentId 
LEFT JOIN
(
	SELECT o_id,
		cast(fit as string) as Outdoor_fit,
		cast(length_coat as string) as Outdoor_length_coat,
		SUBSTRING(cast(fitting_extras as varchar), 2,(Length(cast(fitting_extras as varchar))-2)) as Outdoor_fitting_extras,
		cast(fitting_normalizer as string) as Outdoor_fitting_normalizer,
		cast(fitting_top as string) as Outdoor_fitting_top
	FROM "pim"."object_brick_query_FittingOutdoor_17"
) FittingOutdoor on FittingOutdoor.o_id = o.o_parentId 
LEFT JOIN
(
	SELECT o_id,
		cast(width_shoes as string) as Schuhe_width_shoes,
		SUBSTRING(cast(fitting_shoes as varchar), 2,(Length(cast(fitting_shoes as varchar))-2)) as Schuhe_fitting_shoes,
		cast(fitting_normalizer as string) as Schuhe_fitting_normalizer,
		SUBSTRING(cast(fitting_extras as varchar), 2,(Length(cast(fitting_extras as varchar))-2)) as Schuhe_fitting_extras
	FROM "pim"."object_brick_query_FittingSchuhe_17"
) FittingSchuhe on FittingSchuhe.o_id = o.o_parentId 
LEFT JOIN
(
	SELECT o_id,
		cast(percentage1_upper_fabric as string) as Guertel_percentage1_upper_fabric,
		cast(upper_fabric_share1 as string) as Guertel_upper_fabric_share1,
		SUBSTRING(cast(production_information as varchar), 2,(Length(cast(production_information as varchar))-2)) as Guertel_production_information,
		SUBSTRING(cast(pattern as varchar), 2,(Length(cast(pattern as varchar))-2)) as Guertel_pattern,
		SUBSTRING(cast(finish_metal as varchar), 2,(Length(cast(finish_metal as varchar))-2)) as Guertel_finish_metal,
		SUBSTRING(cast(finish_leather as varchar), 2,(Length(cast(finish_leather as varchar))-2)) as Guertel_finish_leather,
		cast(quality_upper_fabric as string) as Guertel_quality_upper_fabric,
		cast(quality_finishing as string) as Guertel_quality_finishing,
		SUBSTRING(cast(outfittery_occasion as varchar), 2,(Length(cast(outfittery_occasion as varchar))-2)) as Guertel_outfittery_occasion,
		SUBSTRING(cast(outfittery_style as varchar), 2,(Length(cast(outfittery_style as varchar))-2)) as Guertel_outfittery_style,
		cast(percentage2_upper_fabric as string) as Guertel_percentage2_upper_fabric,
		cast(upper_fabric_share2 as string) as Guertel_upper_fabric_share2
	FROM "pim"."object_brick_query_MaterialStyleAccessoiresGuertel_17"
) AccessoiresGuertel on AccessoiresGuertel.o_id = o.o_parentId 
LEFT JOIN
(
	SELECT o_id,
		cast(percentage1_upper_fabric as string) as AccessoiresTextil_percentage1_upper_fabric,
		cast(percentage2_upper_fabric as string) as AccessoiresTextil_percentage2_upper_fabric, 
		cast(upper_fabric_share2 as string) as AccessoiresTextil_upper_fabric_share2,
		cast(percentage1_material_lining as string) as AccessoiresTextil_percentage1_material_lining,
		cast(material_lining_share1 as string) as AccessoiresTextil_material_lining_share1,
		SUBSTRING(cast(materialname_fabric_upper as varchar), 2,(Length(cast(materialname_fabric_upper as varchar))-2)) as AccessoiresTextil_materialname_fabric_upper,
		SUBSTRING(cast(care_instructions as varchar), 2,(Length(cast(care_instructions as varchar))-2)) as AccessoiresTextil_care_instructions,
		SUBSTRING(cast(production_information as varchar), 2,(Length(cast(production_information as varchar))-2)) as AccessoiresTextil_production_information,
		SUBSTRING(cast(pattern as varchar), 2,(Length(cast(pattern as varchar))-2)) as AccessoiresTextil_pattern,
		cast(fineness_of_material as string) as AccessoiresTextil_fineness_of_material,
		SUBSTRING(cast(finish_textile as varchar), 2,(Length(cast(finish_textile as varchar))-2)) as AccessoiresTextil_finish_textile,
		cast(quality_upper_fabric as string) as AccessoiresTextil_quality_upper_fabric,
		cast(quality_finishing as string) as AccessoiresTextil_quality_finishing,
		SUBSTRING(cast(outfittery_style as varchar), 2,(Length(cast(outfittery_style as varchar))-2)) as AccessoiresTextil_outfittery_style, 
		SUBSTRING(cast(outfittery_occasion as varchar), 2,(Length(cast(outfittery_occasion as varchar))-2)) as AccessoiresTextil_outfittery_occasion,
		cast(upper_fabric_share1 as string) as AccessoiresTextil_upper_fabric_share1,
		cast(percentage3_upper_fabric as string) as AccessoiresTextil_percentage3_upper_fabric,
		cast(upper_fabric_share3 as string) as AccessoiresTextil_upper_fabric_share3,
		cast(percentage2_material_lining as string) as AccessoiresTextil_percentage2_material_lining,
		cast(material_lining_share2 as string) as AccessoiresTextil_material_lining_share2,
		cast(elasticity as string) as AccessoiresTextil_elasticity,
		SUBSTRING(cast(outfittery_upper_fabric as varchar), 2,(Length(cast(outfittery_upper_fabric as varchar))-2)) as AccessoiresTextil_outfittery_upper_fabric,
		SUBSTRING(cast(lining_textile as varchar), 2,(Length(cast(lining_textile as varchar))-2)) as AccessoiresTextil_lining_textile
	FROM "pim"."object_brick_query_MaterialStyleAccessoiresTextil_17"
) AccessoiresTextil on AccessoiresTextil.o_id = o.o_parentId 
LEFT JOIN
(
	SELECT o_id,
		SUBSTRING(cast(pattern as varchar), 2,(Length(cast(pattern as varchar))-2)) as StyleBekleidung_pattern,
		SUBSTRING(cast(care_instructions as varchar), 2,(Length(cast(care_instructions as varchar))-2)) as StyleBekleidung_care_instructions,
		SUBSTRING(cast(production_information as varchar), 2,(Length(cast(production_information as varchar))-2)) as StyleBekleidung_production_information,
		SUBSTRING(cast(lining_textile as varchar), 2,(Length(cast(lining_textile as varchar))-2)) as StyleBekleidung_lining_textile,
		SUBSTRING(cast(materialname_fabric_upper as varchar), 2,(Length(cast(materialname_fabric_upper as varchar))-2)) as StyleBekleidung_materialname_fabric_upper,
		SUBSTRING(cast(outfittery_upper_fabric as varchar), 2,(Length(cast(outfittery_upper_fabric as varchar))-2)) as StyleBekleidung_outfittery_upper_fabric,
		cast(fineness_of_material as string) as StyleBekleidung_fineness_of_material,
		cast(quality_upper_fabric as string) as StyleBekleidung_quality_upper_fabric,
		cast(quality_finishing as string) as StyleBekleidung_quality_finishing,
		SUBSTRING(cast(finish_textile as varchar), 2,(Length(cast(finish_textile as varchar))-2)) as StyleBekleidung_finish_textile,
		cast(elasticity as string) as StyleBekleidung_elasticity,
		SUBSTRING(cast(outfittery_style as varchar), 2,(Length(cast(outfittery_style as varchar))-2)) as StyleBekleidung_outfittery_style,
		SUBSTRING(cast(outfittery_occasion as varchar), 2,(Length(cast(outfittery_occasion as varchar))-2)) as StyleBekleidung_outfittery_occasion,
		cast(upper_fabric_share1 as string) as StyleBekleidung_upper_fabric_share1,
		cast(percentage1_upper_fabric as string) as StyleBekleidung_percentage1_upper_fabric,
		cast(percentage2_upper_fabric as string) as StyleBekleidung_percentage2_upper_fabric,
		cast(upper_fabric_share2 as string) as StyleBekleidung_upper_fabric_share2,
		cast(material_lining_share1 as string) as StyleBekleidung_material_lining_share1,
		cast(percentage1_material_lining as string) as StyleBekleidung_percentage1_material_lining,
		cast(percentage3_upper_fabric as string) as StyleBekleidung_percentage3_upper_fabric,
		cast(upper_fabric_share3 as string) as StyleBekleidung_upper_fabric_share3,
		cast(percentage2_material_lining as string) as StyleBekleidung_percentage2_material_lining,
		cast(material_lining_share2 as string) as StyleBekleidung_material_lining_share2,
		cast(percentage4_upper_fabric as string) as StyleBekleidung_percentage4_upper_fabric,
		cast(upper_fabric_share4 as string) as StyleBekleidung_upper_fabric_share4,
		SUBSTRING(cast(material_extra as varchar), 2,(Length(cast(material_extra as varchar))-2)) as StyleBekleidung_material_extra,
		cast(percentage1_material_sleeve_lining as string) as StyleBekleidung_percentage1_material_sleeve_lining,
		cast(material_sleeve_lining as string) as StyleBekleidung_material_sleeve_lining
	FROM "pim"."object_brick_query_MaterialStyleBekleidung_17"
) MaterialStyleBekleidung on MaterialStyleBekleidung.o_id = o.o_parentId 
LEFT JOIN
(
	SELECT o_id,
		SUBSTRING(cast(upper_material_shoes as varchar), 2,(Length(cast(upper_material_shoes as varchar))-2)) as StyleSchuhe_upper_material_shoes,
		cast(lining_shoes as string) as StyleSchuhe_lining_shoes,
		SUBSTRING(cast(innersole_shoes as varchar), 2,(Length(cast(innersole_shoes as varchar))-2)) as StyleSchuhe_innersole_shoes, 
		SUBSTRING(cast(soletype_shoes as varchar), 2,(Length(cast(soletype_shoes as varchar))-2)) as StyleSchuhe_soletype_shoes,
		SUBSTRING(cast(pattern as varchar), 2,(Length(cast(pattern as varchar))-2)) as StyleSchuhe_pattern,
		SUBSTRING(cast(finish_leather as varchar), 2,(Length(cast(finish_leather as varchar))-2)) as StyleSchuhe_finish_leather,
		cast(quality_upper_fabric as string) as StyleSchuhe_quality_upper_fabric,
		cast(quality_finishing as string) as StyleSchuhe_quality_finishing,
		SUBSTRING(cast(outfittery_style as varchar), 2,(Length(cast(outfittery_style as varchar))-2)) as StyleSchuhe_outfittery_style,
		SUBSTRING(cast(outfittery_occasion as varchar), 2,(Length(cast(outfittery_occasion as varchar))-2)) as StyleSchuhe_outfittery_occasion,
		SUBSTRING(cast(production_information as varchar), 2,(Length(cast(production_information as varchar))-2)) as StyleSchuhe_production_information,
		cast(sole_shoes as string) as StyleSchuhe_sole_shoes,
		SUBSTRING(cast(inner_material_shoes as varchar), 2,(Length(cast(inner_material_shoes as varchar))-2)) as StyleSchuhe_inner_material_shoes
	FROM "pim"."object_brick_query_MaterialStyleSchuhe_17"
) MaterialStyleSchuhe on MaterialStyleSchuhe.o_id = o.o_parentId


