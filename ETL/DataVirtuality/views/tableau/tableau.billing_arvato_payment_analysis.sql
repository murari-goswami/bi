-- Name: tableau.billing_arvato_payment_analysis
-- Created: 2015-04-24 18:23:13
-- Updated: 2015-08-19 15:11:45

CREATE view tableau.billing_arvato_payment_analysis
AS

SELECT
	co.id,
	co.customer_id,
	co.date_created,
	co.last_updated,
	co.state,
	co.payment_method,
	co.payment_state,
	co.total_amount_basket_purchase_gross,
	co.total_amount_basket_retail_gross,
	co.total_amount_billed_discount,
	co.total_amount_billed_purchase_gross,
	co.total_amount_billed_retail_gross,
	co.date_billed,
	co.date_payed,
	co.total_amount_payed,
	co.date_returned,
	co.date_shipped,
	co_1.date_shipped_internal,
	co.total_amount_reserved,
	co.sales_channel,
	co.phone_date,
	co.stylelist_id,
	co.discount_type,
	co.discount_content,
	co.total_amount_billed_discount_percentage,
	co.total_amount_billed_discount_absolute,
	co.date_completed,
	co.date_encashment,
	co.date_returned_online,
	co.currency_code,
	co.vat_percentage,
	co.invoice_date_created,
	co.invoice_number,
	co.shipping_city,
	co.shipping_country,
	co.shipping_street,
	co.shipping_street_number,
	co.shipping_zip,
	co.shipping_first_name,
	co.shipping_last_name,
	co.shipping_co,
	co.billing_city,
	co.billing_country,
	co.billing_street,
	co.billing_street_number,
	co.billing_zip,
	co.billing_first_name,
	co.billing_last_name,
	co.total_goodwill_credit,
	co.total_amount_billed_retail_gross-coalesce(a.arvato_amount,0) as Open_Ammount_Arvato__c,
	coalesce(a.arvato_amount,0) as Paid_to_Arvato__c,
	co.order_type,
	a.date_created as arvato_date_updated,
	bill.credit_card_brand,
	ret.retoure_value,
	bill.nb_of_credit_card_entries,
	mo.marketing_channel
from views.customer_order co 
left join raw.customer_order co_1 on co_1.order_id=co.id
LEFT JOIN views.marketing_order mo on mo.order_id=co.id
left join 
(
	SELECT 
		ordernumber,
		min(date_created) as date_created,
		sum(amount) as arvato_amount
	FROM views.arvatopayments
	GROUP BY 1
) a on co.id = a.ordernumber
left join 
(
	select 
		customer_id,
		credit_card_brand,
		count(customer_id) as nb_of_credit_card_entries
	from views.billing_data  group by 1,2
) bill on bill.customer_id=co.customer_id
left join 
(
	select 
		order_id,
		sum(quantity*retail_price) as retoure_value 
	from views.order_position 
	where state=512 
	group by 1
) ret on ret.order_id=co.id


