-- Name: sandbox.customer_order_date_incoming_check
-- Created: 2015-09-14 18:01:04
-- Updated: 2015-09-16 09:32:41

CREATE VIEW sandbox.customer_order_date_incoming_check
AS

WITH c_order AS
(
	SELECT 
  		co.order_id, 
	  	co.date_created,
  		CASE
  		/* Orders with sales_channel = 'website' and websiteWithoutDateAndPendingConfirmation are not real orders, hence exclude date_created should be set to null */ 
    		WHEN (co.sales_channel = 'website' AND co.order_state in ('Incoming', 'Cancelled') AND NOT (co.date_preview_created is not null OR cu.phone_number is not   null))
    		OR co.sales_channel = 'websiteWithoutDateAndPendingConfirmation' THEN null
    		WHEN co.sales_channel = 'website' AND co.date_preview_created > co.date_created THEN co.date_preview_created
    		WHEN CAST(co.date_created as date)<'2015-07-21' THEN COALESCE(cod.date_incoming, co.date_created)
    	/*Because of task manager job all old orders in state 4 is changed to 8*/
    		WHEN CAST(co.date_created as date)>='2015-07-21' THEN COALESCE(cod.date_incoming,date_incoming_no_call)
  		END date_incoming,
    	CASE
  		/* Orders with sales_channel = 'website' and websiteWithoutDateAndPendingConfirmation are not real orders, hence exclude date_created should be set to null */ 
    		WHEN (co.sales_channel = 'website' AND co.order_state in ('Incoming', 'Cancelled') AND NOT (co.date_preview_created is not null OR cu.phone_number is not   null))
    		OR co.sales_channel = 'websiteWithoutDateAndPendingConfirmation' THEN null
    		WHEN co.sales_channel = 'website' AND co.date_preview_created > co.date_created THEN co.date_preview_created
    		WHEN CAST(co.date_created as date)<'2015-07-21' THEN COALESCE(cod.date_incoming, co.date_created)
    		/*Because of task manager job all old orders in state 4 is changed to 8*/
    		WHEN CAST(co.date_created as date)>='2015-07-21' THEN co.date_created
  		END date_incoming_old
FROM raw.customer_order co 
LEFT JOIN raw.customer cu on cu.customer_id = co.customer_id 
LEFT JOIN raw.customer_order_details__audit_log cod on cod.order_id = co.order_id 
WHERE CAST(co.date_created as date)>=timestampadd(sql_tsi_month,-4,curdate())
)
SELECT
	ca."date",
	a.incoming_orders_new,
	incoming_orders_old
FROM "dwh.calendar" ca
JOIN
(
	SELECT
		CAST(date_incoming_old AS DATE) AS date_incoming_old,
		COUNT(DISTINCT order_id) as incoming_orders_old
	FROM c_order
	GROUP BY 1
)b ON ca."date"=b.date_incoming_old
JOIN
(
	SELECT
		CAST(date_incoming AS DATE) AS date_incoming_new,
		COUNT(DISTINCT order_id) as incoming_orders_new
	FROM c_order
	GROUP BY 1
)a ON ca."date"=a.date_incoming_new


