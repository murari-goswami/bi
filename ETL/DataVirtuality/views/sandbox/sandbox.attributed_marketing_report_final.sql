-- Name: sandbox.attributed_marketing_report_final
-- Created: 2015-08-07 15:09:41
-- Updated: 2015-08-07 15:09:41

CREATE VIEW sandbox.attributed_marketing_report_final
AS

SELECT 
	at.reporting_type,
	at."date",
	at.forecast_or_actuals,
	at.domain,
	at.marketing_channel,
	SUM(CASE
		WHEN forecast_or_actuals = 'Actuals' THEN at.incoming_first_orders
		WHEN at.days_week_passed = 0 THEN mo.incoming_first_orders_monthly / at.days_month_passed
		ELSE we.incoming_first_orders_weekly / at.days_week_passed
	END) AS incoming_first_orders,
	SUM(CASE
		WHEN forecast_or_actuals = 'Actuals' THEN at.invoiced_first_orders
		WHEN at.days_week_passed = 0 THEN mo.invoiced_first_orders_monthly / at.days_month_passed
		ELSE we.invoiced_first_orders_weekly / at.days_week_passed
	END) AS invoiced_first_orders,
	SUM(CASE
		WHEN forecast_or_actuals = 'Actuals' THEN at.sales_kept
		WHEN at.days_week_passed = 0 THEN mo.sales_kept_monthly / at.days_month_passed
		ELSE we.sales_kept_weekly / at.days_week_passed
	END) AS sales_kept,
	SUM(CASE
		WHEN forecast_or_actuals = 'Actuals' THEN at.sales_sent
		WHEN at.days_week_passed = 0 THEN mo.sales_sent_monthly / at.days_month_passed
		ELSE we.sales_sent_weekly / at.days_week_passed
	END) AS sales_sent,
	SUM(CASE
		WHEN forecast_or_actuals = 'Actuals' THEN at.billing_net_sales
		WHEN at.days_week_passed = 0 THEN mo.billing_net_sales_monthly / at.days_month_passed
		ELSE we.billing_net_sales_weekly / at.days_week_passed
	END) AS billing_net_sales,
	SUM(CASE
		WHEN forecast_or_actuals = 'Actuals' THEN at.visits
		WHEN at.days_week_passed = 0 THEN mo.visits_monthly / at.days_month_passed
		ELSE we.visits_weekly / at.days_week_passed
	END) AS visits,
	SUM(CASE
		WHEN forecast_or_actuals = 'Actuals' THEN at.cost
		WHEN at.days_week_passed = 0 THEN mo.cost_monthly / at.days_month_passed
		ELSE we.cost_weekly / at.days_week_passed
	END) AS cost
FROM sandbox.attributed_marketing_report at
LEFT JOIN
(
	SELECT
		reporting_type,
		year_week,
		domain,
		marketing_channel,
		SUM(incoming_first_orders) as incoming_first_orders_weekly,
		SUM(invoiced_first_orders) as invoiced_first_orders_weekly,
		SUM(sales_sent) as sales_sent_weekly,
		SUM(sales_kept) as sales_kept_weekly,
		SUM(billing_net_sales) as billing_net_sales_weekly,
		SUM(visits) as visits_weekly,
		SUM(cost) as cost_weekly
	FROM sandbox.attributed_marketing_report
	GROUP BY 1,2,3,4
) we ON we.reporting_type = at.reporting_type AND we.year_week = at.year_week AND we.domain = at.domain AND	we.marketing_channel = at.marketing_channel
LEFT JOIN
(
	SELECT
		reporting_type,
		year_month,
		domain,
		marketing_channel,
		SUM(incoming_first_orders) as incoming_first_orders_monthly,
		SUM(invoiced_first_orders) as invoiced_first_orders_monthly,
		SUM(sales_sent) as sales_sent_monthly,
		SUM(sales_kept) as sales_kept_monthly,
		SUM(billing_net_sales) as billing_net_sales_monthly,
		SUM(visits) as visits_monthly,
		SUM(cost) as cost_monthly
	FROM sandbox.attributed_marketing_report
	GROUP BY 1,2,3,4
) mo ON mo.reporting_type = at.reporting_type AND mo.year_month = at.year_month AND mo.domain = at.domain AND	mo.marketing_channel = at.marketing_channel
GROUP BY 1,2,3,4,5


