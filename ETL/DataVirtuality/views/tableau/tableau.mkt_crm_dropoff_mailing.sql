-- Name: tableau.mkt_crm_dropoff_mailing
-- Created: 2015-07-13 15:43:52
-- Updated: 2015-08-25 16:52:12

CREATE VIEW tableau.mkt_crm_dropoff_mailing
AS

SELECT 
    cu.email,
    cu.date_created,
    CASE WHEN cu.gender = 'Male' THEN 'Herr' ELSE 'Frau' END as anrede,
    cu.formal as firstnamebasis,
	case
		when cu.gender= 'Male' THEN 'Lieber'
		when cu.gender= 'Female' THEN 'Liebe'
	end AS "begruessung",
    cu.first_name,
    cu.last_name,
    cu.phone_number,
    cu.customer_age,
    cu.default_domain as "UTM Country",
    LOWER(cu.default_domain) as "country inital",
    cu.subscribe_status,
    cu.subscribed_to_sms,
    cu.customer_id,
    cu.date_of_birth,
    st.first_name as stylist_firstname,
    st.last_name as stylist_lastname,
    st.stylist,
    cu.token,
    cu.club_member,
    cu.club_membership_type,
    cu.date_first_club_box,
    cs.date_last_contacted,
    cr.marketing_cluster as brandcluster,
    co.orders_created,
    co.last_delivery_date,
    no_call_funnel_dropoffs,
    website_funnel_dropoffs  
FROM bi.customer cu
LEFT JOIN
(
    SELECT
	    customer_id,
	    MAX(date_invoiced) as last_delivery_date,
	    COUNT(order_id) as orders_created,
	    SUM(CASE WHEN sales_channel = 'websiteWithoutDateAndPendingConfirmation' THEN 1 ELSE 0 END) AS no_call_funnel_dropoffs,
	    SUM(CASE WHEN sales_channel = 'website' THEN 1 ELSE 0 END) AS website_funnel_dropoffs,
	    SUM(CASE WHEN date_created is not null THEN 1 ELSE null END) AS invoiced_orders
    FROM bi.customer_order
    WHERE is_real_order='Real Order'
    GROUP BY 1
)co ON co.customer_id = cu.customer_id
LEFT JOIN raw.customer_salesforce cs on cs.customer_id=co.customer_id 
LEFT JOIN bi.stylist st on st.stylist_id=cu.new_stylist_id
LEFT JOIN raw.customer_brand_cluster cr on cr.customer_id = co.customer_id
WHERE cu.subscribe_status != 'Unsubscribed' 
AND cu.email not like '%invalid%'


