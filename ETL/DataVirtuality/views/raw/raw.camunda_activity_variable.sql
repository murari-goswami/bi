-- Name: raw.camunda_activity_variable
-- Created: 2015-08-04 16:31:04
-- Updated: 2015-08-04 16:31:04

CREATE view raw.camunda_activity_variable 
AS

SELECT 
	cast(execution_id_ as long) as execution_id,
	MAX(CASE WHEN name_='orderId' THEN cast(long_ as string) END) AS order_id,
	MAX(CASE WHEN name_='customerId' THEN cast(long_ as string) END) AS customer_id,
	MAX(CASE WHEN name_='stylistId' THEN cast(long_ as string) END) AS stylist_id,
	MAX(CASE WHEN name_='assigneeId' THEN cast(long_ as string) END) AS assignee_id,
	MAX(CASE WHEN name_='customerType' THEN cast(text_ as string) END) AS customer_type,
	MAX(CASE WHEN name_='orderType' THEN cast(text_ as string) END) AS order_type,
	MAX(CASE WHEN name_='confirmSemaforDate' THEN FROM_UNIXTIME(cast(left(long_,10) as integer)) END) AS confirm_date,
	MAX(CASE WHEN name_='reminderSemaforDate' THEN FROM_UNIXTIME(cast(left(long_,10) as integer)) END) AS reminder_date,
	MAX(CASE WHEN name_='callNowSemaforDate' THEN FROM_UNIXTIME(cast(left(long_,10) as integer)) END) AS call_now,
	MAX(CASE WHEN name_='phoneDate' THEN FROM_UNIXTIME(cast(left(long_,10) as integer)) END) AS phone_date,
	MAX(CASE WHEN name_='callNowExpiredDate' THEN FROM_UNIXTIME(cast(left(long_,10) as integer)) END) AS call_now_expired_date,
	MAX(CASE WHEN name_='rescheduleWorkOnOrderDate' THEN FROM_UNIXTIME(cast(left(long_,10) as integer)) END) AS reschedule_workon_order_date,
	MAX(CASE WHEN name_='callCounter' THEN cast(double_ as string) END) AS call_counter,
	MAX(CASE WHEN name_='callAnswered' THEN cast(long_ as string) END) AS call_answered,
	MAX(CASE WHEN name_='emailType' THEN cast(text_ as string) END) AS email_type,
	MAX(CASE WHEN name_='assignee' THEN cast(text_ as string) END) AS assignee,
	MAX(CASE WHEN name_='assigneeBackup' THEN cast(text_ as string) END) AS assignee_backup,
	MAX(CASE WHEN name_='stylistsChoice' THEN cast(text_ as string) END) AS stylists_choice,
	MAX(CASE WHEN name_='notReachedAction' THEN cast(text_ as string) END) AS not_reached_action,
	MAX(CASE WHEN name_='stylist' THEN cast(text_ as string) END) AS stylist,
	MAX(CASE WHEN name_='taskManagerConfirmation' THEN cast(text_ as string) END) AS task_manager_confirmation,
	MAX(CASE WHEN name_='customerAction' THEN cast(text_ as string) END) AS customer_action,
	MAX(CASE WHEN name_='reassignmentType' THEN cast(text_ as string) END) AS reassignment_type,
	MAX(CASE WHEN name_='taskManagerType' THEN cast(text_ as string) END) AS task_manager_type,
	MAX(CASE WHEN name_='taskManagerMessages' THEN cast(text_ as string) END) AS task_manager_messages
FROM
	camunda.act_hi_varinst
GROUP BY 1


