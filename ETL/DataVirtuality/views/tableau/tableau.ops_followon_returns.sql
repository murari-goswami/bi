-- Name: tableau.ops_followon_returns
-- Created: 2015-04-29 18:12:12
-- Updated: 2015-04-29 18:12:12

CREATE VIEW tableau.ops_followon_returns
AS

SELECT 
	cal.date,
	ret.orders_returned,
	COUNT(DISTINCT fol.order_id) followon_orders,
	COUNT(DISTINCT
		CASE WHEN fol.working_days >=0 AND fol.working_days <= 14 THEN fol.order_id END)
	AS followon_orders_working_days_0_14,
	COUNT(DISTINCT
		CASE WHEN fol.working_days >14 THEN fol.order_id END)
	AS followon_orders_working_days_over_14

FROM 
	dwh.calendar cal
	LEFT JOIN
	(
		SELECT CAST(date_returned AS DATE) date_returned, COUNT(DISTINCT order_id) AS orders_returned
		FROM
			bi.customer_order 
		WHERE
			    order_state != 'Cancelled'
			AND date_returned IS NOT NULL
			AND articles_returned >0
		GROUP BY 1
	) AS ret 
		ON cal.date = ret.date_returned
	LEFT JOIN
	(
		SELECT 
			co.id as order_id,
			CAST(co.date_picked AS DATE) as followon_date_picked,
			sum(cal1.working_days) as working_days
		FROM 
			views.customer_order co
			join
				(select
					id,
					date_returned as original_return_date,
					state as parent_order_state
				from
					views.customer_order) a
				on a.id = parent_order_id
			join 
			dwh.calendar cal1
				on cal1."date" between cast(a.original_return_date as date) and cast(co.date_picked as date)
		WHERE
			co.parent_order_id is not null
		and co.state >= 16 
		and co.state <> 2048
		and a.parent_order_state >= 16
		and a.parent_order_state <> 2048
		and co.date_picked is not null
		group by 1,2
		HAVING 
			sum(cal1.working_days) IS NOT NULL
	) AS fol
		ON cal.date = fol.followon_date_picked

WHERE 
	cal.date >='2015-01-01' AND cal.date <= CURDATE()
GROUP BY 1,2


