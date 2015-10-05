-- Name: tableau.crm_club_customer_overview
-- Created: 2015-07-28 15:38:09
-- Updated: 2015-07-31 10:30:30

CREATE VIEW tableau.crm_club_customer_overview
AS


SELECT
	da.country,
	COUNT(customer_id) as customer_base,
	SUM(da.club_member) AS club_customer,
	SUM(da.shipped_order) AS customer_with_shipped_order,
	SUM(da.shipped_orders_last_year) AS customer_with_shipped_orders_last_year
FROM
(
	SELECT 
		ab.customer_id,
		ab.shipping_country as country,
		CASE WHEN cu.club_member = 'true' THEN 1 ELSE null END AS club_member,
		CASE WHEN co.shipped_orders = 0 THEN null ELSE 1 END AS shipped_order,
		CASE WHEN co.shipped_orders_last_year = 0 THEN null ELSE 1 END AS shipped_orders_last_year
	FROM
	(
		SELECT	
			customer_id,
			shipping_country,
			dense_rank() OVER (PARTITION BY customer_id ORDER BY date_created DESC) as count_desc
		FROM bi.customer_order
		WHERE is_real_order = 'Real Order'
	) ab
	LEFT JOIN bi.customer cu ON cu.customer_id = ab.customer_id
	LEFT JOIN
	(
		SELECT
			customer_id,
		 	SUM(CASE WHEN date_shipped is not null THEN 1 ELSE 0 END) AS shipped_orders,
		 	SUM(CASE WHEN date_shipped is not null AND CAST(date_shipped as date) >= TIMESTAMPADD(SQL_TSI_DAY,-365,CURDATE()) THEN 1 ELSE 0 END) AS shipped_orders_last_year
		FROM bi.customer_order
		WHERE is_real_order = 'Real Order'
		GROUP BY 1		
	) co ON co.customer_id = ab.customer_id
	WHERE count_desc = 1
) da
WHERE country is not null
AND country != 'GB'
GROUP BY 1


