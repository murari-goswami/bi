-- Name: tableau.ops_inbound_SLA_quantities
-- Created: 2015-04-24 18:20:51
-- Updated: 2015-04-24 18:20:51

CREATE view tableau.ops_inbound_SLA_quantities
as 
SELECT 
  cast(poa.date_poa_created AS date) AS purchase_order_date_created, 
  poa.purchase_order_id, 
  poa.article_ean as ean, 
  poa.article_id,
  poa.stock_ordered_revised AS updated_quantity,
  poa.stock_ordered_initially as initial_quantity, 
  poa.stock_booked as fulfilled_quantity, 
  poa.date_stock_handedover_max as max_date_given_to_serviceprovider,
  poa.stock_scanned as count_scans,
  poa.stock_scanned_ean_unknown_articles as count_ean_unknown,
  poa.stock_scanned_photo_articles as count_photo_article,
  poa.stock_scanned_overdelivered_articles as count_overdelivered,
  sm.supplier_id as supplier_code,
  sm.max_booking_date,
  sm.booking_count
FROM bi.purchase_order_articles poa
LEFT JOIN 
(
  SELECT
      purchase_order_id, 
      article_id,
      supplier_id,
      MAX(date_stock_booked) AS max_booking_date,
      sum(stock_booked) as booking_count
    FROM bi.stock_booked 
    WHERE purchase_order_id <> '' AND supplier_id <> '10'
    GROUP BY 1,2,3
) AS sm
on sm.purchase_order_id = poa.purchase_order_id AND sm.article_id = poa.article_id
WHERE cast(poa.date_poa_created AS date) > '2014-04-01'
and driving_tbl_poa IS NOT NULL


