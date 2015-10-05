-- Name: tableau.billing_all_order_paid_open_amount
-- Created: 2015-04-24 18:23:10
-- Updated: 2015-07-30 17:58:46

CREATE view tableau.billing_all_order_paid_open_amount
AS
SELECT 
	co.id,
	co.customer_id,
	co.date_created,
	co.state,
	co.payment_method,
	co.payment_state,
	co.total_amount_billed_discount,
	co.date_returned,
	co.date_shipped,
	co.date_payed,
	co.invoice_date_created,
	co.invoice_number,
	co.total_amount_payed,
	co.currency_code,
	co.vat_percentage,
	co.total_amount_basket_purchase_gross,
	co.total_amount_basket_retail_gross,
	co.total_amount_billed_purchase_gross,
	co.total_amount_billed_retail_gross,
	co.shipping_city,
	co.shipping_country,
	co.shipping_street,
	co.shipping_street_number,
	co.shipping_zip,
	co.shipping_first_name,
	co.shipping_last_name,
	coalesce(amount,0) as Paid_to_Arvato__c,
	co.total_amount_billed_retail_gross-coalesce(a.open_amount,0) as Open_Ammount_Arvato__c,
	a.date_created as arvato_date_updated,
	bill.credit_card_brand,
	bill.nb_of_credit_card_entries,
	desk.nb_of_desk_cases
FROM views.customer_order co 
/*Arvato Amount*/
LEFT JOIN 
(
	SELECT 
		id,
		ordernumber,date_created,amount,
		sum(amount) over(partition by ordernumber ORDER BY date_created) as open_amount 
	FROM views.arvatopayments 
)a on co.id=a.ordernumber
/*this join gives Nb of Credit Card Entries*/
LEFT JOIN 
(
	SELECT 
		customer_id,
		credit_card_brand,
		count(distinct credit_card_number) as nb_of_credit_card_entries
	FROM views.billing_data  
	GROUP BY 1,2
) bill on bill.customer_id=co.customer_id
/*Desk Cases-All desk cases are assigned on salesforce account level*/
LEFT JOIN
(
	SELECT 
		ExternalCustomerId__c,
		count(*) as nb_of_desk_cases 
	FROM views.deskcom_cases desk
	JOIN views.salesforce_account sacct on desk.Deskcom__Account__c=sacct.Id 
	GROUP BY 1
)desk on desk.ExternalCustomerId__c=co.customer_id


