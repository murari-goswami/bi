-- Name: views.salesforce_opportunity
-- Created: 2015-04-24 18:18:06
-- Updated: 2015-04-24 18:18:06

CREATE view views.salesforce_opportunity
AS
SELECT
	order_id as ExternalOrderId__c,
	salesforce_order_stage as StageName,
	salesforce_order_id as Id,
	prepayment_email_sent as Vorkasse_Email_sent__c,
	not_reached as notReached__c,
	sales_channel as SalesChannel__c,
	call_confirmed as CallConfirmed__c,
	no_call_box as NoCall_Box__c,
	ops_check as OpsCheck__c,
	date_first_order as DateFirstOrder__c,
	inactive_reasons as InactiveReason__c,
	customer_support_reason as CS_Reason__c,
	first_order as FirstOrder__c,
	'' as Facebook_Campaign__c,
	arvato_confrimation_sent as Arvato_Payment_Confirmation_Sent__c,
	open_arvato_amount as Open_Ammount_Arvato__c,
	paid_arvato_amount as Paid_to_Arvato__c,
	calender_full as Kalender_war_geblockt__c,
	upcload_tested as Upcload_tested__c,
	voucher_code as VoucherCode__c,
	dhl_link as DHL_Link__c,
	dhl_return_link as DHLReturnLink__c,
	salesforce_order_type as OrderType__c,
	return_rate as ReturnRate__c,
	newcardrecommendation as NewCardrecommendation__c,
	max_basket_arvato as Max_Warenkorbempfehlung_Arvato__c,
	arvato_status as arvatoStatus__c,
	arvato_y_n as ArvatoYorN__c,
	finance_check as Finance_check__c,
	saleschannel_special as SalesChannel_Special__c,
	nl_ghost_stylist as NL_Ghost_Stylist__c,
	wrong_phone_number as Telefonnummer_Falsch__c,
	'' as DHLPickupLink__c,
	'' as DHL_Status__c,
	dhl_return_next_steps as DHLReturnNextSteps__c,
	nps_score as NPS__c,
	debt_collection_set as Inkasso__c,
	refusual_comment as Refusals_comment__c,
	last_updated_date as SystemModstamp
FROM raw.customer_order_salesforce


