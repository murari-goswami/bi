-- Name: tableau.product_funnel_signup_survey
-- Created: 2015-04-24 18:24:25
-- Updated: 2015-05-11 10:06:57

CREATE view tableau.product_funnel_signup_survey
AS

/*Customer Survery*/
WITH cust_first_order AS
(
SELECT 
		co.customer_id,
		co.id,
		co.shipping_country,
		co.order_type,
		rank() over (partition by customer_id order by date_created) as r_cust
	FROM views.customer_order co
)
SELECT 
	cs.*,
	cu.default_page,
	cast(cu.date_created as date) as customer_date_created,
	co.shipping_country,
	mo.device_category,
	mo.mobile_device_branding,
	mo.mobile_device_model,
	mo.mobile_device_info,
	mo.operating_system,
    c_order_type.order_type
FROM views.customer cu
LEFT JOIN raw.customer_survey cs on cs.customer_id=cu.customer_id
/*This join is to get the device used for creating first order since 
customer survery is done only for first order*/
LEFT JOIN
(
	SELECT
	*
	FROM cust_first_order 
	WHERE r_cust=1
)co on cu.customer_id=co.customer_id
LEFT JOIN views.marketing_order mo on mo.order_id=co.id
/*Get Order Type of last order created by customer*/
LEFT JOIN
(
	SELECT 
		a.customer_id,
		a.order_type
	FROM cust_first_order a
	LEFT JOIN
	(
		SELECT
			customer_id,
			max(r_cust) as last_rank
		FROM cust_first_order
	GROUP BY 1
	)b ON a.customer_id=b.customer_id 
	where a.r_cust=b.last_rank
)c_order_type on c_order_type.customer_id=cu.customer_id


