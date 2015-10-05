-- Name: views.inventory_1
-- Created: 2015-04-24 18:19:23
-- Updated: 2015-04-24 18:19:23

CREATE view views.inventory_1
AS
  /*combine all article_ids -> remove null which caused by FULL JOIN*/
SELECT
  CASE 
    WHEN stock.sku IS NOT NULL THEN stock.sku
    WHEN stock.sku IS NULL THEN sm.article_id
  END AS article_id,
  /*combine all date_created -> remove null which caused by FULL JOIN*/ 
  CASE 
    WHEN stock.date_created IS NOT NULL THEN stock.date_created
    WHEN stock.date_created IS NULL THEN sm.date_created
  END AS date_created,
  /*  inventoty at t0 AND t1 FROM stock_entry history + stock_entry current stock*/
  stock.quantity,
  stock.reserved,
  stock.quantity2,
  stock.reserved2,
  /*Stock movements FROM stock_mutation - for ow only - dlv=dilivery - lret=return to supplier*/
  sm.quantity_ow_dlv,
  sm.quantity_z_dlv,
  sm.quantity_ow_lret,
  sm.quantity_z_lret,
  /*Deliveries AND returns FROM purchase_order ow only*/
  pu.pop_fulfilled_quantity,
  pu.pop_quantity,
  pu.pop_initial_quantity,
  pu.pop_retail_price_min,
  pu.pop_purchase_price_min,
  pu.pop_retail_price_max,
  pu.pop_purchase_price_max,
  pu.pop_retail_price_avg,
  pu.pop_purchase_price_avg,
  pu.pop_intial_quantity_retail,
  pu.pop_intial_quantity_purchase,
  pu.pop_quantity_retail,
  pu.pop_quantity_purchase,
  pu.pop_fulfilled_quantity_retail,
  pu.pop_fulfilled_quantity_purchase,
  /*Article information - SELECTed fields needed by einkauf, do not use an extra view in tableau*/
  a.oo_id,
  a.ean,
  a.brand,
  a.article_name,
  a.supplier_availability,
  a.commodity_group1,
  a.commodity_group2,
  a.commodity_group3,
  a.commodity_group4,
  a.commodity_group5,
  a.country_of_production,
  a.processing_code,
  a.color1,
  a.supplier_sku,
  a.supplier_color_code,
  a.supplier_color_name,
  a.purchase_price,
  a.pic1,
  a.color1_shade,
  a.nos,
  a.season,
  a.amidala_deactive,
  a.amidala_categories,
  a.supplier_size,
  a.eu_size,
  a.supplier_length,
  a.eu_length,
  a.alternative_supplier_sku,
  a.push,
  a.reduced,
  a.season_start,
  a.activation_ch,
  a.net_weight_gram,
  a.gross_weight_gram,
  a.de_customs_tarff_number,
  a.ch_customs_tariff_number,
  a.age,
  a.style,
  a.core_article,
  a.o_parentId AS article_o_parentId,
  a.o_published,
  a.o_creationDate,
  a.supplier_article_id,
  a.supplier_article_article_id,
  a.supplier_article_sku,
  a.supplier_article_purchase_price,
  a.supplier_article_ean,
  a.supplier_article_image_url,
  a.supplier_article_partner_shop_url,
  a.supplier_article_manufacturer_sku,
  a.article_id AS article_article_id,
  a.article_title,
  a.article_color,
  a.article_size,
  a.article_sku,
  a.article_model_id,
  a.check_tariff_numbers,
  a.price_retail_de,
  a.price_retail_original,
  a.price_retail_chf,
  a.price_retail_original_chf,
  a.price_retail_dkk,
  a.price_retail_original_dkk,
  a.price_retail_sek,
  a.price_retail_original_sek,
  a.price_retail_benelux,
  a.price_retail_original_benelux,
  a.date_available,
  a.promotion_item,
  a.production_textile,
  a.reason_deactive,
  a.stock_type,
  /*Deilivery Dates*/
  date_delivery.min_date_delivery,
  date_delivery.max_date_delivery,
  se.quantity AS final_stock,
  se.reserved AS final_reserved
