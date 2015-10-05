-- Name: raw.nav_item
-- Created: 2015-04-27 15:24:23
-- Updated: 2015-07-28 09:19:49

CREATE VIEW raw.nav_item 
AS

/* This is the new item model from the ERP, Navision. It was built in conjunction with Klaus. It replaces all previous article/item models */


SELECT

	/* ITEM AND VARIANT IDENTIFIERS */
	item."No_" AS item_no,
	variant.code AS variant_code,
	color.code AS color_code,
	size.code AS size_code,
	/* item."No_" || '-' || variant.code AS item_variant, */
	item."No_ 2" AS parent_no, /* parent_o_id from pim; will be phased out */
	variant."PFCommon Item Variant Code" AS ean,
	/*	item."Vendor No_" AS vendor_no, NOT USED BY BUYING*/
	CASE 
		WHEN item."Vendor Item No_" = '' THEN NULL
		ELSE item."Vendor Item No_"
	END AS vendor_item_no,
	
	/* DESCRIPTIONS */
	item."Description" AS item_description,
	item."item category code" AS category_code,
	cat."Description" AS category, /* COMMODITY GROUP 4 FROM PIM */
	item."product group code" AS product_group_code,
	prod."description" as product_group, /* COMMODITY GROUP 5 FROM PIM */

	/* DATES */
	/* earliest deliv date
	latest deliv date
	look at doc data tables for pos */

	/* ITEM STATUS */
	/* pfitem status */
	status.description AS item_status,

	CASE 
		WHEN variant."Item Status Internal"=1 THEN 'Marketing Stop'
		WHEN variant."Item Status Internal"=2 THEN 'Return Stop'
		WHEN variant."Item Status Internal"=3 THEN 'Sontiges'
		ELSE NULL
	END as item_status_internal,

	variant."Item Status Purchase" AS item_status_purchase,
	CASE
		WHEN variant."Item Status Purchase" = '' THEN NULL
		WHEN variant."Item Status Purchase" = 0  THEN NULL
		WHEN variant."Item Status Purchase" = 1  THEN 'Stop NOS'
		WHEN variant."Item Status Purchase" = 2  THEN 'Core'
		WHEN variant."Item Status Purchase" = 3  THEN 'Promotion'
	END AS item_status_purchase_description,
	CASE
		WHEN item."Countries Blocked Filter" = '' 	 THEN 'not blacklisted'
		WHEN item."Countries Blocked Filter" IS NULL THEN 'not blacklisted'
		ELSE item."Countries Blocked Filter"
	END AS countries_blocked,
	
	/* UNITS, WEIGHT, SIZES */
	size."Net Weight" AS net_weight,
	size."Gross Weight" AS gross_weight,
	item."Sales Unit of Measure" AS unit_of_measure,
	
	/* COUNTRY, MANUFACTURER, AND SUPPLIER RELATED */
	CASE
		WHEN item."Country_Region of Origin Code" = '' THEN NULL
		ELSE item."Country_Region of Origin Code"
	END AS country_region_of_origin,
	CASE
		WHEN item."Tariff No_" = '' THEN NULL
		ELSE item."Tariff No_"
	END AS tariff_no,
	CASE
		WHEN tar."No_ Switzerland" = '' THEN NULL
		ELSE tar."No_ Switzerland"
	END AS tariff_no_ch,
	
	/* SIZES, COLORS, BRANDS, THEMES, SEASONS */
	color.description AS color,
	CASE
		WHEN color."External Description" = '' THEN NULL
		ELSE color."External Description"
	END AS supplier_color,
	size.description AS size,
	size."Component Group Code" AS size_component_group,
	CASE 
		WHEN color."PFSeason" = '' THEN NULL
		ELSE color."PFSeason"
	END AS season,
	item."pfbrand code" AS brand_code,
	brand.description AS brand,
	/* imat."Material Code" AS material_code,
	mat.description AS material, */
/*	def.name, */

	/* pics */
	CASE
		WHEN pic.pic1 IS NOT NULL THEN 'pic'
	END AS has_picture,
	pic.pic1,
	pic.pic2,
	pic.pic3,
	pic.pic4,
	pic.pic5,
	pic.pic6,

	/* PRICING AND COST */
	COALESCE(cost."Direct Unit Cost",item."Last Direct Cost") AS unit_cost, /* costs already in euro */
	/* IN LOCAL CURRENCIES */
	MAX(CASE WHEN price."Sales Code" = 'BE' THEN price."Unit Price" END) AS unit_price_be,
	MAX(CASE WHEN price."Sales Code" = 'CH' THEN price."Unit Price" END) AS unit_price_ch,
	MAX(CASE WHEN price."Sales Code" = 'DE' THEN price."Unit Price" END) AS unit_price_de,
	MAX(CASE WHEN price."Sales Code" = 'DK' THEN price."Unit Price" END) AS unit_price_dk,
	MAX(CASE WHEN price."Sales Code" = 'FI' THEN price."Unit Price" END) AS unit_price_fi,
	MAX(CASE WHEN price."Sales Code" = 'GB' THEN price."Unit Price" END) AS unit_price_gb,
	MAX(CASE WHEN price."Sales Code" = 'LU' THEN price."Unit Price" END) AS unit_price_lu,
	MAX(CASE WHEN price."Sales Code" = 'NL' THEN price."Unit Price" END) AS unit_price_nl,
	MAX(CASE WHEN price."Sales Code" = 'PL' THEN price."Unit Price" END) AS unit_price_pl,
	MAX(CASE WHEN price."Sales Code" = 'SE' THEN price."Unit Price" END) AS unit_price_se


