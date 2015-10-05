-- Name: tableau.stylist_club_customers
-- Created: 2015-06-04 10:09:58
-- Updated: 2015-09-01 17:17:10

CREATE VIEW tableau.stylist_club_customers
AS

SELECT
	co.order_id,
	co.customer_id,
	co.date_incoming,
	co.sales_channel,
	co.order_sales_stage,
	c.club_member,
	c.club_membership_type,
	st_c.stylist as customer_stylist,
	st_c.team as customer_stylist_team
FROM bi.customer_order co
LEFT JOIN bi.customer c on c.customer_id = co.customer_id
LEFT JOIN bi.stylist st_c on st_c.stylist_id = c.new_stylist_id


