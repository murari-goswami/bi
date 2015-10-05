-- Name: ml.project_cnc
-- Created: 2015-04-24 18:22:42
-- Updated: 2015-04-24 18:22:42

CREATE VIEW ml.project_cnc AS
SELECT
    co.order_id,
    co.parent_order_id,
    co.box_type,
    co.payment_type,
    co.order_type,
    co.shipping_country,
    co.billing_country,
    co.customer_id,
    co.date_phone_call,
    co.date_created AS customer_date_created,
    co.billing_total,
    CAST((co.date_stylist_picked IS NOT NULL AND co.order_state_number >= 16 AND co.order_state_number != 2048) AS FLOAT) processed,
    CAST(so.notReached__c AS INTEGER) AS not_reached,
    CAST(so.Telefonnummer_Falsch__c AS INTEGER) phone_number_incorrect,
    CAST(so.OpsCheck__c = 'OK' AS INTEGER) AS "ops_check_ok",
    CEILING(CAST(TIMESTAMPDIFF(SQL_TSI_HOUR, co.date_created, co.date_phone_call) AS FLOAT) / 24.0) AS days_until_phone_call,
    co.sales_channel,
    CASE WHEN co.sales_channel IN ('website', 'websiteWithDate') THEN 1
    ELSE 0 END AS call_possible,
    CASE WHEN co.sales_channel IN ('website', 'websiteWithoutCall') THEN 1
    ELSE 0 END AS nocall_possible
FROM
    bi.customer_order co
LEFT JOIN views.salesforce_opportunity so ON co.order_id = so.ExternalOrderId__c
WHERE co.date_created >= '2015-01-01'


