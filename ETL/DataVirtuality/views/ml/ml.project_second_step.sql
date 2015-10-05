-- Name: ml.project_second_step
-- Created: 2015-04-24 18:19:25
-- Updated: 2015-04-24 18:19:25

CREATE VIEW ml.project_second_step AS
SELECT
co.order_id,
co.customer_id,
x.phone_date,
co.date_created AS customer_date_created,
CAST((co.date_picked IS NOT NULL AND co.order_state_number >= 16 AND co.order_state_number != 2048) AS FLOAT) processed,
CAST(so.notReached__c AS INTEGER) AS not_reached,
CAST(so.Telefonnummer_Falsch__c AS INTEGER) phone_number_incorrect,
so.OpsCheck__c,
CASE WHEN x.raw_days_until_phone_call > 14 AND x.raw_days_until_phone_call <= 100 THEN 1 ELSE 0 END "phone_call_rescheduled",
CASE WHEN x.raw_days_until_phone_call > 100 THEN 1 ELSE 0 END "phone_call_cancelled"
FROM
raw.customer_order co
LEFT JOIN views.salesforce_opportunity so ON co.order_id = so.ExternalOrderId__c
LEFT JOIN (
	SELECT
	cc.order_id,
	CEILING(CAST(TIMESTAMPDIFF(SQL_TSI_HOUR, date_created, date_phone_call) AS FLOAT) / 24.0) AS raw_days_until_phone_call,
	CASE
	WHEN cc.date_phone_call > '2012-05-10'
		AND cc.date_phone_call < TIMESTAMPADD(SQL_TSI_MONTH, 2, curdate())
		AND cc.date_phone_call >= cc.date_created
		THEN cc.date_phone_call
	WHEN cod.original_phone_date > '2012-05-10'
		AND cod.original_phone_date < TIMESTAMPADD(SQL_TSI_MONTH, 2, curdate())
		AND cod.original_phone_date >= cc.date_created
		THEN cod.original_phone_date
	ELSE null
    END as phone_date
	FROM
	raw.customer_order cc
	LEFT JOIN raw.customer_order_details__audit_log cod ON cod.order_id = cc.order_id
) x ON x.order_id = co.order_id
WHERE co.date_created >= '2014-08-01'
AND co.date_created < '2014-11-01'
AND	co.order_type = 'First Order'
AND co.payment_type != 4
AND co.sales_channel IN ('userbackendWithDate', 'appWithDate', 'websiteWithoutDate', 'websiteWithDate', 'miniAppWithDate')
AND co.date_phone_call IS NOT NULL


