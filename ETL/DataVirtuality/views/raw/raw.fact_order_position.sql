-- Name: raw.fact_order_position
-- Created: 2015-09-22 17:08:25
-- Updated: 2015-09-22 17:08:25

/*******************************************************************
-- Author       Hemanth
-- Created      2015-07-01
-- Purpose      This view Gets the raw data from POSTGRES tables. This table hAS all  
--              articles picked in amidala
--Tables        order_position,supplier_article
-------------------------------------------------------------------------------
-- Modification History
--Date          Author      Description
--2015-09-16    Hemanth     Added Header to query
*******************************************************************/

CREATE VIEW raw.fact_order_position
AS

SELECT
  op.id AS order_position_id,
  op.order_id,
  op.state,
  op.quantity,
  op.article_id,
  op.stock_location_id,
  CASE WHEN op.state >= 16 AND op.state <= 2048 THEN op.quantity ELSE NULL END AS items_picked_wt_can,
  CASE WHEN op.state >= 16 AND op.state < 2048 THEN op.quantity ELSE NULL END AS items_picked,
  CASE WHEN op.state >= 128 AND op.state < 2048 THEN op.quantity ELSE NULL END AS items_sent,
  CASE WHEN op.state = 1024 THEN op.quantity ELSE NULL END AS items_kept,
  CASE WHEN op.state = 512  THEN op.quantity ELSE NULL END AS items_returned,
  CASE WHEN op.state = 1536 THEN op.quantity ELSE NULL END AS items_lost,
  CASE WHEN op.state = 2048 THEN op.quantity ELSE NULL END AS items_cancelled,
  ROUND(CAST(op.purchase_price AS DECIMAL),2) AS cost_in_eur,
  ROUND(CAST(op.retail_price AS DECIMAL),2) AS sales_in_local_currency
FROM postgres.order_position op
/* Need to join to supplier article to check if items are gifts. It needs to be a subselect due to duplicates in the table */
LEFT JOIN 
(
  SELECT
    sa.article_id
  FROM postgres.supplier_article sa 
  WHERE sa.supplier_id = 15
  GROUP BY sa.article_id
) sa on sa.article_id = op.article_id


