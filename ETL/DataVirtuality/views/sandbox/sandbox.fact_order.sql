-- Name: sandbox.fact_order
-- Created: 2015-09-28 12:28:46
-- Updated: 2015-09-28 12:28:46

/********************************************************************************************** 
-- Author       Hemanth 
-- Created      2015-07-01 
-- Purpose      This view joins tables from raw and datamart schema, this view has all kpi's aggregated 
                on customer_id 
-- Tables       datamart.dim_order,datamart.dim_case,datamart.fact_order 
-------------------------------------------------------------------------------------------------- 
-- Modification History 
 
-- Date          Author      Description 
-- 2015-09-16    Hemanth     1) Header for query 
**************************************************************************************************/ 
CREATE VIEW sandbox.fact_order 
AS 
 
SELECT 
  op_1.order_id, 
   
  op_1.items_b4_can AS itb4canc, 
  op_1.items_cancelled AS itcan, 
  op_1.items_b4_ret AS itb4ret, 
  op_1.items_returned AS itret, 
  op_1.items_returned_est AS estitret, 
  COALESCE(op_1.items_kept,op_1.items_kept_est) AS itexp, 
 
  /*Gross Sales In euros*/ 
  op_1.gross_sales_b4_can_in_eur AS gsb4canc_in_eur, 
  op_1.gross_sales_can_in_eur AS gscanc_in_eur, 
  op_1.gross_sales_b4_ret_in_eur AS gsb4ret_in_eur, 
  op_1.gross_sales_ret_in_eur AS gret_in_eur, 
  fo_1.goodwill_in_eur AS ggood_in_eur, 
  op_1.gross_sales_ret_est_in_eur AS estgret_in_eur, 
  COALESCE(op_1.sales_kept_in_eur,op_1.sales_kept_est_in_eur)-fo_1.est_goodwill_in_eur AS gsexp_in_eur, 
  /*Net Sales*/ 
  op_1.gross_sales_b4_can_in_eur/(1+v.vat_rate) AS nsb4canc_in_eur, 
  op_1.gross_sales_can_in_eur/(1+v.vat_rate) AS nscanc_in_eur, 
  op_1.gross_sales_b4_ret_in_eur/(1+v.vat_rate) AS nsb4ret_in_eur, 
  op_1.gross_sales_ret_in_eur/(1+v.vat_rate) AS nret_in_eur, 
  fo_1.goodwill_in_eur/(1+v.vat_rate) AS ngood_in_eur, 
  op_1.gross_sales_ret_est_in_eur AS estnret_in_eur,
  (COALESCE(op_1.sales_kept_in_eur,op_1.sales_kept_est_in_eur)-fo_1.est_goodwill_in_eur)/(1+v.vat_rate) AS nsexp_in_eur, 
   
  /*Gross Sales in Local Currency*/ 
  op_1.gross_sales_b4_can_in_local_currency  AS gsb4canc_in_local_currency, 
  op_1.gross_sales_can_in_local_currency AS gscanc_in_local_currency, 
  op_1.gross_sales_b4_ret_in_local_currency AS gsb4ret_in_local_currency, 
  op_1.gross_sales_ret_in_local_currency AS gret_in_local_currency, 
  fo_1.goodwill_in_local_currency AS ggood_in_local_currency, 
  op_1.gross_sales_ret_est_in_local_currency AS estgret_in_local_currency, 
  COALESCE(op_1.sales_kept_in_local_currency,op_1.sales_kept_est_in_local_currency)-fo_1.est_goodwill_in_local_currency AS gsexp_in_local_currency, 
  /*Net Sales in Local Currency*/ 
  op_1.gross_sales_b4_can_in_local_currency/(1+v.vat_rate) AS nsb4canc_in_local_currency, 
  op_1.gross_sales_can_in_local_currency/(1+v.vat_rate) AS nscanc_in_local_currency, 
  op_1.gross_sales_b4_ret_in_local_currency/(1+v.vat_rate) AS nsb4ret_in_local_currency, 
  op_1.gross_sales_ret_in_local_currency/(1+v.vat_rate) AS nret_in_local_currency, 
  fo_1.goodwill_in_local_currency/(1+v.vat_rate) AS ngood_in_local_currency, 
  op_1.gross_sales_ret_est_in_local_currency/(1+v.vat_rate) AS estnret_in_local_currency, 
  (COALESCE(op_1.sales_kept_in_local_currency,op_1.sales_kept_est_in_local_currency)-fo_1.est_goodwill_in_local_currency)/e.exchange_rate/(1+v.vat_rate) AS nsexp_in_local_currency, 
   
  op_1.cogb4canc, 
  op_1.cogcanc, 
  op_1.cogb4ret, 
  op_1.cogret, 
  op_1.Estcogret, 
  COALESCE(op_1.cogs_kept,op_1.cogs_kept_est) AS cogexp, 
 
  fo_1.discount_in_local_currency as netdisc_in_local_currency,
  fo_1.discount_in_eur as netdisc_in_eur,
  fo_1.est_discount_in_local_currency as estnetdisc_in_local_currency,
  fo_1.est_discount_in_eur as estnetdisc_in_eur,

  co_2.date_amount_paid, 
  CASE   
      WHEN COALESCE(op_1.sales_kept_in_local_currency,op_1.sales_kept_est_in_local_currency) - co_1.discount_total < 0 THEN 0  
      ELSE COALESCE(op_1.sales_kept_in_local_currency,op_1.sales_kept_est_in_local_currency) - co_1.discount_total  
    END AS billing_total, 
    co_2.billing_received, 
    CASE   
      WHEN COALESCE(op_1.sales_kept_in_local_currency,op_1.sales_kept_est_in_local_currency) - co_1.discount_total < 0 THEN 0  
      ELSE COALESCE(op_1.sales_kept_in_local_currency,op_1.sales_kept_est_in_local_currency) - co_1.discount_total 
    END - co_2.billing_received AS billing_open, 
 
    CASE   
      WHEN COALESCE(op_1.sales_kept_in_local_currency,op_1.sales_kept_est_in_local_currency) - co_1.discount_total < 0 THEN 0  
      ELSE COALESCE(op_1.sales_kept_in_local_currency,op_1.sales_kept_est_in_local_currency) - co_1.discount_total 
    END * (v.vat_rate/(1 + v.vat_rate)) AS billing_vat,  
    CASE   
     
      WHEN COALESCE(op_1.sales_kept_in_local_currency,op_1.sales_kept_est_in_local_currency) - co_1.discount_total < 0 THEN 0  
      ELSE COALESCE(op_1.sales_kept_in_local_currency,op_1.sales_kept_est_in_local_currency) - co_1.discount_total 
    END / (1 + v.vat_rate) AS billing_net_sales 
