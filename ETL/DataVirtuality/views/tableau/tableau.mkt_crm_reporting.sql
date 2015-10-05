-- Name: tableau.mkt_crm_reporting
-- Created: 2015-04-24 18:24:27
-- Updated: 2015-08-25 15:24:08

CREATE VIEW tableau.mkt_crm_reporting
AS

SELECT
  a.customer_id,
  a.email,
  a.begruessung,
  a.anrede,
  a.du_sie as firstnamebasis,
  a.first_name as Vorname,
  a.last_name as Nachname,
  a.customer_age,
  a.default_page as "UTM Country",
  lower(a.default_page) as "country inital",
  a.default_page,
  a.shipping_country,
  a.subscribe_status,
  b.completed_orders,
  b.articles_kept,
  b.billing_total,
  b.billing_recieved_total,
  a.date_of_birth,
  b.avg_billing_total,
  a.stylist_firstname as "style-experte firstname",
  a.stylist_lastname as "style-experte lastname",
  a.stylist,
  a.token,
  a.brandcluster,
  a.phone_number,
  a.club_member,
  a.shipping_street,
  a.shipping_street_number,
  a.shipping_zip,
  a.shipping_first_name,
  a.shipping_last_name,
  a.shipping_co,
  a.shipping_city,
  a.subscribed_to_sms,
  a.club_membership_type,
  a.date_first_club_box,
  a.date_last_contacted,
  a.sales_channel as sales_channel_first_order,
  ld.first_order_date,
  ld.last_delivery_date,
  ld.last_order_date,
  case 
  	when cast(ld.last_order_date as date)>=timestampadd(sql_tsi_week,-4,curdate()) then '4 Weeks'
  	when cast(ld.last_order_date as date)>=timestampadd(sql_tsi_week,-6,curdate()) then '6 Weeks' 
  	when cast(ld.last_order_date as date)>=timestampadd(sql_tsi_week,-8,curdate()) then '8 Weeks'
  end as last_order_created,
  is_real_order
FROM
(
  SELECT 
    row_number() over (partition by co.customer_id order by co.date_created desc) AS "rnum",
    cu.email,
    CASE WHEN cu.gender = 'Male' THEN 'Herr' ELSE 'Frau' END as anrede,
	case
		when cu.gender= 'Male' THEN 'Lieber'
		when cu.gender= 'Female' THEN 'Liebe'
	end AS "begruessung",
	cu.formal as du_sie,
    cu.first_name,
    cu.last_name,
    cu.phone_number,
    co.shipping_country,
    co.shipping_street,
    co.shipping_street_number,
    co.shipping_zip,
    co.shipping_first_name,
    co.shipping_last_name,
    co.shipping_co,
    co.shipping_city,
    co.sales_channel,
    co.is_real_order,
    cu.customer_age,
    cu.default_domain as default_page,
    cu.subscribe_status,
    cu.customer_id,
    cu.subscribed_to_sms,
    cu.date_of_birth,
    st.first_name as stylist_firstname,
    st.last_name as stylist_lastname,
    st.stylist,
    cu.token,
    cu.club_member,
    cu.club_membership_type,
    cu.date_first_club_box,
    cs.date_last_contacted,
    cr.marketing_cluster as brandcluster
  FROM bi.customer_order co
  JOIN bi.customer cu on cu.customer_id=co.customer_id and cu.subscribe_status != 'Unsubscribed' AND cu.email not like '%invalid%'
  LEFT JOIN raw.customer_salesforce cs on cs.customer_id=co.customer_id 
  LEFT JOIN bi.stylist st on st.stylist_id=cu.new_stylist_id
  LEFT JOIN raw.customer_brand_cluster cr on cr.customer_id = co.customer_id
  WHERE
   co.order_state='Completed'
  AND co.date_given_to_debt_collection IS NULL
)a
LEFT JOIN
(
	SELECT 
		customer_id,
		min(date_created) as first_order_date,
		max(date_created) as last_order_date,
		max(date_shipped) as last_delivery_date
  	FROM bi.customer_order
  	GROUP BY 1
)ld on ld.customer_id=a.customer_id
LEFT JOIN
(
  SELECT
    customer_id,
    sum(articles_kept) articles_kept,
    COUNT(DISTINCT CASE WHEN order_state= 'Completed' THEN order_id ELSE NULL END) as completed_orders,
    SUM(CASE WHEN order_state= 'Completed' THEN billing_total ELSE NULL END) as billing_total,
    SUM(CASE WHEN order_state= 'Completed' THEN billing_total ELSE NULL END) /COUNT(DISTINCT CASE WHEN order_state= 'Completed' THEN order_id ELSE NULL END) as avg_billing_total,
    SUM(CASE WHEN order_state= 'Completed' THEN billing_received ELSE NULL END) as billing_recieved_total
  FROM bi.customer_order
  WHERE order_state= 'Completed'
  group by 1
)b on a.customer_id=b.customer_id
WHERE a.rnum = '1'


