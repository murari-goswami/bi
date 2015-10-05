-- Name: views.salesforce_account
-- Created: 2015-04-24 18:18:04
-- Updated: 2015-06-15 09:14:48

CREATE view views.salesforce_account
as
SELECT
	customer_id as ExternalCustomerid__c,
	salesforce_customer_id as Id,
	last_call_reactivation as Letzter_Anrufversuch_f_r_Reaktivierung__c,
	stylist_lead as Stylist_Lead__c,
	last_reactivation_result as Ergebnis_letzte_Reaktivierung_2__c,
	unsubscribe_sms as SMS_Unsubscribe__c,
	jeans_width as JeansWidth__c,
	customer_status as CustomerStatus__c,
	formal_or_informal as DuSie__c,
	unsubscribe_newsletter as UnsubscribedNL__c,
	'' as ReferralLink__c,
	bmi as BMI__c,
	club_membership_type as Outfittery_Club_Typ_der_Mitgliedschaft__c,
	club_member as Outfittery_Club_Mitglied__c,
	club_customer_feedback as Outfittery_Club_Kundenfeedback__c,
	club_member_offer as Outfittery_Club_Mitgliedschaft_angebot__c,
	last_updated_date as SystemModstamp
FROM raw.customer_salesforce


