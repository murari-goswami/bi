-- Name: tableau.billing_arvato_address_check
-- Created: 2015-04-24 18:26:52
-- Updated: 2015-08-10 19:02:25

CREATE view tableau.billing_arvato_address_check
AS

SELECT
	order_id,
	customer_order_date_created,
	requestbody_1,
	left(substring(requestbody_1, LOCATE('firstName',requestbody_1)+12), (LOCATE('"', substring(requestbody_1, LOCATE('firstName',requestbody_1)+13)))) as "first_name", 
	left(substring(requestbody_1, LOCATE('lastName',requestbody_1)+11), (LOCATE('"', substring(requestbody_1, LOCATE('lastName',requestbody_1)+13)))) as "last_name",
	left(substring(requestbody_1, LOCATE('careOf',requestbody_1)+9), (LOCATE('"', substring(requestbody_1, LOCATE('careOf',requestbody_1)+10)))) as careOf,
	left(substring(requestbody_1, LOCATE('street',requestbody_1)+9), (LOCATE('"', substring(requestbody_1, LOCATE('street',requestbody_1)+10)))) as street,
	left(substring(requestbody_1, LOCATE('streetNumber',requestbody_1)+15), (LOCATE('"', substring(requestbody_1, LOCATE('streetNumber',requestbody_1)+16)))) as streetNumber,
	left(substring(requestbody_1, LOCATE('zipCode',requestbody_1)+10), (LOCATE('"', substring(requestbody_1, LOCATE('zipCode',requestbody_1)+11)))) as zipCode,
	left(substring(requestbody_1, LOCATE('city',requestbody_1)+7), (LOCATE('"', substring(requestbody_1, LOCATE('city',requestbody_1)+8)))) as city,
	replace(left(left(substring(requestbody_1, LOCATE('country',requestbody_1)+9), (LOCATE('}', substring(requestbody_1, LOCATE('city',requestbody_1)+10)))),3),'','}') as country,
	left(substring(requestbody_1, LOCATE('email',requestbody_1)+8), (LOCATE('"', substring(requestbody_1, LOCATE('email',requestbody_1)+9)))) as email
FROM views.additional_order_information


