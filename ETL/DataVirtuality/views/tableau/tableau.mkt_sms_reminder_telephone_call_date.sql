-- Name: tableau.mkt_sms_reminder_telephone_call_date
-- Created: 2015-04-24 18:20:30
-- Updated: 2015-08-25 16:39:23

CREATE VIEW tableau.mkt_sms_reminder_telephone_call_date
AS

SELECT
*
FROM
(
  SELECT 
    row_number() over (partition by co.customer_id order by co.date_created desc) AS "rnum",
    cu.email,
    CASE WHEN cu.gender = 'Male' THEN 'Herr' ELSE 'Frau' END as salutation,
    cu.formal as du_sie,
    case
      when cu.gender= 'Male' then 'Lieber'
      when cu.gender= 'Female' then 'Liebe'
    end AS "lieb_geehrt",
    cu.first_name,
    cu.last_name,
    cu.phone_number,
    co.shipping_country,
    cu.default_domain as default_page,
    cu.subscribe_status,
    cu.customer_id,
    st.first_name as stylist_firstname,
    st.last_name as stylist_lastname,
    cu.token as customer_token,
    co.date_phone_call as date_phone_call_current,
    CASE 
    	WHEN cu.subscribed_to_sms=true THEN 'Yes'
    	ELSE 'No'
    END AS subscribed_to_sms,
    co.is_real_order
  FROM bi.customer_order co
  LEFT JOIN bi.customer cu on cu.customer_id=co.customer_id
  LEFT JOIN raw.customer_salesforce cs on cs.customer_id=cu.customer_id
  LEFT JOIN bi.stylist st on st.stylist_id=cu.stylist_id
  WHERE 
  co.date_given_to_debt_collection IS NULL 
  AND co.sales_channel != 'website'
  AND co.payment_type != 'Pre-pay'
)a
WHERE a.rnum = '1'