FROM raw.fact_order op_1
LEFT JOIN raw.dim_customer_order co_1 on co_1.order_id=op_1.order_id 
LEFT JOIN dwh.historical_exchange_rates e on e.currency_code = co_1.country_code_iso AND cast(co_1.date_invoiced AS date) = e.date 
LEFT JOIN dwh.calendar c on c.date = cast(co_1.date_invoiced AS date) 
LEFT JOIN dwh.vat_rates v on v.year_month = c.year_month AND co_1.shipping_country = v.country_code_iso 
LEFT JOIN
(
  SELECT
    fo.order_id,
    fo.goodwill_in_local_currency,
    fo.goodwill_in_eur,
    fo.discount_in_local_currency,
    fo.discount_in_eur,
    CASE 
      WHEN fo.items_returned=fo.items_b4_ret AND fo.goodwill_in_local_currency IS NOT NULL THEN 0 
      ELSE fo.goodwill_in_local_currency
    END AS est_goodwill_in_local_currency,
    CASE 
      WHEN fo.items_returned=fo.items_b4_ret AND fo.goodwill_in_eur IS NOT NULL THEN 0 
      ELSE fo.goodwill_in_eur
    END AS est_goodwill_in_eur,
    CASE 
      WHEN fo.items_returned=fo.items_b4_ret AND fo.discount_in_local_currency IS NOT NULL THEN 0
      ELSE fo.discount_in_local_currency
    END AS est_discount_in_local_currency,
    CASE 
      WHEN fo.items_returned=fo.items_b4_ret AND fo.discount_in_eur IS NOT NULL THEN 0
      ELSE fo.discount_in_eur
    END AS est_discount_in_eur
  FROM raw.fact_order fo
)fo_1 ON fo_1.order_id=op_1.order_id
LEFT JOIN 
( 
  SELECT 
    c.order_id, 
    /*billing recieved arvato customers is uploaded in dwh from arvato ftp server*/ 
    COALESCE(CASE  
      WHEN c.payment_type<>'Arvato' THEN c.total_amount_payed 
      ELSE arv.billing_received_arvato 
    END,0) AS billing_received, 
    CASE 
      WHEN c.payment_type<>'Arvato' THEN c.date_paid 
      ELSE arv.date_arvato_paid 
    END AS date_amount_paid 
  FROM raw.dim_customer_order c 
  LEFT JOIN 
  ( 
    SELECT   
      ordernumber AS order_id,  
      MIN(date_created) AS date_arvato_paid,  
      SUM(amount) AS billing_received_arvato  
    FROM dwh.arvato_payments ap  
    GROUP BY 1  
  )arv on arv.order_id = c.order_id 
)co_2 on co_1.order_id=co_2.order_id


