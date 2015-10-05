-- Name: tableau.mkt_crm_whatsapp
-- Created: 2015-09-14 18:56:36
-- Updated: 2015-09-16 13:55:28

CREATE VIEW tableau.mkt_crm_whatsapp
AS

SELECT
  cu.customer_id,
  b.order_id,
  cu.email,
  CASE WHEN cu.gender = 'Male' THEN 'Herr' ELSE 'Frau' END as anrede,
  case
    when cu.gender= 'Male' THEN 'Lieber'
    when cu.gender= 'Female' THEN 'Liebe'
  end AS "begruessung",
  cu.formal as du_sie,
  cu.default_domain as "UTM Country",
  lower(cu.default_domain) as "country inital",
  cu.first_name,
  cu.last_name,
  cu.phone_number,
  cu.customer_age,
  st.first_name as stylist_firstname,
  st.last_name as stylist_lastname,
  st.team,
  cu.token,
  dt.tag,
  CASE
    WHEN dt.shipment_type like ('%Rücksendung%') OR dt.shipment_type like ('%returned%') then 'return/refusal'
    WHEN (dt.date_1st_attemptfail is not null OR dt.date_1st_attemptfail='' OR dt.date_1st_exception is not null OR dt.date_1st_exception='') and dt.date_delivered_to_customer is null then 'non-delivered after exception/attemptfail'
    WHEN (dt.date_1st_attemptfail is not null OR dt.date_1st_attemptfail='' OR dt.date_1st_exception is not null OR dt.date_1st_exception='') and dt.date_delivered_to_customer is not null then 'delivered after exception/attemptfail'
    WHEN dt.date_1st_attemptfail is null And dt.date_1st_exception is null and dt.date_delivered_to_customer is not null  THEN 'delivered without exceptions/attemptfails'
    ELSE 'non-delivered' 
  END AS delivery_state_with_exceptions,
  CAST(col.date_shipped AS DATE) AS date_shipped,
  CAST(col.date_returned AS DATE) AS date_returned,
  CAST(dt.date_delivered_to_customer AS DATE) AS date_delivered_to_customer,
  CAST(dt.date_transmission_to_carrier AS DATE) AS date_transmission_to_carrier
FROM bi.customer cu
LEFT JOIN raw.customer_salesforce cs on cs.customer_id=cu.customer_id 
LEFT JOIN bi.stylist st on st.stylist_id=cu.new_stylist_id
LEFT JOIN raw.customer_brand_cluster cr on cr.customer_id = cu.customer_id
JOIN
(
  SELECT
  * 
  FROM
  (
    SELECT 
      row_number() over (partition by customer_id order by date_created desc) AS "rnum",
      order_id,
    customer_id
  FROM bi.customer_order
  WHERE date_given_to_debt_collection IS NULL
  )a WHERE rnum=1
)b on cu.customer_id=b.customer_id
JOIN
(
    SELECT
      order_id,
      tracking_number,
      MAX(CASE WHEN rank=1 THEN tag END) AS tag,
      MAX(CASE WHEN rank=1 THEN shipment_type END) AS shipment_type,
      MAX(CASE WHEN tag='InfoReceived' THEN updated_at ELSE NULL END) AS date_transmission_to_carrier,
      MIN(CASE WHEN tag='AttemptFail' THEN updated_at ELSE NULL END) AS date_1st_attemptfail,
      MIN(CASE WHEN tag='Exception' THEN updated_at ELSE NULL END) AS date_1st_exception,
      MAX(CASE WHEN tag='Delivered' THEN updated_at ELSE NULL END) AS date_delivered_to_customer
  FROM bi.delivery_tracking
  GROUP BY 1,2
)dt on dt.order_id=b.order_id
JOIN bi.customer_order_logistics col on col.order_id=dt.order_id and col.track_and_trace_number=dt.tracking_number
WHERE
cu.gender= 'Male'
AND cu.subscribe_status != 'Unsubscribed'
AND cu.email not like '%invalid%' 
AND cu.subscribed_to_sms='true'


