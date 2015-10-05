-- Name: tableau.finance_salesforce_reporting
-- Created: 2015-04-24 18:27:03
-- Updated: 2015-08-07 10:48:12

CREATE view tableau.finance_salesforce_reporting
AS
SELECT
  co.order_id,
  co.customer_id,
  co.shipping_street,
  co.shipping_zip,
  co.shipping_city,
  co.payment_type,
  co.shipping_country,
  co.date_created,
  co.sales_channel,
  co.date_phone_call_current,
  co.order_state_number,
  co.order_type,
  co.date_paid,
  co.billing_received,
  co.is_real_order,
  co.billing_received*co.exchange_rate as total_amount_paid,
  co.sales_sent*co.exchange_rate as total_amount_basket_retail_gross,
  co.date_phone_call,
  /*customer details*/
  cu.national_id,
  cu.first_name,
  cu.last_name,
  cu.date_of_birth,
  /*Salesforce Account Fields*/
  sa.salesforce_customer_id,
  sa.finance_negative_entry,
  sa.finance_negative_features,
  sa.finance_buergel_score,
  sa.vip_customer,
  /*Salesforce Opportunities fields*/
  so.salesforce_order_stage,
  so.ops_check,
  so.max_basket_arvato,
  so.newcardrecommendation,
  /*Financial Transaction*/
  ao.status,
  ao.arvatoresult,
  ao.arvatoscore,
  ao.max_valuation
FROM bi.customer_order co
LEFT JOIN bi.customer cu on co.customer_id=cu.customer_id
LEFT JOIN views.additional_order_information ao on ao.order_id=co.order_id
LEFT JOIN raw.customer_salesforce sa on sa.customer_id=co.customer_id
LEFT JOIN raw.customer_order_salesforce so on so.order_id=co.order_id
WHERE co.order_state_number not in (4,2048)


