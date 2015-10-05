-- Name: tableau.buying_delivery_performance
-- Created: 2015-04-29 12:51:46
-- Updated: 2015-04-29 12:51:46

CREATE view tableau.buying_delivery_performance
AS

SELECT 
	pop.article_id,
	pop.purchase_order_id,
	art.brand,
     art.season,
	sum(case when pop.quantity = scan.count_scans then 1 else 0 end) as "MATCH",
	sum(case when pop.quantity > scan.count_scans then 1 else 0 end) as "UNDERDELIVERED",
	sum(case when pop.quantity < scan.count_scans then 1 else 0 end) as "OVERDELIVERED",
	sum(case when cast(scan.max_date_delivered as date) < cast(pop.earliest_delivery_date as date) and cast(scan.max_date_delivered as date) < cast(pop.latest_delivery_date as date) then 1 else 0 end) as "EARLY",
	sum(case when cast(scan.max_date_delivered as date) > cast(pop.earliest_delivery_date as date) and cast(scan.max_date_delivered as date) < cast(pop.latest_delivery_date as date) then 1 else 0 end) as "ON TIME",
	sum(case when cast(scan.max_date_delivered as date) > cast(pop.earliest_delivery_date as date) and cast(scan.max_date_delivered as date) > cast(pop.latest_delivery_date as date) then 1 else 0 end) as "LATE" 
FROM views.purchase_order_position pop
left join views.scantemplates_agg scan on scan.po = pop.purchase_order_id and scan.ean = pop.ean 
left join 
(
	select 
		ean, 
		brand, 
		season 
	from views.ownstock_article 
	where supplier_id = 15
) art on art.ean = pop.ean
group by 1,2,3,4


