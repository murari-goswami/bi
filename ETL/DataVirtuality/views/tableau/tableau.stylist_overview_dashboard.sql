-- Name: tableau.stylist_overview_dashboard
-- Created: 2015-04-24 18:20:44
-- Updated: 2015-07-03 12:34:46

CREATE VIEW tableau.stylist_overview_dashboard 
AS
SELECT
co.order_id,
co.customer_id,
co.stylist_id,
CASE 
	WHEN s.role = 'Fake' AND s.stylist_id != 118566682 THEN 'Fake Stylist ' || s.team
	ELSE s.first_name || ' ' || s.last_name 
END as stylist_name,
s.team as stylist_team,
s.role as stylist_role,
c.first_name || ' ' || c.last_name as customer_name,
co.order_sales_stage,
co.order_state,
co.order_state_number,
CASE 
  WHEN co.order_type like '%Follow%' THEN 'Follow-on Order'
  ELSE co.order_type
END as order_type,
co.box_type,
co.revenue_state,
co.sales_channel,
co.sales_channel_special,
co.kept_state,
co.ops_check,
co.payment_type,
co.shipping_country,
co.date_incoming,
co.date_invoiced,
co.date_phone_call as date_phone_call_current,
co.date_stylist_picked,
co.date_preview_created,
co.date_next_contact,
COALESCE(co.sales_sent, co.sales_picked) as sales_sent,
co.sales_kept,
case when co.revenue_state='Final' then co.billing_net_sales else null end as billing_net_sales,
case when co.revenue_state='Final' then co.billing_total else null end as billing_total,
co.inactive_reasons,
co.not_reached,
CASE WHEN c.phone_number is null THEN false ELSE true END as has_phone_number,
co.wrong_phone_number,
co.call_cancelled,
co.call_confirmed,
co.given_to_debt_collection,
co.new_phone_appointment,
co.calendar_full,
c.club_membership_type,
c.club_member,
cos.preview_not_liked

FROM bi.customer_order co
LEFT JOIN bi.stylist s on s.stylist_id = co.stylist_id
LEFT JOIN bi.customer c on c.customer_id = co.customer_id
LEFT JOIN raw.customer_order_salesforce cos on cos.order_id=co.order_id
WHERE co.order_state_number > 4
AND s.enabled


