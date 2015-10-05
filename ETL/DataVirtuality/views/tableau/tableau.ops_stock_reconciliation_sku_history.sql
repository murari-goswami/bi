-- Name: tableau.ops_stock_reconciliation_sku_history
-- Created: 2015-04-24 18:17:50
-- Updated: 2015-04-24 18:17:50

CREATE view tableau.ops_stock_reconciliation_sku_history
as
select 
	seh.outfittery_article_number, 
	cast(seh.date_created as date) as stock_date,
	seh.available_stock, 
	sm.plus_bookings, 
	sm.minus_bookings,
	ms.shipped_articles, 
	ms.shipped_articles_cancellations
FROM postgres.doc_data_inventory_count seh
LEFT JOIN
/*----all plus and minus bookings----*/
	(select 
		customer_article_number, 
		cast(date_created as date) as stock_mutation_date,
		sum(case when cast(quantity_good as integer) > 0 then cast(quantity_good as integer) else 0 end) as plus_bookings,
		sum(case when cast(quantity_good as integer) < 0 then cast(quantity_good as integer) else 0 end) as minus_bookings
		FROM postgres.doc_data_stock_mutation group by 1,2
	) sm
on sm.customer_article_number = seh.outfittery_article_number and sm.stock_mutation_date = cast(seh.date_created as date)
left join 
/*----shipped articles----*/
	(select 
		outfittery_article_number, 
		cast(date_created as date) as shipped_date,
		count(case when processing_reason like '%A doc data service exception%' then 1 else null end) as shipped_articles_cancellations,
		count(*) as shipped_articles from postgres.doc_data_manifest_shipping group by 1,2
	) ms
on ms.outfittery_article_number = seh.outfittery_article_number and ms.shipped_date = cast(seh.date_created as date)


