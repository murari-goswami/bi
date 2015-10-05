-- Name: tableau.finance_analyse_credit_card_campaign
-- Created: 2015-04-24 18:17:47
-- Updated: 2015-04-24 18:17:47

CREATE view tableau.finance_analyse_credit_card_campaign
AS
SELECT 
	co.id,
	co.state,
	co.customer_id,
	co.date_created,
	co.date_shipped,
	co.payment_state,
	co.total_amount_billed_discount,
	co.total_amount_billed_retail_gross,
	co.total_goodwill_credit,
	ship_add.country,
	co.payment_method,
	a.retoure_value,
	ref_no.reference_number,
	ref_no.amount as voucher_amount,
	ref_no.date_created as voucher_date_created,
	ref_no.voucher_type,
	cc.credit_card_number
FROM postgres.customer_order co 
/*Address*/
LEFT JOIN postgres.address ship_add ON ship_add.id=co.shipping_address_id
/*Voucher Type*/
JOIN 
(
	SELECT 
		order_id,
		voucher_type,
		reference_number,
		amount,
		date_created,
		last_updated 
	FROM "postgres"."voucher"
) ref_no ON ref_no.order_id=co.id
/*Retour Value*/
LEFT JOIN 
(
	SELECT 
		order_id,
		sum(quantity*retail_price) as retoure_value 
		FROM postgres.order_positiON 
	WHERE state=512 group by 1
)a ON a.order_id=co.id
/*Credit Card Details*/
LEFT JOIN
(
	SELECT 
		customer_id,
		credit_card_number
	FROM "postgres"."billing_data"
) cc ON cc.customer_id=co.customer_id
WHERE ref_no.date_created IS NOT NULL


