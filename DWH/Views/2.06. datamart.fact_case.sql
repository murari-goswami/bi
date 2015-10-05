CREATE OR REPLACE VIEW datamart.fact_case
AS

SELECT 
	dc.case_id,
	SUM(items_b4_can) as items_b4_can,
	SUM(items_cancelled) as items_cancelled,
	SUM(items_b4_ret) as items_b4_ret,
	SUM(items_returned) as items_returned,
	SUM(items_kept) as items_kept,
	SUM(gross_sales_b4_can_in_eur) as gross_sales_b4_can_in_eur,
	SUM(gross_sales_can_in_eur) as gross_sales_can_in_eur,
	SUM(gross_sales_b4_ret_in_eur) as gross_sales_b4_ret_in_eur,
	SUM(gross_sales_ret_in_eur) as gross_sales_ret_in_eur,
	SUM(gross_sales_ret_est_in_eur) as gross_sales_ret_est_in_eur,
	SUM(gross_sales_expected_in_eur) as gross_sales_expected_in_eur,
	SUM(gross_sales_b4_can_in_local_currency) as gross_sales_b4_can_in_local_currency,
	SUM(gross_sales_can_in_local_currency) as gross_sales_can_in_local_currency,
	SUM(gross_sales_b4_ret_in_local_currency) as gross_sales_b4_ret_in_local_currency,
	SUM(gross_sales_ret_in_local_currency) as gross_sales_ret_in_local_currency,
	SUM(gross_sales_ret_est_in_local_currency) as gross_sales_ret_est_in_local_currency,
	SUM(discount_goodwill_in_local_currency) as discount_goodwill_in_local_currency,
	SUM(gross_sales_expected_in_local_currency) as gross_sales_expected_in_local_currency,
	SUM(cogs_b4_can) as cogs_b4_can,
	SUM(cogs_cancelled) as cogs_cancelled,
	SUM(cogs_b4_ret) as cogs_b4_ret,
	SUM(cogs_ret) as cogs_ret,
	SUM(cogs_ret_est) as cogs_ret_est,
	SUM(cogs_expected) as cogs_expected,
	SUM(discount_total) as discount_total,
	SUM(billing_total) as billing_total,
	SUM(billing_received) as billing_received,
	SUM(billing_open) as billing_open,
	SUM(billing_vat) as billing_vat,
	SUM(billing_net_sales) as billing_net_sales
FROM datamart.dim_order dc
LEFT JOIN datamart.fact_order fo  ON fo.order_id=dc.order_id
WHERE case_id IS NOT NULL
GROUP BY 1