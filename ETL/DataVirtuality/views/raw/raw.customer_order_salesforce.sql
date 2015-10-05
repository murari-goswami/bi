-- Name: raw.customer_order_salesforce
-- Created: 2015-04-24 18:17:21
-- Updated: 2015-09-13 12:22:47

CREATE VIEW raw.customer_order_salesforce
AS
SELECT

  ExternalOrderId__c as order_id,
  Id as salesforce_order_id,
  OwnerId as salesforce_owner,
  StageName as salesforce_order_stage,
  OrderType__c as salesforce_order_type,
  ContactOver__c as contact_type,

  /*Call Information*/
  Kalender_war_geblockt__c as calender_full,
  CallConfirmed__c as call_confirmed,
  kunde_hat_termin_abgesagt__c as call_cancelled,
  Neuer_Termin_f_r_erreicht__c as new_phone_appointment,
  Anrufversuche__c as nb_of_call_attempts,
  notReached__c as not_reached,
  Telefonnummer_Falsch__c as wrong_phone_number,
  threeTimesNotReached__c as nb_of_times_not_reached,
  Number_of_calls_made__c as nb_of_reactivation_calls_made,

  /*Finance Check-All OPS columns are formula field in salesforce (check finance document)
    for formulas*/
  PaymentCheck__c as payment_check,
  Prepay_requirement_currency__c as pre_pay_requrirement,
  Vorkasse_Email_sent__c as prepayment_email_sent,
  Score_Empfehlung__c as score_recommendation,
  /*Finace Check*/
  Ops_Check_B__c as ops_check_b,
  Ops_Check_A__c as ops_check_a,
  Ops_Check_C__c as ops_check_c,
  OpsAction__c as ops_action,
  OpsCheck__c as ops_check,
  Finance_check__c as finance_check,
  Finance_Ops_Check_test__c as finance_ops_check,
  Inkasso__c as debt_collection_set,
  
  /* OPS/CS information*/
  CS_hat_informiert_Finance__c as cs_informed_finance,
  Finance_to_CSset__c as finance_to_cs_set,
  Finance_to_CS__c as finance_to_cs,
  Ops_Check_ausstehende_Orders__c as ops_outstanding_order,
  CommentsOperations__c as ops_comments,
  OpsCommentRead__c as ops_comments_read,

  /*DHL Information-dhl link and dhl return link is updated from doc_data_manifest shipping and kettle jobs,
    return next steps is updated by operations or stylist*/
  Box_erneut_versendet_storniert__c as box_resent_cancelled,
  DHL_Link__c as dhl_link,
  DHLReturnLink__c as dhl_return_link,
  DHLReturnNextSteps__c as dhl_return_next_steps,
  Neue_Adresse_R_ckl_ufer__c as new_return_address,
  DHL_Status__c as dhl_status,
  Abholauftrag__c as pick_up_order,
  Refusals_comment__c as refusual_comment,

  /*All Dates*/
  DateFirstOrder__c as date_first_order,
  DateNextContact__c as date_next_contact,
  PreviewDate__c as preview_date,
  Date_Vorkasse_Email_sent__c as date_prepayment,
  DateOpsCheckSet__c as date_ops_check,
  DateFeedback__c as date_feedback,
  Datum_Feedback_Call__c as date_feedback_call,
  Datum_Inkasso_gesetzt__c as date_debt_collection,
  InkassoComments__c as debt_collection_comments,
  R_ckl_ufer_erneut_versenden_am__c as date_return_resend,
  Latest_Call_Attempt__c as date_last_reactivation_call_order,
                                                SystemModstamp as last_updated_date,

  /*Arvato Checks
    NOTE: NewCardRecommendation is sometimes updated by finance*/
  ArvatoYorN__c as arvato_y_n,
  arvatoStatus__c as arvato_status,
  NewCardrecommendation__c as newcardrecommendation,
  Max_Warenkorbempfehlung_Arvato__c as max_basket_arvato,

  /*Preview Information*/
  DislikedPreview__c as preview_not_liked,
  SentPreview__c as preview_sent,

  /*Sales Channel*/
  SalesChannel__c as sales_channel,
  SalesChannel_Special__c as saleschannel_special,
  TextOrderConfirmation__c as order_confirmation_sent,
  On_Hold_Grund__c as onhold_reason,
  InactiveReason__c as inactive_reasons,
  FirstOrder__c as first_order,
  CS_Reason__c as customer_support_reason,
  NL_Ghost_Stylist__c as nl_ghost_stylist,
  NoCall_Box__c as no_call_box,
  Keine_Nachbestellung__c as no_repeat,

  /*Arvato Payment Information-These fields are updated by BI using arvato's xml file*/
  Paid_to_Arvato__c as paid_arvato_amount,
  Open_Ammount_Arvato__c as open_arvato_amount,
  Arvato_Payment_Confirmation_Sent__c as arvato_confrimation_sent,

  /*Feedback Information*/
  Feedback_Status__c as feedback_status,
  Feedback_Caller_ID__c as feedback_caller_id,
  FeedbackDate__c as feedback_date,
  Kunde_m_chte_Feedback_Call_Termin__c as feedback_appointment,
  FeedbackCallNotReached__c as feedback_not_reached,
  FeedbackDataQualityScore__c as feedback_data_quality_score,
  DontSentFeedbackMail__c as feedback_mail_dont_sent,

  /*Other Information*/
  ReturnRate__c as return_rate,
  NPS__c as nps_score,
  FriendsNames__c as friends_names,
  Upcload_tested__c as upcload_tested,
  VoucherCode__c as voucher_code,
  WeDidNotForgetYou__c as didnot_forgot,

  /*Customer Feedback Information*/
  DontSentFeedbackMail__c as feedback_mail_not_sent,
  LEFT(generalFeedback__c,4000) as customers_feedback,
  FurtherCustomerInformation__c as futher_cust_information

FROM "salesforce.Opportunity"


