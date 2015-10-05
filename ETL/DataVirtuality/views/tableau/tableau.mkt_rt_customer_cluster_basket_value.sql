-- Name: tableau.mkt_rt_customer_cluster_basket_value
-- Created: 2015-05-05 10:31:15
-- Updated: 2015-05-05 10:31:15

CREATE VIEW tableau.mkt_rt_customer_cluster_basket_value
AS

SELECT 
	op.order_id,
	cast(co.invoice_date_created as date) as invoice_date_created,
	co.shipping_country,
	co.vat_percentage,
	co.currency_code,
	co.total_amount_billed_discount,
	co.total_goodwill_credit,
	case
		when repeat_orders.real_repeat_count is null and co.parent_order_id is null then '1'
		when repeat_orders.real_repeat_count= '1' and co.parent_order_id is null then '1'
		when repeat_orders.real_repeat_count> '1' and co.parent_order_id is null then '2'
		when repeat_orders.real_repeat_count is null and co.parent_order_id is not null then '3'
		when repeat_orders.real_repeat_count= '1' and co.parent_order_id is not null then '3'
	when repeat_orders.real_repeat_count> '1' and co.parent_order_id is not null then '3'
	end as "co_newrepeatfollow",
	ret.return_rate_3_weeks,
	count(co.id) as nb_of_orders,
	/*Articles Sent*/
	count(distinct case when op.state>= '128' and op.state<'2048' then op.id else null end) as "articles sent",
	count(distinct case when op.state= '128' then op.id else null end) as "articles_sent_test",
	count(distinct case when stock_location_id = 2 and op.state>= '128' and op.state<'2048' then op.id else null end) as "articles_sent_os",
	count(distinct case when stock_location_id <> 2 and op.state>= '128' and op.state<'2048' then op.id else null end) as "articles_sent_ps",
	/*Article Kept*/
	count(distinct case when op.state= '1024' then op.id else null end) as "articles kept",
	count(distinct case when stock_location_id = 2 and op.state= '1024' then op.id else null end) as "articles_kept_os",
	count(distinct case when stock_location_id <> 2 and op.state= '1024' then op.id else null end) as "articles_kept_ps",
	/*Gross Basket Purchase Price*/
	sum(case when op.state>=16 and op.state<2048 then op.quantity*op.purchase_price else 0 end) total_basket_purchase_price,
	sum(case when stock_location_id = 1 and op.state>=16 and op.state<2048 then op.quantity*op.purchase_price else 0 end)  as total_amount_basket_purchase_gross_z_stock,
	sum(case when stock_location_id = 2 and op.state>=16 and op.state<2048 then op.quantity*op.purchase_price else 0 end) as total_amount_basket_purchase_gross_own,
	sum(case when stock_location_id = 3 and op.state>=16 and op.state<2048 then op.quantity*op.purchase_price else 0 end) as total_amount_basket_purchase_gross_z_ch,
	/*Gross Basket Retail Price*/
	sum(case when op.state>=16 and op.state<2048 then op.quantity*op.retail_price_euro else 0 end) total_basket_retail_price,
	sum(case when stock_location_id = 1 and op.state>=16 and op.state<2048 then op.quantity*op.retail_price_euro else 0 end) as total_amount_basket_retail_gross_z_stock,
	sum(case when stock_location_id = 2 and op.state>=16 and op.state<2048 then op.quantity*op.retail_price_euro else 0 end) as total_amount_basket_retail_gross_own,
	sum(case when stock_location_id = 3 and op.state>=16 and op.state<2048 then op.quantity*op.retail_price_euro else 0 end) as total_amount_basket_retail_gross_z_ch,
	/*Return Purchase Price*/
	sum(case when op.state=512 then op.quantity*op.purchase_price else 0 end) retoure_value_purchase_price,
	sum(case when stock_location_id = 1 and op.state=512 then op.quantity*op.purchase_price else 0 end)  as return_purchase_gross_z_stock,
	sum(case when stock_location_id = 2 and op.state=512 then op.quantity*op.purchase_price else 0 end) as return_purchase_gross_own,
	sum(case when stock_location_id = 3 and op.state=512 then op.quantity*op.purchase_price else 0 end) as return_purchase_gross_z_ch,
	/*Return Retail Price*/
	sum(case when op.state=512 then op.quantity*op.retail_price_euro else 0 end) retoure_value,
	sum(case when stock_location_id = 1 and op.state=512 then op.quantity*op.retail_price_euro else 0 end) as return_retail_gross_z_stock,
	sum(case when stock_location_id = 2 and op.state=512 then op.quantity*op.retail_price_euro else 0 end) as return_retail_gross_own,
	sum(case when stock_location_id = 3 and op.state=512 then quantity*op.retail_price_euro else 0 end) as return_retail_gross_z_ch,
	/*Lost Purchase Price*/
	sum(case when op.state=1536 then op.quantity*op.purchase_price else 0 end) gross_lost_purchase,
	sum(case when stock_location_id = 1 and op.state=1536 then op.quantity*op.purchase_price else 0 end)  as gross_lost_purchase_z_stock,
	sum(case when stock_location_id = 2 and op.state=1536 then op.quantity*op.purchase_price else 0 end) as gross_lost_purchase_own,
	sum(case when stock_location_id = 3 and op.state=1536 then op.quantity*op.purchase_price else 0 end) as gross_lost_purchase_z_ch,
	/*Lost Retail Price*/
	sum(case when op.state=1536 then op.quantity*op.retail_price_euro else 0 end) gross_lost_retail,
	sum(case when stock_location_id = 1 and op.state=1536 then op.quantity*op.retail_price_euro else 0 end) as gross_lost_retail_z_stock,
	sum(case when stock_location_id = 2 and op.state=1536 then op.quantity*op.retail_price_euro else 0 end) as gross_lost_retail_own,
	sum(case when stock_location_id = 3 and op.state=1536 then op.quantity*op.retail_price_euro else 0 end) as gross_lost_retail_z_ch
FROM views.order_position op
JOIN views.customer_order co on co.id=op.order_id
/*Order Type*/
LEFT JOIN (
	SELECT
	distinct rank() over (partition by customer_id order by id, cast(date_created as date) asc) as "real_repeat_count",
	id 
	FROM views.customer_order 
	WHERE parent_order_id is null
) repeat_orders on repeat_orders.id=co.id
/*Return Rate Per Country*/
LEFT JOIN
(
	SELECT shipping_country,case when shipping_country in('SE','DK','BE','LU') then 0.75 else return_rate_3_weeks end as return_rate_3_weeks 
	FROM
	(
		SELECT shipping_country, case when total_basket_retail_price=0 then 0 else return_retail_price/total_basket_retail_price end as return_rate_3_weeks 
		FROM
		(
			SELECT
				co.shipping_country,
				sum(case when op.state=512 then op.quantity*op.retail_price_euro else null end) return_retail_price,
				sum(case when co.state=1024 and op.state<=1024 then op.quantity*op.retail_price_euro else null end) total_basket_retail_price
			FROM views.order_position op
			JOIN views.customer_order co on co.id=op.order_id
			WHERE cast(co.invoice_date_created as date)>=timestampadd(sql_tsi_month,-3,timestampadd(sql_tsi_day,-14,curdate())) 
			AND cast(co.invoice_date_created as date)<=timestampadd(sql_tsi_day,-14,curdate())
			GROUP BY 1
		) a
	) b
) ret on ret.shipping_country=co.shipping_country
/*Where Conditions*/
WHERE co.order_state='Real Order'
AND co.state<=1024 
AND op.state<2048 
GROUP BY 1,2,3,4,5,6,7,8,9


