-- Name: views.additional_order_information
-- Created: 2015-04-24 18:25:39
-- Updated: 2015-05-13 17:57:28

CREATE view views.additional_order_information
as

SELECT 
	co.order_id,
	co.date_created as customer_order_date_created,
	co.customer_id,
	/*Financial Transaction*/
	fd.fd_date_created as date_created,
	fd.response_code,
	fd.valuation,
	fd."status",
	/*Financial Transaction Details*/
	fd.arvatotype,
	fd.arvatoorderlimit,
	fd.arvatoresult,
	fd.arvatoscore,
	fd.max_valuation,
	/*Arvato result*/
	ar.arvatoresult_1,
	ar.arvatoresult_2,
	ar.arvatoresult_3,
	/*Response Code*/
	ar.responseCode_1,
	ar.responseCode_2,
	ar.responseCode_3,
	/*Request Code*/
	ar.requestbody_1,
	ar.requestbody_2,
	ar.requestbody_3,
	/*Order Limit*/
	ar.arvatoorderlimit1,
	ar.arvatoorderlimit2,
	ar.arvatoorderlimit3,
	/*Provider Transaction ID*/
	ar.provider_transaction_id1,
	ar.provider_transaction_id2,
	ar.provider_transaction_id3,
	/*Valuation*/
	ar.valuation1,
	ar.valuation2,
	ar.valuation3,
	ar.avg_arvatoorderlimit,
	/*NPS Score*/
	co.nps_score as nps__c,
	co.nps_customer_comment as nps_weitere_infos__c,
	co.date_nps_submitted as date_submitted,
	stask.feedback_count,
	/*Marketing App Details*/
	ma.campaign as app_campaign,
	ma.marketing_channel as app_marketing_channel,
	ma.first_channel as app_first_channel,
	ma.nb_of_installs as nb_of_app_installs,
	ma.costs as app_campaign_costs
FROM bi.customer_order co
LEFT JOIN views.arvatoresults ar ON ar.order_id=co.order_id
LEFT JOIN views.financial_data fd on fd.order_id=co.order_id
/*Nb of Answers Recieved*/
LEFT JOIN
(
	SELECT 
		ExternalOrderId__c,
		feedback_count 
	FROM views.salesforce_opportunity soppo 
	INNER JOIN
	(
		SELECT 
			opportunity_id,
			count(distinct opportunity_id) as feedback_count 
		FROM views.salesforce_task
		GROUP BY 1
	)stask ON stask.opportunity_id=soppo.Id
)stask ON stask.ExternalOrderId__c=co.order_id
LEFT JOIN views.marketing_apptracking ma on ma.order_id=co.order_id


