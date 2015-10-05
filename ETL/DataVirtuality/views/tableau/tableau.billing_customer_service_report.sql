-- Name: tableau.billing_customer_service_report
-- Created: 2015-04-24 18:23:49
-- Updated: 2015-08-07 14:01:29

CREATE view tableau.billing_customer_service_report
AS
SELECT 
	co.id,
	co.state,
	co.customer_id,
	co.date_returned,
	co.date_created,
	co.date_shipped,
	co.payment_state,
	co.total_amount_payed,
	co.total_amount_billed_discount,
	co.total_goodwill_credit,
	co.shipping_first_name as first_name,
	co.shipping_last_name as last_name,
	co.shipping_country as country,
	co.payment_method,
	co.total_amount_basket_purchase_gross,
	co.total_amount_basket_retail_gross,
	co.total_amount_billed_retail_gross,
	co.total_amount_billed_purchase_gross,
	a.retoure_value,
	co.invoice_number as reference_number,
	co.invoice_date_created as Rechnungsdatum
FROM views.customer_order co 
LEFT JOIN 
(
	SELECT 
		order_id,
		sum(quantity*retail_price) as retoure_value 
		FROM views.order_position 
		WHERE state=512 
		GROUP BY 1
)a on a.order_id=co.id


