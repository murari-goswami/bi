-- Name: raw.fact_order
-- Created: 2015-09-30 09:59:39
-- Updated: 2015-09-30 09:59:39

/**********************************************************************************************
-- Author       Hemanth
-- Created      2015-07-01
-- Purpose      This view applies estimation for orders which are not returned and finally 
                all kpi's are aggreated on order_id
-- Tables       datamart.dim_opportunity,datamart.dim_order,raw.customer,raw.dim_case
--------------------------------------------------------------------------------------------------
-- Modification History

-- Date          Author      Description
-- 2015-09-16    Hemanth     1) Added Estimation for Item
                             2) Header for query
-- 2015-09-28   Hemanth      1) Added discount_goodwill and discount_marketing subquery  
-- 2015-09-30	Hemanth		 1) Added purchase price (cost) from item/article table
**************************************************************************************************/
CREATE VIEW "raw"."fact_order"
AS

WITH o_position AS
(
  SELECT
  coa.order_position_id,
  coa.order_id,
  coa.state,
  coa.quantity,

  coa.items_picked_wt_can,
  coa.items_picked,
  coa.items_kept,
  coa.items_returned,
  coa.items_lost,
  coa.items_cancelled,

  /*Sales in Local Currency*/
  coa.items_picked_wt_can*coa.sales_in_local_currency AS sales_picked_wt_can_in_local_currency,
  coa.items_picked*coa.sales_in_local_currency AS sales_picked_in_local_currency,
  coa.items_kept*coa.sales_in_local_currency AS sales_kept_in_local_currency,
  coa.items_returned*coa.sales_in_local_currency AS sales_returned_in_local_currency,
  coa.items_lost*coa.sales_in_local_currency AS sales_lost_in_local_currency,
  coa.items_cancelled*coa.sales_in_local_currency AS sales_cancelled_in_local_currency,
  COALESCE(
        CASE 
            WHEN coa.state=512 then coa.sales_in_local_currency
            ELSE coa.sales_in_local_currency*return_probability 
        END,0) AS sales_returned_est_in_local_currency,
  COALESCE(
        CASE 
            WHEN coa.state=1024 then coa.sales_in_local_currency
            ELSE coa.sales_in_local_currency*(1-return_probability)
        END,0) AS sales_kept_est_in_local_currency,

  /*Sales In Euros*/
  coa.items_picked_wt_can*coa.sales_in_local_currency/e.exchange_rate  AS sales_picked_wt_can_in_eur,
  coa.items_picked*coa.sales_in_local_currency/e.exchange_rate AS sales_picked_in_eur,
  coa.items_kept*coa.sales_in_local_currency/e.exchange_rate AS sales_kept_in_eur,
  coa.items_returned*coa.sales_in_local_currency/e.exchange_rate AS sales_returned_in_eur,
  coa.items_lost*coa.sales_in_local_currency/e.exchange_rate AS sales_lost_in_eur,
  coa.items_cancelled*coa.sales_in_local_currency/e.exchange_rate AS sales_cancelled_in_eur,
  COALESCE(
    CASE 
      WHEN coa.state=512 then coa.sales_in_local_currency/e.exchange_rate
      ELSE (coa.sales_in_local_currency/e.exchange_rate)*return_probability 
    END,0) AS sales_returned_est_in_eur,
  COALESCE(
    CASE 
      WHEN coa.state=1024 then coa.sales_in_local_currency/e.exchange_rate
      ELSE (coa.sales_in_local_currency/e.exchange_rate)*(1-return_probability)
    END,0) AS sales_kept_est_in_eur,
  /*COST*/
  coa.items_picked_wt_can*COALESCE(it.unit_cost,art.article_cost) AS cost_picked_with_can,
  coa.items_picked*COALESCE(it.unit_cost,art.article_cost) AS cost_picked,
  coa.items_kept*COALESCE(it.unit_cost,art.article_cost) AS cost_kept,
  coa.items_returned*COALESCE(it.unit_cost,art.article_cost) AS cost_returned,
  coa.items_lost*COALESCE(it.unit_cost,art.article_cost) AS cost_lost,
  coa.items_cancelled*COALESCE(it.unit_cost,art.article_cost) AS cost_cancelled,
  COALESCE(
    CASE 
      WHEN coa.state=512 then coa.items_picked
      ELSE coa.items_picked*return_probability 
    END,0) AS items_returned_est,
  COALESCE(
    CASE 
      WHEN coa.state=1024 then coa.items_picked
      ELSE coa.items_picked*(1-return_probability)
    END,0) AS items_kept_est,

  COALESCE(CASE WHEN coa.state=512 THEN coa.cost_in_eur ELSE coa.cost_in_eur*return_probability END,0) AS cost_returned_est,
  COALESCE(CASE WHEN coa.state=1024 THEN coa.cost_in_eur ELSE coa.cost_in_eur*(1-return_probability) END,0) AS cost_kept_est

  FROM raw.fact_order_position coa
  JOIN raw.dim_customer_order co ON co.order_id = coa.order_id
  LEFT JOIN bi.item it on it.article_id=coa.article_id
  LEFT JOIN bi.article art on art.article_id=coa.article_id
  LEFT JOIN dwh.historical_exchange_rates e on e.currency_code = co.country_code_iso AND cast(co.date_invoiced AS date) = e.date
  LEFT JOIN dwh.order_position_fixed_purchase_prices opfpp on coa.order_position_id = opfpp.order_position_id
  LEFT JOIN raw.return_rate_probability rp on rp.order_position_id=coa.order_position_id
)

