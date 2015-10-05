-- Name: views.order_position_kpis
-- Created: 2015-04-24 18:17:23
-- Updated: 2015-04-24 18:17:23

CREATE view "views.order_position_kpis"
as 
	select
	op.order_id,
	/*Items Sent*/
	count(case when op.state>=16 and op.state<2048 then op.id else null end) as "items_sent",
	count(case when op.stock_location_id = 2 and op.state>=16 and op.state<2048 then op.id else null end) as "items_sent_os",
	count(case when op.stock_location_id <> 2 and op.state>=16 and op.state<2048 then op.id else null end) as "items_sent_ps",
	/*Items Kept*/
	count(case when op.state=1024 then op.id else null end) as "items_kept",
	count(case when stock_location_id = 2 and op.state=1024 then op.id else null end) as "items_kept_os",
	count(case when stock_location_id <> 2 and op.state= 1024 then op.id else null end) as "items_kept_ps",
	/*Items Returned*/
	count(case when op.state=512 then op.id else null end) as "items_returned",
	count(case when stock_location_id = 2 and op.state=512 then op.id else null end) as "items_returned_os",
	count(case when stock_location_id <> 2 and op.state= 512 then op.id else null end) as "items_returned_ps",
	/*Items Lost*/
	count(case when op.state=1536 then op.id else null end) as "items_lost",
	count(case when stock_location_id = 2 and op.state=1536 then op.id else null end) as "items_lost_os",
	count(case when stock_location_id <> 2 and op.state= 1536 then op.id else null end) as "items_lost_ps",
	/*-----------------------------------------PURCHASE PRICE---------------------------------------------------*/
	/*Order Value Sent-Purchase Price*/
	sum(case when op.state>=16 and op.state<2048 then op.purchase_price else 0 end) order_value_sent_pu,
	sum(case when op.stock_location_id = 1 and op.state>=16 and op.state<2048 then op.purchase_price else 0 end) as order_value_sent_pu_z,
	sum(case when op.stock_location_id = 2 and op.state>=16 and op.state<2048 then op.purchase_price else 0 end) as order_value_sent_pu_os,
	sum(case when op.stock_location_id = 3 and op.state>=16 and op.state<2048 then op.purchase_price else 0 end) as order_value_sent_pu_z_ch,
	/*Order Value Kept-Purchase Price*/
	sum(case when op.state=1024 then op.purchase_price else 0 end) order_value_kept_pu,
	sum(case when op.stock_location_id = 1 and op.state=1024 then op.purchase_price else 0 end) as order_value_kept_pu_z,
	sum(case when op.stock_location_id = 2 and op.state=1024 then op.purchase_price else 0 end) as order_value_kept_pu_own,
	sum(case when op.stock_location_id = 3 and op.state=1024 then op.purchase_price else 0 end) as order_value_kept_pu_z_ch,
	/*Order Value Returned-Purchase Price*/
	sum(case when op.state =512 then op.purchase_price else 0 end) order_value_returned_pu,
	sum(case when op.stock_location_id = 1 and op.state =512 then op.purchase_price else 0 end) as order_value_returned_pu_z,
	sum(case when op.stock_location_id = 2 and op.state =512 then op.purchase_price else 0 end) as order_value_returned_pu_own,
	sum(case when op.stock_location_id = 3 and op.state =512 then op.purchase_price else 0 end) as order_value_returned_pu_z_ch,
	/*Order Value Lost-Purchase Price*/
	sum(case when op.state=1536 then op.purchase_price else 0 end) order_value_lost_pu,
	sum(case when op.stock_location_id = 1 and op.state=1536 then op.purchase_price else 0 end) as order_value_lost_pu_z,
	sum(case when op.stock_location_id = 2 and op.state=1536 then op.purchase_price else 0 end) as order_value_lost_pu_own,
	sum(case when op.stock_location_id = 3 and op.state=1536 then op.purchase_price else 0 end) as order_value_lost_pu_z_ch,
	/*-----------------------------------------RETAIL PRICE---------------------------------------------------*/
	/*Order Value Sent-Retail Price*/
	sum(case when op.state>=16 and op.state<2048 then op.retail_price else 0 end) as order_value_sent_re,
	sum(case when op.stock_location_id = 1 and op.state>=16 and op.state<2048 then op.retail_price else 0 end) as order_value_sent_re_z,
	sum(case when op.stock_location_id = 2 and op.state>=16 and op.state<2048 then op.retail_price else 0 end) as order_value_sent_re_os,
	sum(case when op.stock_location_id = 3 and op.state>=16 and op.state<2048 then op.retail_price else 0 end) as order_value_sent_z_re_ch,
	/*Order Value Kept-Retail Price*/
	sum(case when op.state=1024 then op.retail_price else 0 end) as order_value_kept_re,
	sum(case when op.stock_location_id = 1 and op.state=1024 then op.retail_price else 0 end) as order_value_kept_re_z,
	sum(case when op.stock_location_id = 2 and op.state=1024 then op.retail_price else 0 end) as order_value_kept_re_own,
	sum(case when op.stock_location_id = 3 and op.state=1024 then op.retail_price else 0 end) as order_value_kept_re_z_ch,
	/*Order Value Returned-Retail Price*/
	sum(case when op.state=512 then op.retail_price else 0 end) as order_value_returned_re,
	sum(case when op.stock_location_id = 1 and op.state=512 then op.retail_price else 0 end) as order_value_returned_re_z,
	sum(case when op.stock_location_id = 2 and op.state=512 then op.retail_price else 0 end) as order_value_returned_re_own,
	sum(case when op.stock_location_id = 3 and op.state=512 then op.retail_price else 0 end) as order_value_returned_re_z_ch,
	/*Order Value Lost-Retail Price*/
	sum(case when op.state=1536 then op.retail_price else 0 end) as order_value_lost_re,
	sum(case when op.stock_location_id = 1 and op.state=1536 then op.retail_price else 0 end) as order_value_lost_re_z,
	sum(case when op.stock_location_id = 2 and op.state=1536 then op.retail_price else 0 end) as order_value_lost_re_own,
	sum(case when op.stock_location_id = 3 and op.state=1536 then op.retail_price else 0 end) as order_value_lost_re_z_ch,
	/*Order Value Lost-Retail Price*/
	sum(case when op.state >=128 and op.state<2048 then op.retail_price else 0 end) as order_value_incl_ret_re,
	sum(case when op.stock_location_id = 1 and op.state >=128 and op.state<2048 then op.retail_price else 0 end) as order_value_incl_ret_z,
	sum(case when op.stock_location_id = 2 and op.state >=128 and op.state<2048 then op.retail_price else 0 end) as order_value_incl_ret_own,
	sum(case when op.stock_location_id = 3 and op.state >=128 and op.state<2048 then op.retail_price else 0 end) as order_value_incl_ret_ch,
	/*Geschenk Articles*/
	count(case when  sa.ean in ('2009876543503','2009876543510') and op.state < 2048 then '1' else Null end) as geschenk_box,
	count(case when  sa.ean ='2009876543503' and op.state < 2048 then 1 else Null end) as geschenk_box_2009876543503, 
	count(case when  sa.ean ='2009876636489' and op.state < 2048 then 1 else Null end) as geschenk_box_2009876636489, 
	count(case when  sa.ean ='2009876543527' and op.state < 2048 then 1 else Null end) as geschenk_box_2009876543527, 
	count(case when  sa.ean ='2009876543534' and op.state < 2048 then 1 else Null end) as geschenk_box_2009876543534,   
	count(case when  sa.ean ='2009876543510' and op.state < 2048 then 1 else Null end) as geschenk_box_2009876543510,
	count(case when  sa.ean ='2009876543497' and op.state < 2048 then 1 else Null end) as geschenk_box_2009876543497,
	count(case when  sa.ean in ('2009876543503','2009876543510','2009876543527','2009876636489','2009876543534','2009876543497') and op.state = 512 then 1 else Null end) as geschenk_retourniert
FROM "postgres.order_position" op
LEFT JOIN "postgres.customer_order" co on co.id=op.order_id
LEFT JOIN postgres.supplier_article sa on sa.id=op.supplier_article_id
WHERE co.state<2048
GROUP BY 1


