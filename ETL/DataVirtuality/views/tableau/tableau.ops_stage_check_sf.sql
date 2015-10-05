-- Name: tableau.ops_stage_check_sf
-- Created: 2015-06-23 14:05:30
-- Updated: 2015-06-23 14:51:47

CREATE VIEW tableau.ops_stage_check_sf
AS

/* this query is used to check salesforce stage change*/
SELECT 
	co.order_id,
	cos.salesforce_order_stage,
	co.order_state,
	co.date_shipped,
	co.date_completed,
	co.shipping_country,
	ss.track_and_trace_number,
	st.stylist
FROM bi.customer_order co
LEFT JOIN raw.customer_order_salesforce cos on cos.order_id=co.order_id
LEFT JOIN bi.stylist st on st.stylist_id=co.stylist_id
LEFT JOIN
(
	SELECT 
		order_id,
		track_and_trace_number 
	from raw.stock_shipped ss
	GROUP BY 1,2
)ss on ss.order_id=co.order_id
where co.order_state_number between 128 and 1024


