-- Name: tableau.treasury_arvato_orders_retail_price_to_cc
-- Created: 2015-04-24 18:24:54
-- Updated: 2015-04-24 18:24:54

CREATE view tableau.treasury_arvato_orders_retail_price_to_cc
AS
SELECT
	co.id,
	co.payment_method,
	co.date_created,
	co.date_shipped,
	co.date_returned,
	co.invoice_date_created,
	a.date_created as arvato_date_updated,
	co.total_goodwill_credit,
	co.total_amount_billed_discount,
	co.total_amount_basket_retail_gross,
	ret.value_of_returns,
	co.total_amount_billed_retail_gross,
	coalesce(a.amount,0) as Paid_to_Arvato__c,
	co.total_amount_billed_retail_gross-coalesce(a.open_amount,0) as Open_Ammount_Arvato__c,
	co.shipping_first_name,
	co.shipping_last_name,
	co.shipping_street,
	co.shipping_street_number,
	co.shipping_zip,
	co.shipping_city,
	co.shipping_country,
	co.shipping_co,
	co.order_type,
	fd.arvatotype,
	fd.arvatoorderlimit,
	fd.arvatoresult,
	fd.arvatoscore,
	sfo.ArvatoYorN__c,
	au.date_prepay_to_credit_card as pay_changed_date_created,
	cast(co.date_created as date)=cast(au.date_prepay_to_credit_card as date) as "vk_cc_y_n"
FROM views.customer_order co
/*Arvato Payment*/
LEFT JOIN 
(
	SELECT 
		id,
		ordernumber,
		date_created,
		amount,
		sum(amount) over(partition by ordernumber ORDER BY date_created) as open_amount 
		FROM views.arvatopayments 
)a on co.id=a.ordernumber
/*Value of Returns*/
LEFT JOIN 
(
	SELECT 
		order_id,
		sum(quantity*retail_price) as value_of_returns 
		FROM views.order_position 
		WHERE state=512
		GROUP BY 1
)ret on ret.order_id=co.id
LEFT JOIN views.financial_data fd on fd.order_id=co.id
LEFT JOIN views.salesforce_opportunity sfo on sfo.ExternalOrderId__c=co.id
LEFT JOIN raw.customer_order_details__audit_log au on au.order_id=co.id


