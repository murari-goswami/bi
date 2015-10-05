-- Name: tableau.ops_throughput_times_order_overview
-- Created: 2015-04-24 18:20:52
-- Updated: 2015-08-07 10:50:42

CREATE VIEW tableau.ops_throughput_times_order_overview 
AS

SELECT 
  co.customer_id, 
  co.order_id,
  co.order_state_number AS co_state, 
  co.date_created AS customer_order_date, 
  op.order_position_mindate,
  op.order_position_maxdate, 
  co.date_invoiced, 
  co.date_cancelled, 
  co.date_completed, 
  co.date_paid, 
  co.date_stylist_picked, 
  co.date_returned, 
  co.date_shipped, 
  co.date_submitted, 
  co.shipping_country,
  co.articles_kept,
  co.articles_picked,
  co.articles_returned,
  co.articles_sent,
  dd.sales_order_header_created,
  dd.date_picklist_created,
  dd.date_backorder, 
  dd.date_on_error, 
  dd.date_shipment_manifest, 
  dd.date_shipment_confirmation, 
  dd.date_returned as dd_date_returned, 
  at.first_pick, 
  at.last_pick,
  at.stylist_article_adds as article_add,
  at.stylist_article_searches as article_search,
  at.stylist_article_removals as article_remove,
  at.stylist_id,
  at.stylist_name
FROM bi.customer_order co 
LEFT JOIN 
(
  select 
    coa.order_id, 
    MIN(coa.date_created) as order_position_mindate,
    MAX(coa.date_created) as order_position_maxdate
  from bi.customer_order_articles coa
  group by 1
) op ON op.order_id = co.order_id 
LEFT JOIN raw.customer_order_logistics dd ON dd.order_id = co.order_id
LEFT JOIN raw.stylist_action_tracking at on at.order_id=co.order_id and co.stylist_id=at.stylist_id
Where co.is_real_order = 'Real Order'


