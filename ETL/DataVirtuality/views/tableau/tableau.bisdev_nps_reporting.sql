-- Name: tableau.bisdev_nps_reporting
-- Created: 2015-04-29 11:13:22
-- Updated: 2015-04-29 11:13:22

CREATE VIEW tableau.bisdev_nps_reporting
AS

SELECT 
co.order_id,
co.nps_score,
co.customer_id,
co.date_created,
co.date_shipped,
co.date_nps_submitted,
co.order_state_number,
co.payment_type,
co.sales_channel,
co.date_phone_call_current as phone_date,
co.shipping_city,
co.shipping_country,
co.order_type,
co.articles_kept,
co.articles_returned,
co.sales_kept,
co.sales_returned,
sf.salesforce_order_stage,
cu.customer_age,
/*Stylist Info*/
sty.stylist,
sty.team as user_role,
sty.profile_name,
ta.feedback_count

FROM bi.customer_order co
LEFT JOIN bi.customer_order_salesforce sf on co.order_id=sf.order_id
LEFT JOIN bi.stylist sty on co.stylist_id = sty.stylist_id
LEFT JOIN bi.customer cu on cu.customer_id=co.customer_id
/*Number of emails sent can be found salesforce task, 
 if the subject is 'Email: Feedback mit Mail' or 'Freunde empfehlen - DU' then nps_mail is sent,
 there is no way to find exact emails sent in salesforce*/
left join
(
	SELECT 
	st.opportunity_id,
	count(distinct st.opportunity_id) as feedback_count 
	FROM views.salesforce_task st
	group by 1
) ta on ta.opportunity_id=sf.salesforce_order_id


