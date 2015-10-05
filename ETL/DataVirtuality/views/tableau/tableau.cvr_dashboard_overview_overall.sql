-- Name: tableau.cvr_dashboard_overview_overall
-- Created: 2015-08-10 18:07:01
-- Updated: 2015-08-10 18:07:01

CREATE VIEW tableau.cvr_dashboard_overview_overall
AS

SELECT
	ab.date_created,
	vi.website_visits,
	oc.other_contacts,
	vi.website_visits +	oc.other_contacts as leads,
	io.incoming_orders,
	sc.stylist_checkout_orders
FROM
(
	SELECT
	    c.date as date_created
	FROM dwh.calendar c 
	WHERE c.date > '2014'
	AND c.date <= CURDATE()
) ab
LEFT JOIN
(
	SELECT 
		date_created,
		SUM(visits) as website_visits
	FROM raw.daily_visits
	GROUP BY 1
	ORDER BY 1 desc
) vi ON vi.date_created = ab.date_created
LEFT JOIN
(
	SELECT 
		CAST(date_created as date) as date_created,
		COUNT(order_id) as other_contacts
	FROM bi.customer_order
	WHERE LOWER(sales_channel) NOT LIKE '%website%'
	GROUP BY 1
	ORDER BY 1 desc
) oc ON oc.date_created = ab.date_created
LEFT JOIN
(
	SELECT 
		CAST(date_created as date) as date_created,
		COUNT(order_id) as incoming_orders
	FROM bi.customer_order
	WHERE date_incoming is not null
	GROUP BY 1
	ORDER BY 1 desc
) io ON io.date_created=ab.date_created
LEFT JOIN
(
SELECT 
	CAST(date_created as date) as date_created,
	COUNT(order_id) as stylist_checkout_orders
FROM bi.customer_order
WHERE date_invoiced is not null
GROUP BY 1
ORDER BY 1 desc
) sc ON sc.date_created = ab.date_created


