-- Name: raw.article
-- Created: 2015-04-24 18:18:02
-- Updated: 2015-04-24 18:18:02

CREATE VIEW raw.article AS

SELECT 
	CAST(a.id AS LONG) AS article_id,
	a.ean AS article_ean, /*postgres.article.ean IS NOT NULL */	
	pim.oo_id article_oo_id,
	pim.o_parent_id AS article_o_parent_id,
	COALESCE(pim.sku, a.sku) AS article_sku, /* THIS FIELD RARELY NOT NULL */
	COALESCE(pim.supplier_sku, a.manufacturer_sku) AS article_supplier_sku, /*PIM ALMOST ALWAYS THE SAME AS MANUFACTURER SKU, BUT article_manufacturer_sku HAS 5X THE DISTINCT VALUES */
	COALESCE(pim.alternative_supplier_sku, /* almost always = article_manufacturer_alternative_sku; pim HAS SLIGHTLY MORE DISTINCT VALUES */
	CASE 
		WHEN a.manufacturer_alternative_sku != 'UNKNOWN' AND length(a.manufacturer_alternative_sku) > 1 THEN a.manufacturer_alternative_sku 
		ELSE NULL
	END) AS article_supplier_alternative_sku,
	CAST(a.model_id AS LONG) AS article_model_id,
	CAST(sad.model_o_id AS LONG) AS article_model_o_id,
	CASE 
		WHEN pim.ean IS NOT NULL THEN 'article in pim' 
		ELSE 'article not in pim' 
	END AS article_in_pim,
	sad.article_suppliers,
	sad.article_ever_supplied_by_outfittery,
	CAST(a.date_created AS DATE) AS article_date_created,
	CAST(pim.date_latest_delivery AS DATE) AS article_latest_delivery_date,
	CAST(pim.date_earliest_delivery AS DATE) AS article_earliest_delivery_date,
	CASE
		WHEN a.active = TRUE  	THEN 'active in amidala'
		WHEN a.active = FALSE 	THEN 'not active in amidala'
		ELSE NULL
	END AS article_amidala_active,
	CASE /*active IN ARTICLE TABLE SHOWED DIFFERENCES, SO USING PIM; ad.amidala_deactive not always populated when PIM is */
		WHEN pim.amidala_deactive = TRUE 	THEN 'deactive in amidala'
		WHEN pim.amidala_deactive = FALSE 	THEN 'not deactive in amidala'
		ELSE NULL
	END AS article_amidala_deactive,
	CASE
		WHEN pim.reason_deactive = 'supplier_return'  		THEN 'stock will be returned to supplier'
		WHEN pim.reason_deactive = 'outlet_offline' 		THEN 'stock will be sent to outlet or store'
		WHEN pim.reason_deactive = 'marketing_campaigne' 	THEN 'marketing campaign that ended'
		WHEN pim.reason_deactive = 'incorrect_data' 		THEN 'incorrect article information in amidala/pimcore'
		WHEN pim.reason_deactive = 'wrong_pictures' 		THEN 'incorrect pictures in midala/pimcore'				
		WHEN pim.reason_deactive IS NULL 					THEN  NULL
		ELSE 'Ask BI'
	END AS article_reason_amidala_deactive,
	CASE
		WHEN pim.activation_ch = TRUE  THEN 'active in ch amidala'
		WHEN pim.activation_ch = FALSE THEN 'not active in ch amidala'
		ELSE NULL
	END AS article_activation_ch,
	CASE
		WHEN pim.core_article = TRUE  THEN 'core article'
		WHEN pim.core_article = FALSE THEN 'not core article'
		ELSE NULL
	END AS article_core_item,
	CASE
		WHEN pim.published = TRUE  THEN 'published in pim'
		WHEN pim.published = FALSE THEN 'not published in pim'
		ELSE NULL
	END AS article_published,
	/* pim.amidala_check, */
	pim.article_name, /*ad.article_name as article_name_ad; very similar; almost same; could go w/ ad */
	pim.pic1 AS article_pic1, /* ad.pic1 very similar; almost same; could go w/ ad */
	a.title AS article_title, /* a.title good; ad.title, */
	a.brand AS article_brand,
	pim.commodity_group1 AS article_commodity_group1,	/*COMMODITY GROUPS IN ENGLISH IN PIM, GERMAN IN AD */
	pim.commodity_group2 AS article_commodity_group2,
	pim.commodity_group3 AS article_commodity_group3,
	pim.commodity_group4 AS article_commodity_group4,	
	pim.commodity_group5 AS article_commodity_group5,
	a.category AS article_category,	/* sad.category AS article_category,   sad.category very different from a.category  */
	CASE /* HAD IN ad.basic_unit BUT MORE CODE FOR A FEW HUNDRED MORE ROWS POPULATED */
		WHEN LOWER(pim.basic_unit) LIKE '1%piece' 	THEN '1 piece'
		WHEN LOWER(pim.basic_unit) LIKE '2%piece%' 	THEN '2 piece'
		WHEN LOWER(pim.basic_unit) LIKE '3%piece%' 	THEN '3 piece'
		WHEN LOWER(pim.basic_unit) LIKE '4%piece%' 	THEN '4 piece'
		WHEN LOWER(pim.basic_unit) LIKE '5%piece%' 	THEN '5 piece'
		WHEN LOWER(pim.basic_unit) LIKE '%ml'  		THEN 'ml volume'
		WHEN pim.basic_unit IS NULL 				THEN NULL
		ELSE 'Ask BI'
	END AS article_basic_unit,
	a.color AS article_color,
	pim.color1  AS article_color1, /*DEFINITELY WANT TO USE PIM; ITS IN ENGLISH; sad IN GERMAN; few where pim null and ad not null */
	pim.color1_shade AS article_color1_shade, /*DEFINITELY WANT TO USE PIM; ITS IN ENGLISH; sad IN GERMAN; few where pim null and ad not null ) */
	COALESCE(pim.supplier_color_code, a.manufacturer_color_code) AS article_supplier_color_code,
	pim.supplier_color_name AS article_supplier_color_name,
	/* a.manufacturer_color_code AS article_manufacturer_color_code,
	a.manufacturer_color_name AS article_manufacturer_color_name, 
	MANUFACTURER COLOR THE SAME AS PIM.SUPPLIER_COLOR, BUT IN GERMAN*/
	a.size AS article_size,
	pim.hanging_garments AS article_hanging_garment,
	COALESCE(pim.eu_size, sad.eu_size) AS article_eu_size, /* PIM OPTIONAL*/
	COALESCE(pim.supplier_size, sad.supplier_size) AS article_supplier_size, /* DOESN'T LOOK LIKE ad.supplier_size ADDS much */
	COALESCE(pim.eu_length, sad.eu_length) AS article_eu_length, /* PIM OPTIONAL*/
	COALESCE(pim.supplier_length, sad.supplier_length) AS article_supplier_length, /* MANY PIM NULL AND AD NOT NULL) */
	COALESCE(pim.gross_weight_gram, a.weight_gross) AS article_gross_weight_gram, /*article.weight is not null and only 2 cases where it's different from pim */
	COALESCE(pim.net_weight_gram, a.weight_net) AS article_net_weight_gram,
	sad.image_url AS article_image_url, /* sa.img_url null a lot */
	COALESCE(pim.country_of_production, sad.country_of_production) AS article_country_of_production, 
	pim.country_of_origin AS article_country_of_origin,
	pim.buyer AS article_buyer,
	/* TIMES WHEN PIM NULL BUT ARTICLE ISNT; ad.customs_tariff_number as customs_tariff_number_ad null at times */
	COALESCE(pim.customs_tariff_number, a.custom_tariff_number) AS article_customs_tariff_number, 
	pim.customs_tariff_number_ch AS article_customs_tariff_number_ch,
	pim.customs_tariff_number_de AS article_customs_tariff_number_de,
	CASE
		WHEN pim.check_tariff_numbers = TRUE  THEN 'tariff numbers checked'
		WHEN pim.check_tariff_numbers = FALSE THEN 'tariff numbers not checked'
		ELSE NULL
	END AS article_check_tariff_numbers,
 	LEFT(pim.amidala_categories,4000) AS article_amidala_categories, /*LEFT(sad.amidala_categories,4000); formatting different than pim */
	CASE 
		WHEN pim.promotion_item = TRUE  THEN 'promo article' 
		WHEN pim.promotion_item = FALSE THEN 'non promo article'
		ELSE NULL
	END AS article_promotion_item,
	CASE 
		WHEN pim.push = TRUE  THEN 'push article' 
		WHEN pim.push = FALSE THEN 'non push article' 
		ELSE NULL
	END AS article_push_stock,
	pim.nos AS article_nos,
	CASE /* ad nos doesnt always match pim nos */
		WHEN LOWER(pim.nos) LIKE '%all%year%' 	THEN 'nos all year at supplier'
		WHEN LOWER(pim.nos) LIKE '%fs%'			THEN 'nos spring/summer at supplier'
		WHEN LOWER(pim.nos) LIKE '%hw%'			THEN 'nos autumn/winter at supplier'
		WHEN pim.nos IS NULL 					THEN  NULL
		ELSE 'Ask BI'
	END AS article_never_out_of_stock,
	CASE
		WHEN LOWER(pim.supplier_availability) = 'nos' 				THEN 'article always available at supplier'
		WHEN LOWER(pim.supplier_availability) = 'stopped_nos' 		THEN 'nos article not available at supplier'		
		WHEN LOWER(pim.supplier_availability) = 'season' 			THEN 'seasonal article available at supplier'
		WHEN LOWER(pim.supplier_availability) = 'stopped_season' 	THEN 'seasonal article not available at supplier'
		WHEN pim.supplier_availability IS NULL 						THEN NULL
		ELSE 'Ask BI'
	END AS article_supplier_availability,
	CASE
		WHEN pim.season_start IS NULL THEN NULL
		ELSE
			CASE
				WHEN pim.season_start LIKE '%13' OR pim.season_start LIKE '%2013%' THEN '2013-'
				WHEN pim.season_start LIKE '%14' OR pim.season_start LIKE '%2014%' THEN '2014-'
				WHEN pim.season_start LIKE '%15' OR pim.season_start LIKE '%2015%' THEN '2015-'
				WHEN pim.season_start LIKE '%16' OR pim.season_start LIKE '%2016%' THEN '2016-'
				WHEN pim.season_start LIKE '%17' OR pim.season_start LIKE '%2017%' THEN '2017-'
				WHEN pim.season_start LIKE '%18' OR pim.season_start LIKE '%2018%' THEN '2018-'
				WHEN pim.season_start LIKE '%19' OR pim.season_start LIKE '%2019%' THEN '2019-'
				WHEN pim.season_start LIKE '%20' OR pim.season_start LIKE '%2020%' THEN '2020-'
				else ''
			END ||
			CASE
				WHEN LOWER(pim.season_start) LIKE '%all%year%'	THEN 'all year'
				WHEN LOWER(pim.season_start) LIKE '%fs%' 	 	THEN '1-SS'
				WHEN LOWER(pim.season_start) LIKE '%hw%'		THEN '2-FW'
				ELSE ''
			END 
	END AS article_season_start,
	CASE
		WHEN pim.season IS NULL THEN NULL
		ELSE
			CASE /* ad.season covers more data, but it's unclean and doesn't always match pim.season */
				WHEN pim.season LIKE '%13' OR pim.season LIKE '%2013%' THEN '2013-'
				WHEN pim.season LIKE '%14' OR pim.season LIKE '%2014%' THEN '2014-'
				WHEN pim.season LIKE '%15' OR pim.season LIKE '%2015%' THEN '2015-'
				WHEN pim.season LIKE '%16' OR pim.season LIKE '%2016%' THEN '2016-'
				WHEN pim.season LIKE '%17' OR pim.season LIKE '%2017%' THEN '2017-'
				WHEN pim.season LIKE '%18' OR pim.season LIKE '%2018%' THEN '2018-'
				WHEN pim.season LIKE '%19' OR pim.season LIKE '%2019%' THEN '2019-'
				WHEN pim.season LIKE '%20' OR pim.season LIKE '%2020%' THEN '2020-'
				else ''
			END ||
			CASE
				WHEN LOWER(pim.season) LIKE '%all%year%'	THEN 'all year'
				WHEN LOWER(pim.season) LIKE '%fs%' 	 		THEN '1-SS'
				WHEN LOWER(pim.season) LIKE '%hw%'			THEN '2-FW'
				ELSE ''
			END 
	END AS article_season,
	/* CASTING RETAIL PRICES SEEMS OK; NOT SURE ABOUT CASTING ARTICLE COST */
	ROUND(CAST(pim.purchase_price AS DECIMAL), 2) AS article_cost,
	ROUND(CAST(pim.price_retail_de AS DECIMAL), 2) AS article_sales_price_de,
	ROUND(CAST(pim.price_retail_at AS DECIMAL), 2) AS article_sales_price_at,
	ROUND(CAST(pim.price_retail_ch AS DECIMAL), 2) AS article_sales_price_ch,
	ROUND(CAST(pim.price_retail_original AS DECIMAL), 2) AS article_sales_price_original,
		CASE
		WHEN pim.reduced = TRUE 	THEN 'retail price reduced' 
		WHEN pim.reduced = FALSE 	THEN 'no retail price reduction'
		ELSE NULL
	END AS article_sales_price_reduced
	
	
