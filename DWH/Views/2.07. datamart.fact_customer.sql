CREATE OR REPLACE VIEW datamart.fact_customer 
AS 
 
SELECT  
	dor.customer_id,
	COUNT(DISTINCT dor.order_id) as nb_orders,
	COUNT(DISTINCT dc.case_no) as nb_cases,
	SUM(fo.items_b4_can) AS items_b4_can, 
	SUM(fo.items_cancelled) AS items_cancelled, 
	SUM(fo.items_b4_ret) AS items_b4_ret, 
	SUM(fo.items_returned) AS items_returned, 
	SUM(fo.items_kept) AS items_kept, 
	SUM(fo.gross_sales_b4_can_in_eur) AS gross_sales_b4_can_in_eur, 
	SUM(fo.gross_sales_can_in_eur) AS gross_sales_can_in_eur, 
	SUM(fo.gross_sales_b4_ret_in_eur) AS gross_sales_b4_ret_in_eur, 
	SUM(fo.gross_sales_ret_in_eur) AS gross_sales_ret_in_eur, 
	SUM(fo.gross_sales_ret_est_in_eur) AS gross_sales_ret_est_in_eur, 
	SUM(fo.gross_sales_expected_in_eur) AS gross_sales_expected_in_eur, 
	SUM(fo.gross_sales_b4_can_in_local_currency) AS gross_sales_b4_can_in_local_currency, 
	SUM(fo.gross_sales_can_in_local_currency) AS gross_sales_can_in_local_currency, 
	SUM(fo.gross_sales_b4_ret_in_local_currency) AS gross_sales_b4_ret_in_local_currency, 
	SUM(fo.gross_sales_ret_in_local_currency) AS gross_sales_ret_in_local_currency, 
	SUM(fo.gross_sales_ret_est_in_local_currency) AS gross_sales_ret_est_in_local_currency, 
	SUM(fo.gross_sales_expected_in_local_currency) AS gross_sales_expected_in_local_currency, 
	SUM(fo.cogs_b4_can) AS cogs_b4_can, 
	SUM(fo.cogs_cancelled) AS cogs_cancelled, 
	SUM(fo.cogs_b4_ret) AS cogs_b4_ret, 
	SUM(fo.cogs_ret) AS cogs_ret, 
	SUM(fo.cogs_ret_est) AS cogs_ret_est, 
	SUM(fo.cogs_expected) AS cogs_expected, 
	SUM(fo.discount_total) AS discount_total, 
	SUM(fo.billing_total) AS billing_total, 
	SUM(fo.billing_received) AS billing_received, 
	SUM(fo.billing_open) AS billing_open, 
	SUM(fo.billing_vat) AS billing_vat, 
	SUM(fo.billing_net_sales) AS billing_net_sales 
FROM datamart.dim_order dor
LEFT JOIN datamart.dim_case dc ON dc.case_id=dor.order_id
LEFT JOIN datamart.fact_order fo ON fo.order_id=dor.order_id
GROUP BY 1