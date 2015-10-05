-- Name: tableau.it_activity_history
-- Created: 2015-08-04 16:33:41
-- Updated: 2015-08-04 16:33:41

CREATE VIEW tableau.it_activity_history
AS

SELECT
	ah.execution_id,
	ah.activiti_name,
	ah.activiti_type,
	ah.start_time,
	ah.end_time,
	ah.duration,
	ah.rank as activity_history_rank,
	
	av.customer_id,
	av.order_id,
	av.assignee,
	av.stylist,
	MODIFYTIMEZONE(av.confirm_date,'GMT','GMT-1') as confirm_date,
	MODIFYTIMEZONE(av.reminder_date,'GMT','GMT-1') as reminder_date,
	MODIFYTIMEZONE(av.call_now,'GMT','GMT-1') as call_now,
	MODIFYTIMEZONE(av.call_now_expired_date,'GMT','GMT-1') as call_now_expired_date,
	
	av.email_type,
	av.call_answered,
	av.customer_action,
	av.task_manager_confirmation,
	av.task_manager_type,
	
	/*Activity History*/
	aht.calculate_dates,
	aht.check_out,
	aht.customer_answered_preview_email,
	aht.enable_order_checkout,
	aht.incoming_call,
	aht.not_reach_decision,
	aht.order_processed_message,
	aht.parallel_gateway,
	aht.place_order_and_await_the_call_date,
	aht.place_order,
	aht.place_order_confirmation_event,
	aht.reschedule_work_on_order,
	aht.send_another_preview,
	aht.send_confirme_mail,
	aht.send_preview,
	aht.send_preview_email,
	aht.send_reminder_email,
	aht.send_stylist_calendar_email,
	aht.send_wrongnumber_email,
	aht.which_action,
	aht.which_date,
	aht.work_on_order,
	aht.work_on_preview,
	
	co.order_type,
	co.date_phone_call_current,
	co.order_state_number,
	co.payment_type,
	co.date_created
	
FROM raw.camunda_activiy_history ah
LEFT JOIN raw.camunda_activity_variable av ON av.execution_id=ah.execution_id
LEFT JOIN raw.camunda_history_task aht on aht.execution_id=ah.execution_id
LEFT JOIN bi.customer_order co on co.order_id=av.order_id