FROM      postgres.article a

LEFT JOIN
(	SELECT * FROM
	(	SELECT
		  ROW_NUMBER() OVER (PARTITION BY p.ean ORDER BY p.date_created DESC) AS rnum,
		  p.ean, p.oo_id, p.net_weight_gram, p.amidala_deactive, p.reason_deactive, p.check_tariff_numbers, p.pic1,
		  p.date_earliest_delivery, p.date_latest_delivery, p.core_article, p.season, p.season_start, p.published, p.reduced,
		  p.article_name, p.supplier_availability, p.supplier_sku, p.alternative_supplier_sku, p.supplier_color_name,
		  p.supplier_color_code, p.push, p.supplier_size, p.supplier_length, p.sku, p.purchase_price, p.price_retail_de,
		  p.price_retail_at, p.price_retail_ch, p.gross_weight_gram, p.price_retail_original, p.customs_tariff_number_de,
		  p.customs_tariff_number_ch, p.activation_ch, p.promotion_item, p.nos, p.commodity_group1, p.commodity_group2, p.commodity_group3, 
		  p.commodity_group4, p.commodity_group5, p.o_parent_id, p.basic_unit, p.customs_tariff_number, p.color1, p.country_of_origin,
		  p.country_of_production, p.color1_shade, p.eu_length, p.eu_size, p.amidala_check, p.hanging_garments, p.buyer,
		  LEFT(CAST(p.amidala_categories AS STRING),4000) AS amidala_categories /* MUST CAST amidala_categories */
		FROM  raw.article_detail_pim p
		WHERE p.ean IS NOT NULL
	) z
	WHERE rnum=1
) pim on a.ean = pim.ean /* DETERMINED THAT ROWS WERE DROPPING OUT WHEN TRYING TO JOIN ON ARTICLE_ID */

