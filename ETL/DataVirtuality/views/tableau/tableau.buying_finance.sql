-- Name: tableau.buying_finance
-- Created: 2015-04-29 12:57:51
-- Updated: 2015-04-29 12:57:51

CREATE VIEW tableau.buying_finance
AS

SELECT
	a.brand,
	a.season,
	avg(case when op.stock_location_id=2 and op.state !=2048 and op.date_shipped is not null then op.purchase_price else 0 end) as avg_purchase_price, 
	avg(case when op.stock_location_id=2 and op.state !=2048 and op.date_shipped is not null then op.retail_price_euro else 0 end) as avg_retail_price,
	sum(case when op.stock_location_id=2 and op.state !=2048 and op.date_shipped is not null then op.purchase_price else 0 end) as total_purchase_price, 
	sum(case when op.stock_location_id=2 and op.state !=2048 and op.date_shipped is not null then op.retail_price_euro else 0 end) as total_retail_price,
	sum(case when op.stock_location_id=2 and op.state >  128 and op.state !=2048 and op.date_shipped is not null then 1 else 0 end) as shipped,
	sum(case when op.stock_location_id=2 and op.state >  128 and op.state !=2048 and op.date_shipped is not null then op.purchase_price else 0 end) as shipped_EK,
	sum(case when op.stock_location_id=2 and op.state >  128 and op.state !=2048 and op.date_shipped is not null then op.retail_price_euro else 0 end) as shipped_VK,
	sum(case when op.stock_location_id=2 and op.state = 1024 and op.date_shipped is not null then 1 else 0 end) as completed,
	sum(case when op.stock_location_id=2 and op.state = 1024 and op.date_shipped is not null then op.purchase_price else 0 end) as completed_EK,
	sum(case when op.stock_location_id=2 and op.state = 1024 and op.date_shipped is not null then op.retail_price_euro else 0 end) as completed_VK,
	sum(case when op.stock_location_id=2 and op.state >= 384 and op.state <= 512 and op.date_shipped is not null then 1 else 0 end) as returned,
	sum(case when op.stock_location_id=2 and op.state >= 384 and op.state <= 512 and op.date_shipped is not null then op.purchase_price else 0 end) as returned_EK,
	sum(case when op.stock_location_id=2 and op.state >= 384 and op.state <= 512 and op.date_shipped is not null then op.retail_price_euro else 0 end) as returned_VK,
	sum(case when op.stock_location_id=2 and op.state = 1536 and date_shipped is not null then 1 else 0 end) as lost
FROM views.order_position op
left join 
(
	SELECT 
		article_id, 
		brand,
		season 
	FROM views.ownstock_article 
	WHERE supplier_id = 15
) a on op.article_id = a.article_id 
GROUP BY 1,2


