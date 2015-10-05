-- Name: ml.project_phone
-- Created: 2015-04-24 18:19:49
-- Updated: 2015-04-24 18:19:49

CREATE VIEW ml.project_phone AS
SELECT
co.order_id,
co.customer_id,
co.phone_date,
co.date_created AS customer_date_created,
co.total_gross_billed_amount_in_eur,
co.state,
CAST((co.date_picked IS NOT NULL
		  AND co.state_number >= 16
		  AND co.state_number != 2048)
     	 AS FLOAT) is_processed,
so.notReached__c AS not_reached,
CEILING(CAST(TIMESTAMPDIFF(SQL_TSI_HOUR, co.date_created, co.phone_date) AS FLOAT) / 24.0) AS waiting_days,
CASE WHEN state = 'Cancelled' THEN 1 ELSE 0 END AS cancelled
FROM
bi.customer_order co
JOIN views.salesforce_opportunity so ON co.order_id = so.ExternalOrderId__c
JOIN bi.customer c ON co.customer_id = c.customer_id
JOIN ml.customer_survey cs ON co.customer_id = cs.customer_id
WHERE co.date_created > '2014-07-01'
AND c.user_type = 'Real User'
AND	co.order_type = 'First Order'
AND co.payment_method != 'Pre-pay'
AND co.sales_channel IN ('userbackendWithDate', 'appWithDate', 'websiteWithoutDate', 'websiteWithDate', 'miniAppWithDate')


