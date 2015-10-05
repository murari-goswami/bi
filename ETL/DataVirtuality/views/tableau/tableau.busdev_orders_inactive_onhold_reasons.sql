-- Name: tableau.busdev_orders_inactive_onhold_reasons
-- Created: 2015-04-24 18:22:41
-- Updated: 2015-04-24 18:22:41

create view tableau.busdev_orders_inactive_onhold_reasons
AS

SELECT 
co.order_id,
co.shipping_first_name,
co.shipping_last_name,
co.customer_id,
co.date_created,
co.date_cancelled,
co.order_type,
co.order_state,
co.sales_channel,
co.box_type,
cso.inactive_reasons,
cso.salesforce_order_stage,
cso.salesforce_order_type
FROM bi.customer_order co
LEFT JOIN bi.customer_order_salesforce cso on cso.order_id=co.order_id


