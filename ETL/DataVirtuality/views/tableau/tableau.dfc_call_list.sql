-- Name: tableau.dfc_call_list
-- Created: 2015-09-28 21:55:58
-- Updated: 2015-09-29 16:30:03

CREATE VIEW tableau.dfc_call_list
AS

SELECT
	co.order_id,
	co.customer_id,
	co.date_invoiced,
	co.order_type,
	cu.email,
	cu.phone_number,
	CASE
		WHEN marketing_campaign='DIRECT_FEEDBACK_CALLS' OR lower(df.comment) LIKE 'dfc erreicht%' THEN 'Reached' 
		WHEN lower(df.comment) LIKE '%dfc nicht erreicht 3x%' THEN 'Not reached-3 Times' 
		ELSE 'Not Reached'
	END AS dfc_reached,
	st.stylist,
	st.team,
	df.comment,
	df.date_last_contacted,
	df.nb_of_tries,
	date_phone_call
FROM raw.customer_order co
LEFT JOIN raw.customer cu on cu.customer_id=co.customer_id
LEFT JOIN raw.stylist st on st.stylist_id=co.stylist_id
LEFT JOIN raw.dfc_calls df on df.order_id=co.order_id
WHERE CAST(co.date_invoiced AS DATE)<=TIMESTAMPADD(SQL_TSI_DAY,-7,curdate())
AND co.parent_order_id IS NULL
AND co.order_state_number IN (128,256)