/* price_group.description AS price_group_description */

FROM 
	"nav_test.Outfittery GmbH$Item" AS item
	LEFT JOIN
	"nav_test.Outfittery GmbH$Item Variant" AS variant
		ON item.no_ = variant."item no_"
	LEFT JOIN
	"nav_test.Outfittery GmbH$PFitem Vert Component" AS color
		 ON variant."pfvertical component" 	= color.code
		AND variant."item no_" 				= color."item no_"
	LEFT JOIN
	"nav_test.Outfittery GmbH$PFitem horz Component" AS size
		 ON variant."pfhorizontal component" 	= size.code
		AND variant."item no_" 					= size."item no_"
	LEFT JOIN
	"nav_test.Outfittery GmbH$Item Category" AS cat
		ON item."item category code" = cat."code"
	LEFT JOIN
	"nav_test.Outfittery GmbH$Product Group" AS prod
		 ON item."item category code" = prod."item category code"
		AND item."product group code" = prod.code
	LEFT JOIN
	"nav_test.Outfittery GmbH$PFBrand" AS brand
		ON item."pfbrand code" = brand.code
	LEFT JOIN
	"nav_test.Outfittery GmbH$Item Unit of Measure" AS unit
		 ON item."base unit of measure" = unit.code
		AND item.no_ 					= unit."item no_"
	LEFT JOIN
	"nav_test.Outfittery GmbH$PFSeason" AS season
		 ON item."PFSeason" = season.code
/*	LEFT JOIN
	"nav_test.Outfittery GmbH$PFDefinition" AS def
		 ON item. = def.code */
	LEFT JOIN
	"nav_test.Outfittery GmbH$PFItem Status" AS status
		 ON variant."PFItem Status" = status.code
	LEFT JOIN
	"nav_test.Outfittery GmbH$Sales Price" AS price
		 ON variant."item no_" 	= price."item no_"
		AND variant.code 		= price."Variant Code"
		AND price."Sales Type" 	= 1
		/* AND price."Currency Code" = 'EUR'; this field won't be used */
		/* the date logic will need to be included once ERP dates are updated
		AND price."Starting Date" <= CURDATE()
		AND (price."Ending Date" >= CURDATE() OR price."Ending Date" = '')  */
	LEFT JOIN
	"nav_test.Outfittery GmbH$Purchase Price" cost
		 ON variant."item no_" 		= cost."item no_"
		AND variant.code 			= cost."Variant Code"
		AND item."Vendor No_" 		= cost."Vendor No_"
		AND cost."Currency Code" 	= ''  /*default is Euro*/
	LEFT JOIN
	(
		SELECT  
			"Source Primary Key 1" AS item_no, 
			"Source Primary Key 2" as color_code,
			MAX(CASE WHEN sorting = 1 THEN "File Name" END) AS pic1,
			MAX(CASE WHEN sorting = 2 THEN "File Name" END) AS pic2,
			MAX(CASE WHEN sorting = 3 THEN "File Name" END) AS pic3,
			MAX(CASE WHEN sorting = 4 THEN "File Name" END) AS pic4,
			MAX(CASE WHEN sorting = 5 THEN "File Name" END) AS pic5,
			MAX(CASE WHEN sorting = 6 THEN "File Name" END) AS pic6
		FROM 
			"nav_test.Outfittery GmbH$PFHyperlink"
		WHERE
		 	"Source Table No_" = 11006110
		GROUP BY 1,2
	) AS pic
		 ON color."item no_" 	= pic.item_no
		AND color.code 			= pic.color_code
	LEFT JOIN
	"nav_test.Outfittery GmbH$Tariff Number" AS tar
		 ON item."Tariff No_" = tar."No_"
	/*
CAREFUL! ITEM MATERIALS CAUSES DUPLICATES UNLESS PUT INTO AN ARRAY
	LEFT JOIN
	"nav_test.Outfittery GmbH$Item Material" imat
		 ON item.no_ = imat."item no_"
	LEFT JOIN
	"nav_test.Outfittery GmbH$Material" mat
		 ON imat."material code" = mat.code
	*/
	/*
	LEFT JOIN
	--item variant overwrite 
	"nav_test.Outfittery GmbH$Stockkeeping Unit" AS iv
		 ON variant."item no_" 	= iv."Item No_"
		AND variant.code 		= iv."Variant Code"
	*/
GROUP BY
1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38
/* ORDER BY 1 */


