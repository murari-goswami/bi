-- Name: raw.arvato_first_address_risk_check
-- Created: 2015-08-10 19:05:24
-- Updated: 2015-08-24 14:01:22

CREATE VIEW raw.arvato_first_address_risk_check
AS

/*this view has orders where first address is sent to arvato for risk check*/

SELECT
	a.order_id,
	a.customer_id,
	a.arv_date_created,
	a.requestbody_1,
	a.arvatoresult_1,
	a.responseCode_1,
	a.arvatoresult_2,
	a.responseCode_2,
	left(substring(a.requestbody_1, LOCATE('firstName',a.requestbody_1)+12), (LOCATE('"', substring(a.requestbody_1, LOCATE('firstName',a.requestbody_1)+13)))) as "first_name", 
	left(substring(a.requestbody_1, LOCATE('lastName',a.requestbody_1)+11), (LOCATE('"', substring(a.requestbody_1, LOCATE('lastName',a.requestbody_1)+13)))) as "last_name",
	left(substring(a.requestbody_1, LOCATE('careOf',a.requestbody_1)+9), (LOCATE('"', substring(a.requestbody_1, LOCATE('careOf',a.requestbody_1)+10)))) as careOf,
	left(substring(a.requestbody_1, LOCATE('street',a.requestbody_1)+9), (LOCATE('"', substring(a.requestbody_1, LOCATE('street',a.requestbody_1)+10)))) as street,
	left(substring(a.requestbody_1, LOCATE('streetNumber',a.requestbody_1)+15), (LOCATE('"', substring(a.requestbody_1, LOCATE('streetNumber',a.requestbody_1)+16)))) as streetNumber,
	left(substring(a.requestbody_1, LOCATE('zipCode',a.requestbody_1)+10), (LOCATE('"', substring(a.requestbody_1, LOCATE('zipCode',a.requestbody_1)+11)))) as zipCode,
	left(substring(a.requestbody_1, LOCATE('city',a.requestbody_1)+7), (LOCATE('"', substring(a.requestbody_1, LOCATE('city',a.requestbody_1)+8)))) as city,
	replace(left(left(substring(a.requestbody_1, LOCATE('country',a.requestbody_1)+9), (LOCATE('}', substring(a.requestbody_1, LOCATE('city',a.requestbody_1)+10)))),3),'}','') as country,
	left(substring(a.requestbody_1, LOCATE('email',a.requestbody_1)+8), (LOCATE('"', substring(a.requestbody_1, LOCATE('email',a.requestbody_1)+9)))) as email,
	CASE WHEN b.order_type IS NULL THEN 'First Order' ELSE b.order_type END as order_type,
	cu.default_domain
FROM "views.arvatoresults" a
/*assigns last order_type for customers who's orders are not created but risk check is done*/
LEFT JOIN
(
  SELECT
  	ROW_NUMBER() OVER(PARTITION BY customer_id ORDER BY date_created desc) AS rank,
  	customer_id,
  	order_type
  FROM bi.customer_order
)b on a.customer_id=b.customer_id and b.rank=1
LEFT JOIN raw.customer cu on cu.customer_id=a.customer_id


