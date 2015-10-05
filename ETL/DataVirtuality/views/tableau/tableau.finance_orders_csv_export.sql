-- Name: tableau.finance_orders_csv_export
-- Created: 2015-04-24 18:23:18
-- Updated: 2015-04-24 18:23:18

CREATE view tableau.finance_orders_csv_export
AS
SELECT
	co.id,
	co.customer_id,
	co.state,
	co.invoice_number,
	co.total_amount_billed_discount,
	co.date_returned,
	co.date_shipped,
	co.invoice_date_created,
	co.shipping_first_name as first_name,
	co.shipping_last_name as last_name,
	co.shipping_country as country,
	op.total_amount_basket_retail_gross,
	op.total_amount_basket_purchse_gross,
	op.total_amount_billed_retail_gross,
	op.total_amount_billed_purchase_gross
FROM views.customer_order co 
JOIN
(
	SELECT 
		op.order_id, 
		sum(case when op.state>=16 and op.state<2048 then op.quantity*op.purchase_price else 0 end) total_amount_basket_purchse_gross,
		sum(case when op.state>=16 and op.state<2048 then op.quantity*op.retail_price_euro else 0 end) total_amount_basket_retail_gross,
		sum(case when op.state=1024 then op.quantity*op.purchase_price else 0 end) total_amount_billed_purchase_gross,
		sum(case when op.state=1024 then op.quantity*op.retail_price_euro else 0 end) total_amount_billed_retail_gross
	FROM views.order_position op
	GROUP BY 1
) op on op.order_id=co.id


