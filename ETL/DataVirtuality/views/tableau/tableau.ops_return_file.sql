-- Name: tableau.ops_return_file
-- Created: 2015-04-24 18:20:52
-- Updated: 2015-04-24 18:20:52

CREATE view tableau.ops_return_file
AS
SELECT 
    r.original_orderid,
	r.outfittery_article_number,
	a.article_ean,
	r.date_created as return_date,
	cast(r.number_of_articles_return as integer) as number_of_articles_return,
	ad.country
FROM postgres.doc_data_return r
JOIN postgres.customer_order co on co.id=r.original_orderid
JOIN postgres.address ad on ad.id=co.shipping_address_id
JOIN bi.article a on a.article_id = r.outfittery_article_number


