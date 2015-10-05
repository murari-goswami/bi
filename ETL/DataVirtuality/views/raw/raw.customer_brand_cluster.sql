-- Name: raw.customer_brand_cluster
-- Created: 2015-04-24 18:21:34
-- Updated: 2015-05-11 17:09:07

CREATE view raw.customer_brand_cluster
AS

WITH cust_cluster AS
(
 	SELECT
		clu.customer_id,
		clu.brand,
		clu.marketing_cluster,
		clu.articles_kept,
		cast(clu.sales_per_brand as decimal) as "sales_per_brand"
	FROM
	(
		SELECT
			co.customer_id,
			COALESCE(b.name, art.article_brand) as "brand",
			b.marketing_cluster,
			sum(op.articles_kept) as articles_kept,
			sum(op.articles_kept*op.sales_in_local_currency/e.exchange_rate/e.exchange_rate) as "sales_per_brand",
			count(op.order_id) as "number_of_orders"
		FROM raw.customer_order_articles op
		LEFT JOIN raw.customer_order co on co.order_id=op.order_id
		LEFT JOIN raw.article art on art.article_id = op.article_id
		LEFT JOIN dwh.brands b ON b.name_db = art.article_brand
		LEFT JOIN dwh.historical_exchange_rates e on e.currency_code = co.currency_code AND cast(co.date_invoiced as date) = e.date
		WHERE op.order_article_state_number= '1024' AND co.order_state_number= '1024'
		GROUP BY 1,2,3
	)clu
)
SELECT
 	a.customer_id, 
 	a.marketing_cluster
FROM
(
SELECT 
	rc.customer_id, 
	rc.marketing_cluster, 
	COUNT(*) cluster_count, 
	SUM(rc.sales_per_brand) cluster_spend,
	RANK() OVER (PARTITION BY rc.customer_id ORDER BY COUNT(*) DESC) as cluster_rank,
	ROW_NUMBER() OVER (PARTITION BY rc.customer_id, COUNT(*) ORDER BY SUM(rc.sales_per_brand) DESC) as spend_row
FROM cust_cluster rc
WHERE rc.marketing_cluster IS NOT NULL
GROUP BY 1,2
)a
WHERE a.cluster_rank = 1
AND a.spend_row = 1


