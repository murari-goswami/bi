-- Name: raw.camunda_history_task
-- Created: 2015-08-04 16:30:14
-- Updated: 2015-08-04 16:30:14

CREATE VIEW raw.camunda_history_task
AS

SELECT
  a.execution_id,
  MIN(CASE WHEN a.activiti_name='CalculateDates' THEN a.start_time ELSE NULL END)as calculate_dates,
  MIN(CASE WHEN a.activiti_name='CallNow' THEN a.start_time ELSE NULL END)as call_now,
  MIN(CASE WHEN a.activiti_name='Checkout'THEN a.start_time ELSE NULL END)as check_out,
  MIN(CASE WHEN a.activiti_name='CustomerAnsweredPreviewEmailMessage'THEN a.start_time ELSE NULL END)as customer_answered_preview_email,
  MIN(CASE WHEN a.activiti_name='EnableOrderCheckout' THEN a.start_time ELSE NULL END)as enable_order_checkout,
  MIN(CASE WHEN a.activiti_name='IncomingCall' THEN a.start_time ELSE NULL END)as incoming_call,
  MIN(CASE WHEN a.activiti_name='NotReachDecision' THEN a.start_time ELSE NULL END)as not_reach_decision,
  MIN(CASE WHEN a.activiti_name='OrderProcessedMessage' THEN a.start_time ELSE NULL END)as order_processed_message,
  MIN(CASE WHEN a.activiti_name='Parallel Gateway' THEN a.start_time ELSE NULL END)as parallel_gateway,
  MIN(CASE WHEN a.activiti_name='Place order and await the call date' THEN a.start_time ELSE NULL END)as place_order_and_await_the_call_date,
  MIN(CASE WHEN a.activiti_name='PlaceOrder' THEN a.start_time ELSE NULL END)as place_order,
  MIN(CASE WHEN a.activiti_name='PlaceOrderConfirmationEvent' THEN a.start_time ELSE NULL END)as place_order_confirmation_event,
  MIN(CASE WHEN a.activiti_name='RescheduleWorkOnOrder' THEN a.start_time ELSE NULL END)as reschedule_work_on_order,
  MIN(CASE WHEN a.activiti_name='SendAnotherPreview' THEN a.start_time ELSE NULL END)as send_another_preview,
  MIN(CASE WHEN a.activiti_name='SendConfirmEmail' THEN a.start_time ELSE NULL END)as send_confirme_mail,
  MIN(CASE WHEN a.activiti_name='SendPreview' THEN a.start_time ELSE NULL END)as send_preview,
  MIN(CASE WHEN a.activiti_name='SendPreviewEmail' THEN a.start_time ELSE NULL END)as send_preview_email,
  MIN(CASE WHEN a.activiti_name='SendReminderEmail' THEN a.start_time ELSE NULL END)as send_reminder_email,
  MIN(CASE WHEN a.activiti_name='SendStylistCalendarEmail' THEN a.start_time ELSE NULL END)as send_stylist_calendar_email,
  MIN(CASE WHEN a.activiti_name='SendWrongNumberEmail' THEN a.start_time ELSE NULL END)as send_wrongnumber_email,
  MIN(CASE WHEN a.activiti_name='WhichAction' THEN a.start_time ELSE NULL END)as which_action,
  MIN(CASE WHEN a.activiti_name='WhichDate' THEN a.start_time ELSE NULL END)as which_date,
  MIN(CASE WHEN a.activiti_name='WorkOnOrder' THEN a.start_time ELSE NULL END)as work_on_order,
  MIN(CASE WHEN a.activiti_name='WorkOnPreview' THEN a.start_time ELSE NULL END)as work_on_preview
FROM raw.camunda_activiy_history a
GROUP BY 1


