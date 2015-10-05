-- Name: raw.customer_salesforce
-- Created: 2015-04-24 18:17:17
-- Updated: 2015-06-14 10:47:12

CREATE view "raw.customer_salesforce" 
AS
SELECT
	ExternalCustomerid__c as customer_id,
	Id as salesforce_customer_id,
	OwnerId as salesforce_account_owner,
	CustomerStatus__c as customer_status,
	inkasso__c as debt_collection,
	vip__c as vip_customer,
	favoritecustomer__c as favourite_customer,
	polite__c as informal,
	DuSie__c as formal_or_informal,
	Stylist_Lead__c as stylist_lead,
	Upcload__c as upcload,
	Kundenstatus__c as salesforce_account_status,
	
	/*---Finance Information
	  Buergel score is manually updated by finance once there recieved score from 3rd party company
	  Orders are process based on NegativeEntry and Negativmerkal
	---*/
	BuergelScore__c as finance_buergel_score,
	NegativeEntry__c as finance_negative_entry,
	Negativmerkmal__c as finance_negative_features,
	Vorkasse_Email_gesendet__c as prepayment_email_sent,
	MaxBasketValue__c as finace_max_basket_value,
	DifMaxneu__c as finace_basket_diff,
	
	
	/*---Customer Contact Information
	This information is updated by stylist based on customer information
	---*/
	secondtelephonnr__c as alternative_phone_number,
	phone_extension__c as phone_extension,
	nicht_erreicht_2ter_versuch__c as not_reached,
	Ergebnis_letzte_Reaktivierung_2__c as last_reactivation_result,
	Letzter_Anrufversuch_f_r_Reaktivierung__c as last_call_reactivation,
	telefonnummer_falsch__c as wrong_phone_number,
	set_customer_email_to_invalid_sf_only__c as wrong_email_address,
	
	
	/*---Unsbuscribe Newsletter/SMS---*/
	SMS_Unsubscribe__c as unsubscribe_sms,
	UnsubscribedNL__c as unsubscribe_newsletter,
	
	/*--Feedback Calls Information--*/
	Date_Last_Contact_Aggregated__c as date_last_contacted,
	Feedback_Call_Umfrage__c as feedback_call_poll,
	Zuweisung_Feedback_Call__c as feedback_caller,
	Source__c as customer_source,
	
	/*---Social Profiles---*/
	social_profil_wie_gefunden__c as social_profile,
	facebook_profil_gefunden__c as facebook_profile,
	facebook_url__c as facebook_page,
	linkedin_url__c as linkedin_page,
	xing_url__c as xing_page,
	
	
	/*---Club Member---*/
	Outfittery_Club_Typ_der_Mitgliedschaft__c as club_membership_type,
	Outfittery_Club_Mitglied__c as club_member,
	Outfittery_Club_Kundenfeedback__c as club_customer_feedback,
	Outfittery_Club_Einf_hrungskampagne__c as club_campaign_member,
	Next_Club_box__c as club_first_box,
	Outfittery_Club_Mitgliedschaft_angebot__c as club_member_offer,
	
	
	/*---customer more detailed information*/       	
	branchworkinginother__c as customer_career,
	detailsberuf__c as career_details,
	detailsprivat__c as personal_details,
	national_id_number__c as national_id,
	wife__c as married,
	girlfriend__c as girlfriend,
	kunde_betr__c as fraudulent_customer,
	betrugsverd_chtig_grund__c as fraud_reason,
		
	/*---Body Measurements
	BMI is caluclate using formula: Q_weight__c / ((Q_BodySize__c/100) ^ 2)
	---*/
	q_bodysize__c as bodysize,
	q_weight__c as weight,
	sizecheck1__c as size_check,
	JeansWidth__c as jeans_width,
	BMI__c as bmi,
	q_fittingissues__c as fitting_issues,
	
	/*---Additional Information---*/
	DataQualityScore__c as data_qualitty_score,
	left(costumerneeds__c,4000) as customer_needs,
	customerneedsmultiple__c as customer_needs_options,
	picarticleneeded__c as customer_article_needed,
	customersexpection__c as customer_expectaion,
	left(exspectationsindetail__c,4000) as customer_expectation,
	braucht_nicht_will_nicht__c as does_not_want_or_need,
	willingnesstospendoverall__c as willingness_to_spend,
	ocassionforfirstorder__c as occasion_first_order,
	
	/*--Other Information--*/
	left(furtherquestionnaireinformation__c,4000) as furtherinformation,
	occasioncommoditygroups__c as commodity_group,
	left(CommentsOperations__c,4000) as operations_comments,
	SystemModstamp as last_updated_date

FROM "salesforce.Account"


