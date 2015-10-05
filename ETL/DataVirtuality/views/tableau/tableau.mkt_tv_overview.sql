-- Name: tableau.mkt_tv_overview
-- Created: 2015-04-24 18:24:22
-- Updated: 2015-08-07 10:48:20

CREATE VIEW tableau.mkt_tv_overview
AS
SELECT 
	co.id as order_id,
	mo.flagged_as_tv,
	mo.tv_spot_date_aired,
	mo.tv_spot_station,
	mo.tv_spot_program,
	mo.marketing_channel_excluding_tv,
	mo.marketing_channel,
	co.shipping_country,
	co.shipping_zip,
	co.shipping_city,
	co.payment_method,
	co.sales_channel,
	co.date_picked,
	co.state,
	cu.default_page,
	coalesce(op.order_value_kept_re,0) as order_value_kept_re,
	coalesce(op.order_value_sent_re,0) as order_value_sent_re,
	coalesce(op.order_value_returned_re,0) as order_value_returned_re,
	case 
		when coalesce(op.order_value_sent_re,0)=0 then 0 
		else coalesce(op.order_value_returned_re,0)/coalesce(op.order_value_sent_re,0)
	end as return_rate
FROM views.customer_order co
LEFT JOIN views.marketing_order mo on co.id=mo.order_id
LEFT JOIN views.customer cu on cu.customer_id=co.customer_id
LEFT JOIN 
(
	SELECT
		op.order_id,
		sum(case when op.state>=16 and op.state<2048 then op.retail_price_euro else 0 end) order_value_sent_re,
		sum(case when op.state=1024 then op.retail_price_euro else 0 end) order_value_kept_re,
		sum(case when op.state=512 then op.retail_price_euro else 0 end) order_value_returned_re
	FROM views.order_position op
	GROUP BY 1
)op on op.order_id=co.id


