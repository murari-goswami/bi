-- Name: tableau.mkt_rt_customer_cluster_order_processed
-- Created: 2015-05-05 11:04:26
-- Updated: 2015-05-05 11:04:26

CREATE VIEW tableau.mkt_rt_customer_cluster_order_processed
AS

SELECT
	a.date_created,
	a.country as shipping_country,
	b.stock_created_anzahl_order,
	b.new_orders,
	b.real_repeat_orders,
	b.club_orders,
	cac.costs
FROM
/*Marketing Construct*/
(
	SELECT 
		distinct country,
		cast(datecreated as date) date_created
	FROM views.marketingconstruct
	WHERE datecreated > '2014' AND datecreated <  TIMESTAMPADD(SQL_TSI_DAY,7,CURDATE())
) a
/*Order Processed*/
LEFT JOIN
(
	SELECT 
		CAST(CASE 
			WHEN co.invoice_date_created is not null THEN co.invoice_date_created
			WHEN co.state >=128 AND co.state <=1024 AND co.date_shipped is not null THEN co.date_shipped
			WHEN co.state >=128 AND co.state <=1024 THEN co.date_created
		END as date) as date_created,
		co.shipping_country,
		count(distinct co.id) as stock_created_anzahl_order,
		count(distinct case when co.order_type='first order' then co.id else null end) as new_orders,
		count(distinct case when co.order_type='real repeat order' and co.sales_channel not in ('clubWithCall','clubWithoutCall') then co.id else null end) as real_repeat_orders,
		count(distinct case when co.order_type='real repeat order' and co.sales_channel in ('clubWithCall','clubWithoutCall') then co.id else null end) as club_orders
	FROM views.customer_order co
	WHERE co.state > 8 
	AND co.state <= 1024 
	AND co.order_state='Real Order'
	GROUP BY 1,2
) b on b.date_created=a.date_created AND a.country=b.shipping_country
/*Marketing Costs*/
LEFT JOIN
(
	SELECT 
		datecreated, 
		country, 
		sum(case when lower(currency)= 'chf' then (costs*0.8) else costs end) as costs 
	FROM views.marketingcosts 
	WHERE datecreated<=timestampadd(SQL_TSI_DAY,-1,curdate())
	GROUP BY 1,2
) cac on cac.datecreated=a.date_created AND cac.country=a.country


