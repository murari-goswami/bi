-- Name: tableau.bisdev_growth_basket_size_analysis
-- Created: 2015-05-05 10:17:14
-- Updated: 2015-05-05 10:17:14

CREATE VIEW tableau.bisdev_growth_basket_size_analysis
AS

SELECT 
	order_id,
	cast(co.date_shipped as date) as date_shipped,
	co.campaign_id,
	co.campaign_title,
	co.campaign_type,
	co.customer_age,
	co.customer_date_of_birth,
	co.order_type,
	co.shipping_city,
	co.shipping_country,
	co.shipping_zip,
	case 
		when cast(co.date_created as date) >= '2011-09-01' and cast(co.date_created as date) < '2012-03-01' then '2011-S2'
		when cast(co.date_created as date) >= '2012-03-01' and cast(co.date_created as date) <= '2012-08-31' then '2012-S1'
		when cast(co.date_created as date) >= '2012-09-01' and cast(co.date_created as date) < '2013-03-01' then '2012-S2'
		when cast(co.date_created as date) >= '2013-03-01' and cast(co.date_created as date) <= '2013-08-31' then '2013-S1'
		when cast(co.date_created as date) >= '2013-09-01' and cast(co.date_created as date) < '2014-03-01' then '2013-S2'
		when cast(co.date_created as date) >= '2014-03-01' and cast(co.date_created as date) <= '2014-08-31' then '2014-S1'
		when cast(co.date_created as date) >= '2014-09-01' and cast(co.date_created as date) < '2015-03-01' then '2014-S2'
		else null
	end as "OrderSeason",
	sum(distinct case when op.state >= 16 and op.state < 2048 then op.purchase_price else null end) as basket_purchase_price,
	sum(distinct case when op.state = 512 then op.purchase_price else null end) as return_purchase_price,
	sum(distinct case when op.state = 1024 then op.purchase_price else null end) as kept_purchase_price,
	sum(distinct case when op.state >= 16 and op.state < 2048 then op.retail_price else null end) as basket_retail_price,
	sum(distinct case when op.state = 512 then op.retail_price else null end) as return_retail_price,
	sum(distinct case when op.state = 1024 then op.retail_price else null end) as kept_retail_price,
	count(distinct case when op.state >= 16 and op.state < 2048 then op.id else null end) as basket_count,
	count(distinct case when op.state = 512 then op.id else null end) as return_count,
	count(distinct case when op.state = 1024 then op.id else null end) as kept_count
FROM views.order_position op
LEFT JOIN views.customer_order co on co.id=op.order_id
GROUP BY 1,2,3,4,5,6,7,8,9,10,11,12


