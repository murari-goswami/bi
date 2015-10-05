-- Name: tableau.finance_financial_overview
-- Created: 2015-04-24 18:20:06
-- Updated: 2015-07-30 17:59:25

CREATE VIEW tableau.finance_financial_overview
AS
SELECT
	co.order_id,
	co.order_state,
	co.revenue_state,
	co.shipping_country,
	co.order_type,
	co.sales_sent,
	co.sales_kept,
	co.billing_total,
	co.billing_net_sales,
	co.cost_sent,
	co.cost_kept,
	co.date_invoiced,
	CASE 
		WHEN (
				(LEFT(co.date_returned,7) != LEFT(co.date_invoiced,7) AND co.date_returned > co.date_invoiced)
				OR co.date_returned is null
			)
			THEN 'Underway'
			ELSE 'Not'
	END as underway_at_month_end
FROM bi.customer_order co
WHERE co.order_state_number >= 16 
AND co.order_state_number < 2048
AND co.is_real_order = 'Real Order'
AND co.date_invoiced is not null


