-- Name: tableau.finance_investor_report
-- Created: 2015-04-24 18:24:00
-- Updated: 2015-08-28 11:41:18

CREATE VIEW tableau.finance_investor_report
AS

SELECT 
 co.order_id,
 co.customer_id,
 co.date_invoiced as invoice_date_created,
 co.date_shipped,
 co.date_created,
 cu.date_created as customer_date_created,
 co.shipping_country,
 co.vat_percentage,
 co.currency_code,
 co.box_type,
 vco.total_amount_billed_discount_euro,
 vco.total_goodwill_credit_euro,
 vco.total_amount_paid_euro,
 co.order_type,
 co.date_paid as date_payed,
 vco.payment_method,
 co.date_returned,
 vco.first_saleschannel_completed,
 co.articles_sent,
 co.own_stock_articles_sent as articles_sent_os,
 co.partner_articles_sent as articles_sent_ps,
 co.articles_kept,
 co.own_stock_articles_kept as articles_kept_os,
 co.partner_articles_kept as articles_kept_ps,
 co.cost_sent as total_basket_purchase_price,
 co.partner_cost_sent as total_amount_basket_purchase_gross_partner,
 co.own_stock_cost_sent as total_amount_basket_purchase_gross_own,
 co.sales_sent as total_basket_retail_price,
 co.partner_sales_sent as total_amount_basket_retail_gross_partner,
 co.own_stock_sales_sent as total_amount_basket_retail_gross_own,
 op.retoure_value_purchase_price,
 op.return_purchase_gross_partner,
 op.return_purchase_gross_own,
 op.retoure_value,
 op.return_retail_gross_partner,
 op.return_retail_gross_own,
 op.gross_lost_purchase,
 op.gross_lost_purchase_partner,
 op.gross_lost_purchase_own,
 op.gross_lost_retail,
 op.gross_lost_retail_partner,
 op.gross_lost_retail_own,
 arv.paid_to_arvato,
 arv.arvato_paid_date,
 ca.discount_code as campaign_code,
 ca.campaign_title,
 ca.discount_currency as campaign_currency
FROM bi.customer_order co
JOIN views.customer_order vco on vco.id = co.order_id
JOIN bi.customer cu on cu.customer_id = co.customer_id
JOIN 
(
 SELECT
  op.order_id,
  SUM(op.cost_returned) retoure_value_purchase_price,
  SUM(CASE WHEN op.stock_location_id <> 2 THEN op.cost_returned ELSE 0 END)  as return_purchase_gross_partner,
  SUM(CASE WHEN op.stock_location_id = 2 THEN op.cost_returned ELSE 0 END) as return_purchase_gross_own,
  SUM(op.sales_returned) retoure_value,
  SUM(CASE WHEN op.stock_location_id <> 2 THEN op.sales_returned ELSE 0 END) as return_retail_gross_partner,
  SUM(CASE WHEN op.stock_location_id = 2 THEN op.sales_returned ELSE 0 END) as return_retail_gross_own,
  SUM(op.cost_lost) gross_lost_purchase,
  SUM(CASE WHEN op.stock_location_id <> 2 THEN op.cost_lost ELSE 0 END)  as gross_lost_purchase_partner,
  SUM(CASE WHEN op.stock_location_id = 2 THEN op.cost_lost ELSE 0 END) as gross_lost_purchase_own,
  SUM(op.sales_lost) gross_lost_retail,
  SUM(CASE WHEN stock_location_id <> 2 THEN op.sales_lost ELSE 0 END) as gross_lost_retail_partner,
  SUM(CASE WHEN stock_location_id = 2 THEN op.sales_lost ELSE 0 END) as gross_lost_retail_own
 FROM bi.customer_order_articles op
 GROUP BY 1
) op on op.order_id=co.order_id
LEFT JOIN raw.discount_campaigns ca on ca.campaign_id = co.campaign_id
LEFT JOIN
(
 SELECT 
  ordernumber,
  sum(amount) as paid_to_arvato,
  max(cast(date_created as date)) as arvato_paid_date
 FROM views.arvatopayments
 group by 1
) arv on arv.ordernumber = co.order_id
WHERE co.date_invoiced >= '2013-01-01'
AND co.is_real_order = 'Real Order'
AND co.order_state_number <= 1024