FROM views.stock_inventory stock 
LEFT JOIN views.ownstock_article a ON stock.sku=a.article_id
LEFT JOIN views.stock_entry se ON se.date_created=stock.date_created AND se.sku=stock.sku
LEFT JOIN
(
    SELECT
      a.o_parentID, 
      min(CAST(sm.date_created AS date)) AS min_date_delivery, 
      max(CAST(sm.date_created AS date)) AS max_date_delivery
    FROM views.doc_data_stock_mutation sm
    INNER JOIN views.ownstock_article a ON CAST(sm.customer_article_number AS long)=a.article_id
    WHERE sm.booking_code=1 AND sm.processing_state=2 AND
    sm.po_number IN (SELECT CAST(id AS string) FROM views.purchase_order WHERE stock_location_id=2)
    GROUP BY 1
)date_delivery ON a.o_parentId=date_delivery.o_parentId
/*stock movements FROM stock_mutation - for ow only - dlv=dilivery - lret=return to supplier*/
FULL JOIN
(
  SELECT 
    sm.date_created,
    sm.article_id,
    ow_dlv.quantity_ow_dlv,
    z_dlv.quantity_z_dlv,
    ow_lret.quantity_ow_lret,
    z_lret.quantity_z_lret
  FROM
  (
    SELECT 
      CAST(sm.date_created AS date) AS date_created,
      CAST(sm.customer_article_number AS long) AS article_id,
      count(*) AS nb_of_articles
    FROM views.doc_data_stock_mutation sm
    WHERE sm.processing_state=2 
    AND sm.po_number NOT IN (SELECT CAST(id AS string) FROM views.purchase_order WHERE stock_location_id!=2)
    GROUP BY 1,2
  )sm
  LEFT JOIN
  (
    SELECT
      CAST(date_created AS date) AS date_created,
      CAST(customer_article_number AS long) AS article_id, 
      sum(CAST(quantity_good AS integer)) AS quantity_ow_dlv
    FROM views.doc_data_stock_mutation 
    WHERE booking_code=1 AND processing_state=2 AND
    po_number IN (SELECT CAST(id AS string) FROM views.purchase_order WHERE stock_location_id=2)
    GROUP BY 1,2
  )ow_dlv ON ow_dlv.article_id=sm.article_id AND ow_dlv.date_created=sm.date_created
  LEFT JOIN
  (
    SELECT
      CAST(date_created AS date) AS date_created,
      CAST(customer_article_number AS long) AS article_id,
      sum(CAST(quantity_good AS integer)) AS quantity_z_dlv
    FROM views.doc_data_stock_mutation
    WHERE booking_code=1 AND processing_state=2 AND supplier_code='25'
    GROUP BY 1,2
  )z_dlv ON z_dlv.article_id=sm.article_id AND z_dlv.date_created=sm.date_created
  LEFT JOIN
  (
    SELECT 
      CAST(date_created AS date) AS date_created, 
      CAST(customer_article_number AS long) AS article_id, 
      sum(CAST(quantity_good AS integer)) AS quantity_ow_lret
    FROM views.doc_data_stock_mutation
    WHERE
    booking_code=3  AND supplier_code IN (999992, 999998) AND processing_state=2 AND 
    /*Please check once a month AND IN CASE of errors & questions -> ask operations  - manual process*/
    packing_slip_number
    IN ('KUNDENWUNSCH', 'Lieferr. Retour', 'SO', 'SO/BENSHERMAN', 'SO/BENSHERMAN,', 'SO/BUGATTI', 'SO/CAMPUS','SO/DOCKeRS','SO/DOCKERS','SO/FTC','SO/GANT','SO/LEVIS','SO/LVIS',
    'SO/MAZE','SO/KIOMI','SO/MICHAALSKY','SO/MICHALSKY','SO/MICHALSY','SO/OUTFIT.Basic','SO/OUTFIT.BASIC','SO/PAEZ','SO/SELECTED','SO BENSCHERMAN','SO LEVIS','SO SELECTED',
    'LPP ARNE 11.07.2014', 'LPP126729979', 'LPP', 'LPP 4052871253388', '446850002 DOCKERS', 'CAMPUS', 'GANT S5690', 'Campus', 'REF:  TOM TAILOR'
    ) OR LEFT(packing_slip_number,3)='CNR' OR LEFT(packing_slip_number,6) = 'SO CNR' AND LEFT(packing_slip_number,5)!='CNR-Z'
    GROUP BY 1,2
  )ow_lret ON ow_lret.article_id=sm.article_id AND ow_lret.date_created=sm.date_created
  LEFT JOIN
  (
    SELECT
      CAST(date_created AS date) AS date_created, 
      CAST(customer_article_number AS long) AS article_id, 
      sum(CAST(quantity_good AS integer)) AS quantity_z_lret
    FROM views.doc_data_stock_mutation
    WHERE
    booking_code=3  AND supplier_code IN (999992, 999998) AND processing_state=2 AND packing_slip_number
    IN('20140807-CNR-Z', 'RETOURE Z 1', '20140807-CNR Z', '20140806-CNR-Z', 'SVEN04072014', 'SVEN 4.7.2014', 'AUSBUCH_ LARS', 'Retoure Z1',
    'ZALANDO LIEF RET. 2', 'Z-Retoure 14.08', 'Z-LIEF-RETOUR TEIL 2', 'ZALANDO LIF RET T2', 'CNR-Z', 'Z-LIEF-RET T2', 'Ref Z-RETOURE 1', 'ZALANDO LIEF--RETOUR',
    'ZALANDO LIEFRET', 'RETOURE O 1', 'Z-RETOURE 25.8.14', '20140807_CNR-Z', 'Retoure Z 1', '20140806_CNR-Z', 'SVEN 04.07.2014', 'Z-RETOURE 14.08.2014'
    ) OR LEFT(packing_slip_number,5)='CNR-Z'
    GROUP BY 1,2
  )z_lret ON z_lret.article_id=sm.article_id AND z_lret.date_created=sm.date_created
)sm ON sm.article_id=stock.sku AND sm.date_created=stock.date_created
/*Backlog FROM purchase - always agg. yesterday*/
FULL JOIN
(
  SELECT 
    timestampadd(SQL_TSI_DAY, -1, CAST(now() AS date)) AS date_created,
    pop.article_id AS "article_id",
    sum(pop.fulfilled_quantity) AS "pop_fulfilled_quantity",
    sum(pop.quantity) AS "pop_quantity",
    sum(pop.initial_quantity) AS "pop_initial_quantity",
    min(pop.retail_price) AS "pop_retail_price_min",
    min(pop.purchase_price) AS "pop_purchase_price_min",
    max(pop.retail_price) AS "pop_retail_price_max",
    max(pop.purchase_price) AS "pop_purchase_price_max",
    avg(pop.retail_price) AS "pop_retail_price_avg",
    avg(pop.purchase_price) AS "pop_purchase_price_avg",
    sum(pop.initial_quantity*pop.retail_price) AS "pop_intial_quantity_retail",
    sum(pop.initial_quantity*pop.purchase_price) AS "pop_intial_quantity_purchase",
    sum(pop.quantity*pop.retail_price) AS "pop_quantity_retail",
    sum(pop.quantity*pop.purchase_price) AS "pop_quantity_purchase",
    sum(pop.fulfilled_quantity*pop.retail_price) AS "pop_fulfilled_quantity_retail",
    sum(pop.fulfilled_quantity*pop.purchase_price) AS "pop_fulfilled_quantity_purchase"
  FROM views.purchase_order_position pop
  INNER JOIN views.purchase_order po ON pop.purchase_order_id=po.id 
  WHERE po.stock_location_id=2 
  GROUP BY 1,2
)pu ON pu.date_created=stock.date_created AND pu.article_id=stock.sku


