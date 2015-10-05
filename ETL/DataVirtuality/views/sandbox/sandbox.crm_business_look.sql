-- Name: sandbox.crm_business_look
-- Created: 2015-09-21 12:24:39
-- Updated: 2015-09-21 12:46:29

CREATE view sandbox.crm_business_look
AS

SELECT
  a.customer_id,
  a.email,
  a.begruessung,
  a.anrede,
  a.du_sie as firstnamebasis,
  a.first_name as Vorname,
  a.last_name as Nachname,
  a.default_page as "UTM Country",
  lower(a.default_page) as "country inital",
  b.completed_orders,
  b.articles_kept,
  ROUND(b.avg_billing_total,2) as avg_billing_total,
  a.stylist_firstname as "style-experte firstname",
  a.stylist_lastname as "style-experte lastname",
  a.token,
  a.customer_age,
  b.last_order_date,
  cs.work_style_suit,
  cs.work_style_smart_casual,
  cs.work_style_conservative
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
    cu.customer_age,
    cu.default_domain as default_page,
    cu.customer_id,
    st.first_name as stylist_firstname,
    st.last_name as stylist_lastname,
    cu.token
  FROM bi.customer_order co
  JOIN bi.customer cu on cu.customer_id=co.customer_id and cu.subscribe_status != 'Unsubscribed' AND cu.email not like '%invalid%' and cu.club_member='false'
  LEFT JOIN raw.customer_salesforce cs on cs.customer_id=co.customer_id 
  LEFT JOIN bi.stylist st on st.stylist_id=cu.new_stylist_id
  LEFT JOIN raw.customer_brand_cluster cr on cr.customer_id = co.customer_id
  WHERE
  cu.gender= 'Male'
  and co.shipping_country in ('DE','AT','CH','LU')
  AND co.order_state='Completed'
  AND co.date_given_to_debt_collection IS NULL
)a
JOIN
(
SELECT 
  customer_id,
  COALESCE(work_style__suit,old_work_style__suit,0) AS work_style_suit,
  COALESCE(work_style__smart_casual,old_work_style__smart_casual,0) AS work_style_smart_casual,
  COALESCE(work_style__conservative,0) as work_style_conservative
FROM raw.customer_survey
WHERE
COALESCE(work_style__suit,old_work_style__suit)=1
OR
COALESCE(work_style__smart_casual,old_work_style__smart_casual)=1
OR
work_style__conservative=1
)cs on cs.customer_id=a.customer_id
LEFT JOIN
(
  SELECT
    customer_id,
    max(date_created) as last_order_date,
    sum(CASE WHEN order_state= 'Completed' THEN  articles_kept ELSE NULL END) articles_kept,
    COUNT(DISTINCT CASE WHEN order_state= 'Completed' THEN order_id ELSE NULL END) as completed_orders,
    SUM(CASE WHEN order_state= 'Completed' THEN billing_total ELSE NULL END) /COUNT(DISTINCT CASE WHEN order_state= 'Completed' THEN order_id ELSE NULL END) as avg_billing_total
  FROM bi.customer_order
  group by 1
)b on a.customer_id=b.customer_id
WHERE a.rnum = '1'
and b.articles_kept>=1
and cast(b.last_order_date as date)<=timestampadd(sql_tsi_week,-4,curdate())


