-- Name: tableau.mgmt_sandbox_call_tracking
-- Created: 2015-05-08 10:25:33
-- Updated: 2015-05-08 10:25:33

CREATE VIEW tableau.mgmt_sandbox_call_tracking
AS

SELECT
	s.stylist_id,
	s.stylist_original as stylist,
	s.team,
	CAST(pd.date_phone_call as DATE) as date_phone_call,
	COUNT(DISTINCT pd.date_phone_call) as all_booked_calls,
	COUNT(DISTINCT CASE WHEN CAST(pd.date_created as DATE) = CAST(pd.date_phone_call as DATE) THEN pd.date_phone_call ELSE null END) as same_day_booked_calls,
	CASE WHEN COUNT(DISTINCT pd.date_phone_call) > 12 THEN COUNT(DISTINCT pd.date_phone_call) ELSE 12 END as maximum_calls,
	COUNT(DISTINCT co.order_id) as distinct_orders
FROM bi.customer_order_phone_dates pd
JOIN bi.customer_order co on co.order_id = pd.order_id
JOIN raw.stylist s on s.stylist_id = co.stylist_id
WHERE pd.date_phone_call > '2014'
AND pd.date_phone_call < TIMESTAMPADD(SQL_TSI_DAY, 14, CURDATE())
AND pd.date_phone_call > pd.date_created
AND (NOT pd.date_invalidated < pd.date_phone_call OR pd.date_invalidated is null)
AND s.real_stylist = true
AND s.role = 'Stylist'
GROUP BY 1,2,3,4
HAVING COUNT(DISTINCT pd.date_phone_call) > 6 
OR (COUNT(DISTINCT pd.date_phone_call) > 4 AND CAST(MAX(pd.date_phone_call) as date) = CURDATE())
OR CAST(MAX(pd.date_phone_call) as date) > CURDATE()


