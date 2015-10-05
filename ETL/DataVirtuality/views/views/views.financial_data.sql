-- Name: views.financial_data
-- Created: 2015-04-24 18:23:03
-- Updated: 2015-08-07 11:01:05

CREATE view "views.financial_data" 
as
select 
	/*Financial Transaction*/
	fds.order_id,
	fds.customer_id,
	fds.response_code,
	fds.provider_transaction_id,
	fds.valuation,
	fds.date_created as fd_date_created,
	fds.status,
	/*Financial Transaction details*/
	fds.arvato_type as arvatotype,
	fds.arvato_order_limit as arvatoorderlimit,
	fds.arvato_result as arvatoresult,
	fds.arvato_score as arvatoscore,
	/*Customer Order*/
	co.date_created as customer_order_date_created,
	null as customer_order_last_updated,
	co.state as customer_order_state,
	co.payment_method as customer_order_payment_method,
	co.payment_state as customer_order_payment_state,
	co.total_amount_basket_purchase_gross as customer_order_total_amount_basket_purchase_gross,
	co.total_amount_basket_retail_gross as customer_order_total_amount_basket_retail_gross,
	co.total_amount_billed_discount as customer_order_total_amount_billed_discount,
	co.total_amount_billed_purchase_gross as customer_order_total_amount_billed_purchase_gross,
	co.total_amount_billed_retail_gross as customer_order_total_amount_billed_retail_gross,
	co.parent_order_id as customer_order_parent_order_id,
	co.date_billed as customer_order_date_billed,
	co.date_payed as customer_order_date_payed,
	co.date_returned as customer_order_date_returned,
	co.date_shipped as customer_order_date_shipped,
	co.sales_channel as customer_order_sales_channel,
	co.currency_code as customer_order_currency_code,
	co.shipping_city,
	co.shipping_country,
	co.order_type,
	/*Arvato Results*/
	ar.arvatoresult_1,
	ar.arvatoresult_2,
	ar.arvatoresult_3,
	/*Response Code*/
	ar.responseCode_1,
	ar.responseCode_2,
	ar.responseCode_3,
	/*Arvato Order limt*/
	ar.arvatoorderlimit1,
	ar.arvatoorderlimit2,
	ar.arvatoorderlimit3,
	/*Valuation*/
	ar.valuation1,
	ar.valuation2,
	ar.valuation3,
	/*Request Body*/
	ar.requestbody_1,
	ar.requestbody_2,
	ar.requestbody_3,
	/*Provider Transaction Id*/
	ar.provider_transaction_id1,
	ar.provider_transaction_id2,
	ar.provider_transaction_id3,
	ar.avg_arvatoorderlimit,
	ar.max_valuation,
	sinfo.Max_Warenkorbempfehlung_Arvato__c as "sf_Max_Warenkorbempfehlung_Arvato__c",
	sinfo.NewCardrecommendation__c as "sf_NewCardrecommendation__c",
	sinfo.arvatoStatus__c as "sf_arvatoStatus__c",
	sinfo.ArvatoYorN__c as "sf_ArvatoYorN__c",
	sty."Name" as "stylist",
	cast(sinfo.NewCardrecommendation__c-co.total_amount_basket_retail_gross as float) as "diff_basket_values"
from
(
	select * from 
	(
		SELECT
		f.*,
		row_number() over(partition by order_id order by date_created desc) as rank
		FROM raw.financial_transactions f
	)fd where rank=1
)fds
left JOIN views.customer_order co on co.id=fds.order_id
left join views.arvatoresults ar on ar.order_id=fds.order_id
left join views.salesforce_opportunity sinfo on sinfo.ExternalOrderId__c=fds.order_id
left join views.stylist sty on co.stylelist_id = sty.stylist_id