LEFT JOIN
( /* GETTING ORDERED SUPPLIER ARTICLE FIELDS */
	SELECT
		sa.article_id,
		sa.article_suppliers,
		sa.article_ever_supplied_by_outfittery,
		COALESCE(fit.supplier_manufacturer_sku, fa.supplier_manufacturer_sku, za.supplier_manufacturer_sku) AS supplier_manufacturer_sku,
		COALESCE(fit.o_parentid, fa.o_parentid, za.o_parentid) AS o_parentid,
		COALESCE(fit.image_url, fa.image_url, za.image_url) AS image_url,
		COALESCE(fit.category, fa.category, za.category) AS category,
		COALESCE(fit.basic_unit, fa.basic_unit, za.basic_unit) AS basic_unit,
		COALESCE(fit.eu_length, fa.eu_length, za.eu_length) AS eu_length,
		COALESCE(fit.eu_size, fa.eu_size, za.eu_size) AS eu_size,
		COALESCE(fit.country_of_production, fa.country_of_production, za.country_of_production) AS country_of_production,
		COALESCE(fit.supplier_sku, fa.supplier_sku, za.supplier_sku) AS supplier_sku,
		COALESCE(fit.supplier_size, fa.supplier_size, za.supplier_size) AS supplier_size,	
		COALESCE(fit.supplier_length, fa.supplier_length, za.supplier_length) AS supplier_length,
		COALESCE(fit.model_o_id, fa.model_o_id, za.model_o_id) AS model_o_id		
		/* COALESCE(fit.customs_tariff_number, fa.customs_tariff_number, za.customs_tariff_number) AS customs_tariff_number, 
		COALESCE(fit.nos, fa.nos, za.nos) AS nos*/
		/*COALESCE(fit., fa., za.) AS ,*/
	FROM
		(SELECT
			article_id, 
			COUNT(DISTINCT supplier_id) AS article_suppliers, 
			MAX(CASE WHEN supplier_id = 15 THEN 'Outfittery' END) AS article_ever_supplied_by_outfittery
	 	 FROM 
	 	 	postgres.supplier_article 
	 	 WHERE 
	 	 	article_id IS NOT NULL GROUP BY 1) sa
		LEFT JOIN (
		SELECT
			sa.article_id,
			MAX(sa.manufacturer_sku) AS supplier_manufacturer_sku,
			MAX(ad.o_parentid) AS o_parentid,
			MAX(sa.image_url) AS image_url, 
			MAX(ad.category) AS category,
			MAX(ad.basic_unit) AS basic_unit,
			MAX(ad.eu_length) AS eu_length,
			MAX(ad.eu_size) AS eu_size,
			MAX(ad.country_of_production) AS country_of_production,
			MAX(ad.customs_tariff_number) AS customs_tariff_number,
			MAX(ad.nos) AS nos,
			MAX(ad.supplier_sku) AS supplier_sku,
			MAX(ad.supplier_length) AS supplier_length,
			MAX(ad.supplier_size) AS supplier_size,
			MAX(ad.model_o_id) AS model_o_id
		FROM
			postgres.supplier_article sa join postgres.article_details ad on sa.id = ad.id
		WHERE
			sa.supplier_id = 15 AND sa.article_id IS NOT NULL
		GROUP BY 1
		) AS fit ON sa.article_id = fit.article_id
		LEFT JOIN (	
		SELECT 
			sa.article_id, 
			MAX(sa.manufacturer_sku) AS supplier_manufacturer_sku,
			MAX(ad.o_parentid) AS o_parentid,
			MAX(sa.image_url) AS image_url, 
			MAX(ad.category) AS category,
			MAX(ad.basic_unit) AS basic_unit,
			MAX(ad.eu_length) AS eu_length,
			MAX(ad.eu_size) AS eu_size,
			MAX(ad.country_of_production) AS country_of_production,
			MAX(ad.customs_tariff_number) AS customs_tariff_number,
			MAX(ad.nos) AS nos,
			MAX(ad.supplier_sku) AS supplier_sku,
			MAX(ad.supplier_length) AS supplier_length,
			MAX(ad.supplier_size) AS supplier_size,
			MAX(ad.model_o_id) AS model_o_id
		FROM
			postgres.supplier_article sa join postgres.article_details ad on sa.id = ad.id
		WHERE
			sa.supplier_id = 10	AND sa.article_id IS NOT NULL
		GROUP BY 1
		) AS za on sa.article_id = za.article_id
		LEFT JOIN (
		SELECT 
			sa.article_id, 
			MAX(sa.manufacturer_sku) AS supplier_manufacturer_sku,
			MAX(ad.o_parentid) AS o_parentid,
			MAX(sa.image_url) AS image_url, 
			MAX(ad.category) AS category,
			MAX(ad.basic_unit) AS basic_unit,
			MAX(ad.eu_length) AS eu_length,
			MAX(ad.eu_size) AS eu_size,
			MAX(ad.country_of_production) AS country_of_production,
			MAX(ad.customs_tariff_number) AS customs_tariff_number,
			MAX(ad.nos) AS nos,
			MAX(ad.supplier_sku) AS supplier_sku,
			MAX(ad.supplier_length) AS supplier_length,
			MAX(ad.supplier_size) AS supplier_size,
			MAX(ad.model_o_id) AS model_o_id
		FROM
			postgres.supplier_article sa join postgres.article_details ad on sa.id = ad.id
		WHERE
			sa.supplier_id = 30 AND sa.article_id IS NOT NULL
		GROUP BY 1
		) AS fa on sa.article_id = fa.article_id
) sad on a.id = sad.article_id