SELECT
    op.order_id,
    
    /*Items*/
    SUM(op.items_picked_wt_can) AS items_b4_can,
    SUM(op.items_cancelled) AS items_cancelled,
    SUM(op.items_picked) AS items_b4_ret,
    SUM(COALESCE(op.items_returned, 0) + COALESCE(op.items_lost, 0)) AS items_returned,
    SUM(op.items_returned_est) AS items_returned_est,
    SUM(op.items_kept) AS items_kept,
    SUM(op.items_kept_est) AS items_kept_est,
    
    /*Sales in EUROs-Datamart*/
    SUM(op.sales_picked_wt_can_in_eur) AS gross_sales_b4_can_in_eur,
    SUM(op.sales_cancelled_in_eur) AS gross_sales_can_in_eur,
    SUM(op.sales_picked_in_eur) AS gross_sales_b4_ret_in_eur,
    SUM(COALESCE(op.sales_returned_in_eur, 0) + COALESCE(op.sales_lost_in_eur, 0)) AS gross_sales_ret_in_eur, 
    SUM(op.sales_returned_est_in_eur) AS gross_sales_ret_est_in_eur,
    SUM(op.sales_kept_in_eur) AS sales_kept_in_eur,
    SUM(op.sales_kept_est_in_eur) AS sales_kept_est_in_eur,
    
    /*Sales in Local Currency-Datamart*/
    SUM(op.sales_picked_wt_can_in_local_currency) AS gross_sales_b4_can_in_local_currency,
    SUM(op.sales_cancelled_in_local_currency) AS gross_sales_can_in_local_currency,
    SUM(op.sales_picked_in_local_currency) AS gross_sales_b4_ret_in_local_currency,
    SUM(COALESCE(op.sales_returned_in_local_currency, 0) + COALESCE(op.sales_lost_in_local_currency, 0)) AS gross_sales_ret_in_local_currency, 
    SUM(op.sales_returned_est_in_local_currency) AS gross_sales_ret_est_in_local_currency,
    SUM(op.sales_kept_in_local_currency) AS sales_kept_in_local_currency, 
    SUM(op.sales_kept_est_in_local_currency) AS sales_kept_est_in_local_currency,
    
    /*COGS (currency is always in EUR)-Datamart*/
    SUM(op.cost_picked_with_can) AS cogb4canc,
    SUM(op.cost_cancelled) AS cogcanc, 
    SUM(op.cost_picked) AS cogb4ret,
    SUM(COALESCE(op.cost_returned, 0) + COALESCE(op.cost_lost, 0)) AS cogret,
    SUM(op.cost_returned_est) AS estcogret,
    SUM(op.cost_kept) as cogs_kept,
    SUM(op.cost_kept_est) as cogs_kept_est,
    
    AVG(co.goodwill_in_local_currency) AS goodwill_in_local_currency,
  	AVG(co.goodwill_in_eur) AS goodwill_in_eur,
  	AVG(co.discount_in_local_currency) AS discount_in_local_currency,
  	AVG(co.discount_in_eur) AS discount_in_eur
  
FROM o_position op
LEFT JOIN
(
  SELECT 
    co_1.order_id,
    co_1.discount_goodwill as goodwill_in_local_currency,
    co_1.discount_goodwill/e.exchange_rate AS goodwill_in_eur,
    co_1.discount_marketing as discount_in_local_currency,
    co_1.discount_marketing/e.exchange_rate as discount_in_eur
  FROM raw.dim_customer_order co_1
  LEFT JOIN dwh.historical_exchange_rates e on e.currency_code = co_1.country_code_iso AND cast(co_1.date_invoiced AS date) = e.date 
)co on co.order_id=op.order_id
GROUP BY op.order_id


