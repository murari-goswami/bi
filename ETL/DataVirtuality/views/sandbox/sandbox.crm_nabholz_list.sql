-- Name: sandbox.crm_nabholz_list
-- Created: 2015-09-14 11:55:00
-- Updated: 2015-09-14 17:54:29

CREATE view sandbox.crm_nabholz_list
as

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
  a.stylist_firstname as "style-experte firstname",
  a.stylist_lastname as "style-experte lastname",
  a.customer_age,
  cf.spending_budget_for_jackets_from,
  cf.spending_budget_for_jackets_to,
  cf.spending_budget_for_shoes_from,
  cf.spending_budget_for_shoes_to,
  cf.spending_budget_for_shirts_from,
  cf.spending_budget_for_shirts_to,
  cf.spending_budget_for_jeans_from,
  cf.spending_budget_for_jeans_to
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
      spending_budget_for_jackets_from,
      spending_budget_for_jackets_to,
      spending_budget_for_shoes_from,
      spending_budget_for_shoes_to,
      spending_budget_for_shirts_from,
      spending_budget_for_shirts_to,
      spending_budget_for_jeans_from,
      spending_budget_for_jeans_to
    FROM "bi.customer"
    WHERE spending_budget_for_jackets_FROM>=200
)cf on cf.customer_id=a.customer_id
LEFT JOIN
(
  SELECT
    customer_id,
    max(date_created) as last_order_date,
    sum(CASE WHEN order_state= 'Completed' THEN  articles_kept ELSE NULL END) articles_kept,
    COUNT(DISTINCT CASE WHEN order_state= 'Completed' THEN order_id ELSE NULL END) as completed_orders
  FROM bi.customer_order
  group by 1
)b on a.customer_id=b.customer_id
WHERE a.rnum = '1'
and b.articles_kept>=1
and cast(b.last_order_date as date)<=timestampadd(sql_tsi_week,-4,curdate())


