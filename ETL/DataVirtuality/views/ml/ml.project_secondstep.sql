-- Name: ml.project_secondstep
-- Created: 2015-04-24 18:19:52
-- Updated: 2015-04-24 18:19:52

CREATE VIEW ml.project_secondstep AS 
SELECT
co.order_id,
co.customer_id,
co.date_phone_call,
co.date_created AS customer_date_created,
co.billing_total,
CAST((co.date_stylist_picked IS NOT NULL AND co.order_state_number >= 16 AND co.order_state_number != 2048) AS FLOAT) processed,
CAST(so.notReached__c AS INTEGER) AS not_reached,
CAST(so.Telefonnummer_Falsch__c AS INTEGER) phone_number_incorrect,
CAST(so.OpsCheck__c = 'OK' AS INTEGER) AS "ops_check_ok",
CEILING(CAST(TIMESTAMPDIFF(SQL_TSI_HOUR, co.date_created, co.date_phone_call) AS FLOAT) / 24.0) AS days_until_phone_call
FROM
bi.customer_order co
LEFT JOIN views.salesforce_opportunity so ON co.order_id = so.ExternalOrderId__c
WHERE co.date_created >= '2014-08-01'
AND co.date_created < '2014-11-01'
AND	co.order_type = 'First Order'
AND co.payment_type != 4
AND co.sales_channel IN ('userbackendWithDate', 'appWithDate', 'websiteWithoutDate', 'websiteWithDate', 'miniAppWithDate')


