-- Name: tableau.treasury_stock_underway
-- Created: 2015-05-04 17:59:47
-- Updated: 2015-07-30 17:59:45

CREATE view tableau.treasury_stock_underway
AS

SELECT
  cASt(co.date_shipped AS date) AS date_shipped,
  SUM(op.retail_price_euro) AS retail_price_euro,
  COUNT(CASE WHEN op.state>=128 AND op.state<2048 THEN op.id else NULL END) AS shipped_items_incl_returns_all,
  COUNT(CASE WHEN op.stock_locatiON_id=1 AND op.state>=128 AND op.state<2048 THEN op.id else NULL END) AS shipped_items_incl_returns_z,
  COUNT(CASE WHEN op.stock_locatiON_id=2 AND op.state>=128 AND op.state<2048 THEN op.id else NULL END) AS shipped_items_incl_returns_own,
  COUNT(CASE WHEN op.stock_locatiON_id=3 AND op.state>=128 AND op.state<2048 THEN op.id else NULL END) AS shipped_items_incl_returns_z_ch,
  SUM(CASE WHEN op.state>=128 AND op.state<2048 THEN retail_price_euro else 0 END) AS shipped_value_incl_returns_all,
  SUM(CASE WHEN op.stock_locatiON_id=1 AND op.state>=128 AND op.state<2048 THEN retail_price_euro else 0 END) AS shipped_value_incl_returns_z,
  SUM(CASE WHEN op.stock_locatiON_id=2 AND op.state>=128 AND op.state<2048 THEN retail_price_euro else 0 END) AS shipped_value_incl_returns_own,
  SUM(CASE WHEN op.stock_locatiON_id=3 AND op.state>=128 AND op.state<2048 THEN retail_price_euro else 0 END) AS shipped_value_incl_returns_z_ch
FROM views.customer_order co
JOIN views.order_positiON op ON op.order_id=co.id
WHERE cast(co.date_shipped as date)>='2014-01-01'
and co.state<2048
GROUP BY 1


