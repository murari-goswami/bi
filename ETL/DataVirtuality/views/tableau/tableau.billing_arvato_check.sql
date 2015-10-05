-- Name: tableau.billing_arvato_check
-- Created: 2015-04-30 14:21:53
-- Updated: 2015-07-30 17:58:58

CREATE VIEW tableau.billing_arvato_check
AS

SELECT
co.order_id,
co.customer_id,
co.date_created,
co.order_type,
co.shipping_country,
co.date_shipped,
co.payment_type,
co.arvato_score as arvatoscore,
co.order_state_number as state,
co.sales_sent as total_amount_basket_retail_gross,
co.billing_total as total_amount_billed_retail_gross,
co.billing_received as total_amount_paid,

/*Arvato Results (will be replaced to bi tables*/
arv.responseCode_1,
arv.responseCode_2,
arv.responseCode_3,
arv.arvatoresult_1,
arv.arvatoresult_2,
arv.arvatoresult_3,
arv.arvatoorderlimit1,
arv.arvatoorderlimit2,
arv.arvatoorderlimit3,
arv.valuation1,

cos.newcardrecommendation as sf_NewCardrecommendation__c,
cos.max_basket_arvato as sf_Max_Warenkorbempfehlung_Arvato__c

FROM bi.customer_order co 
LEFT JOIN views.arvatoresults arv on co.order_id=arv.order_id
LEFT JOIN bi.customer_order_salesforce cos on cos.order_id=arv.order_id


