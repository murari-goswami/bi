-- Name: tableau.mkt_picture_uploads_wishlist
-- Created: 2015-09-30 09:43:25
-- Updated: 2015-09-30 09:43:25

CREATE view tableau.mkt_picture_uploads_wishlist
AS

SELECT 
	cu.customer_id,
	cu.last_name as customer_last_name,
	cu.first_name as customer_first_name,
	sf.formal_or_informal,
	cu.prefix,
	st.first_name as stylist_first_name,
	st.last_name as stylist_last_name,
	cu.token,
	cu.email,
	cast(a.first_picture_uploaded as date) first_picture_upload_date,
	cast(a.last_picture_uploaded as date) last_picture_upload_date,
	cu.default_domain,
	a.nb_images as number_of_images,
	co.last_order_date 
FROM bi.customer cu
JOIN
(
	SELECT 
		customer_id,
		MAX(date_created) as last_picture_uploaded, 
		MIN(date_created) as first_picture_uploaded, 
		count(distinct image_url) as nb_images 
	FROM postgres.customer_image 
	WHERE original_file_name like '%APP+WISH_LIST%'
	AND cast(date_created as date)>='2015-01-01'
	group by 1
)a on a.customer_id=cu.customer_id
LEFT JOIN
(
	SELECT 
		customer_id, 
		max(cast(date_created as date)) as last_order_date
	FROM bi.customer_order
	group by 1
) co  ON co.customer_id = cu.customer_id
LEFT JOIN raw.stylist st ON cu.new_stylist_id = st.stylist_id 
LEFT JOIN raw.customer_salesforce sf ON sf.customer_id = cu.customer_id
WHERE cu.subscribe_status != 'Unsubscribed'
AND cu.user_type = 'Real User'
AND  co.last_order_date < cast(a.first_picture_uploaded as date)


