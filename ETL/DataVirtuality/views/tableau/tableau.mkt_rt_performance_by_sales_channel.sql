-- Name: tableau.mkt_rt_performance_by_sales_channel
-- Created: 2015-09-02 12:37:33
-- Updated: 2015-09-02 13:49:53

CREATE VIEW tableau.mkt_rt_performance_by_sales_channel
AS

SELECT
	CAST(date_invoiced as date) as date_invoiced,
	order_id,
	sales_channel,
	sales_channel_special,
	shipping_country,
	CASE 
		WHEN sales_channel = 'showroom' THEN 'Showroom'
		WHEN sales_channel_special = 'Direct Feedback Calls' THEN 'Direct Feedback Calls'
		WHEN sales_channel_special = 'sms' THEN 'sms'
		WHEN sales_channel_special = 'magazine email' THEN 'Magazine email'
		WHEN sales_channel_special = 'OUTFITTERY CLUB' THEN 'Outfittery club'
		WHEN LOWER(sales_channel) like '%website%' THEN 'Website'
		WHEN LOWER(sales_channel) like '%app%' THEN 'App'
		ELSE sales_channel
	END AS sales_channel_adjusted,
	sales_sent,
	sales_kept,
	billing_total
FROM "bi.customer_order" co
WHERE co.date_invoiced is not null
AND co.order_type = 'Repeat Order'
AND co.is_real_order = 'Real Order'
AND co.order_state_number >= 16
AND co.order_state_number < 2048


