-- Name: bi.own_stock_monthly
-- Created: 2015-05-22 16:21:39
-- Updated: 2015-06-10 12:22:14

CREATE VIEW bi.own_stock_monthly AS

/* This is a rollup to monthly level of the own stock data to reduce the data size of older records; used in tableau.data_source_own_stock */

SELECT
	own.article_id,
	TIMESTAMPADD(SQL_TSI_DAY, 1-DAYOFMONTH(own.date_created), own.date_created) AS date_created,
	MAX(CASE 
		WHEN own.date_created = TIMESTAMPADD(SQL_TSI_DAY, 1-DAYOFMONTH(own.date_created), own.date_created)
		THEN own.stock_beg 
	END) stock_beg,
	MAX(CASE 
		WHEN own.date_created = TIMESTAMPADD(SQL_TSI_DAY, -1, TIMESTAMPADD(SQL_TSI_MONTH, 1, TIMESTAMPADD(SQL_TSI_DAY, -DAYOFMONTH(own.date_created)+1, own.date_created)))
		THEN own.stock_end
	END) stock_end,
	MAX(CASE 
		WHEN own.date_created = TIMESTAMPADD(SQL_TSI_DAY, 1-DAYOFMONTH(own.date_created), own.date_created) 
		THEN own.reserved_beg 
	END) reserved_beg,	
	MAX(CASE 
		WHEN own.date_created = TIMESTAMPADD(SQL_TSI_DAY, -1, TIMESTAMPADD(SQL_TSI_MONTH, 1, TIMESTAMPADD(SQL_TSI_DAY, -DAYOFMONTH(own.date_created)+1, own.date_created)))
		THEN own.reserved_end
	END) reserved_end,
	

	/*Stock movements FROM stock_mutation */
	CAST(SUM(own.po_bookings) AS SMALLINT) po_bookings,
	ROUND(AVG(own.po_article_sales_price),2) AS po_article_sales_price,
	ROUND(AVG(own.po_article_cost),2) AS po_article_cost,
	CAST(SUM(own.supplier_returns) AS SMALLINT) supplier_returns,

	/*Deliveries AND returns FROM purchase_order ow only*/
	CAST(SUM(own.poa_initial_qty) AS INTEGER) poa_initial_qty,
	SUM(own.poa_intial_qty_sales) poa_intial_qty_sales,
	SUM(own.poa_intial_qty_cost) poa_intial_qty_cost,
	CAST(SUM(own.poa_revised_qty) AS INTEGER) poa_revised_qty,
	SUM(own.poa_revised_qty_sales) poa_revised_qty_sales,
	SUM(own.poa_revised_qty_cost) poa_revised_qty_cost,
	CAST(SUM(own.poa_booked_qty) AS INTEGER) poa_booked_qty,
	SUM(own.poa_booked_qty_sales) poa_booked_qty_sales,
	SUM(own.poa_booked_qty_cost) poa_booked_qty_cost,
	MIN(own.poa_article_sales_price_min) poa_article_sales_price_min,
	MAX(own.poa_article_sales_price_max) poa_article_sales_price_max,
	ROUND(CASE WHEN SUM(own.poa_booked_qty) > 0 THEN SUM(poa_booked_qty_sales) / SUM(own.poa_booked_qty) END, 2) AS poa_article_sales_price_avg,
	MIN(own.poa_article_cost_min) poa_article_cost_min,
	MAX(own.poa_article_cost_max) poa_article_cost_max,
	ROUND(CASE WHEN SUM(own.poa_booked_qty) > 0 THEN SUM(poa_booked_qty_cost) / SUM(own.poa_booked_qty) END, 2) AS poa_article_cost_avg,
	
	CAST(SUM(own.articles_sent) AS SMALLINT) articles_sent,
	CAST(SUM(own.articles_sent_at) AS SMALLINT) articles_sent_at,
	CAST(SUM(own.articles_sent_be) AS SMALLINT) articles_sent_be,
	CAST(SUM(own.articles_sent_ch) AS SMALLINT) articles_sent_ch,
	CAST(SUM(own.articles_sent_de) AS SMALLINT) articles_sent_de,
	CAST(SUM(own.articles_sent_dk) AS SMALLINT) articles_sent_dk,
	CAST(SUM(own.articles_sent_lu) AS SMALLINT) articles_sent_lu,
	CAST(SUM(own.articles_sent_nl) AS SMALLINT) articles_sent_nl,
	CAST(SUM(own.articles_sent_se) AS SMALLINT) articles_sent_se,
	
	SUM(own.sales_sent) sales_sent,
	ROUND(SUM(own.sales_sent) / SUM(own.articles_sent),2) sales_sent_avg,
	SUM(own.sales_sent_at) sales_sent_at,
	SUM(own.sales_sent_be) sales_sent_be,
	SUM(own.sales_sent_ch) sales_sent_ch,
	SUM(own.sales_sent_de) sales_sent_de,
	SUM(own.sales_sent_dk) sales_sent_dk,
	SUM(own.sales_sent_lu) sales_sent_lu,
	SUM(own.sales_sent_nl) sales_sent_nl,
	SUM(own.sales_sent_se) sales_sent_se,
	
	SUM(own.cost_sent) cost_sent,
	ROUND(SUM(own.cost_sent) / SUM(own.articles_sent),2) cost_sent_avg,
	SUM(own.cost_sent_at) cost_sent_at,
	SUM(own.cost_sent_be) cost_sent_be,
	SUM(own.cost_sent_ch) cost_sent_ch,
	SUM(own.cost_sent_de) cost_sent_de,
	SUM(own.cost_sent_dk) cost_sent_dk,
	SUM(own.cost_sent_lu) cost_sent_lu,
	SUM(own.cost_sent_nl) cost_sent_nl,
	SUM(own.cost_sent_se) cost_sent_se,
	
	CAST(SUM(own.articles_kept) AS SMALLINT) articles_kept,
	CAST(SUM(own.articles_kept_at) AS SMALLINT) articles_kept_at,
	CAST(SUM(own.articles_kept_be) AS SMALLINT) articles_kept_be,
	CAST(SUM(own.articles_kept_ch) AS SMALLINT) articles_kept_ch,
	CAST(SUM(own.articles_kept_de) AS SMALLINT) articles_kept_de,
	CAST(SUM(own.articles_kept_dk) AS SMALLINT) articles_kept_dk,
	CAST(SUM(own.articles_kept_lu) AS SMALLINT) articles_kept_lu,
	CAST(SUM(own.articles_kept_nl) AS SMALLINT) articles_kept_nl,
	CAST(SUM(own.articles_kept_se) AS SMALLINT) articles_kept_se,
	
	SUM(own.sales_kept) sales_kept,
	ROUND(SUM(own.sales_kept) / SUM(own.articles_kept),2) sales_kept_avg,
	SUM(own.sales_kept_at) sales_kept_at,
	SUM(own.sales_kept_be) sales_kept_be,
	SUM(own.sales_kept_ch) sales_kept_ch,
	SUM(own.sales_kept_de) sales_kept_de,
	SUM(own.sales_kept_dk) sales_kept_dk,
	SUM(own.sales_kept_lu) sales_kept_lu,
	SUM(own.sales_kept_nl) sales_kept_nl,
	SUM(own.sales_kept_se) sales_kept_se,
	
	SUM(own.cost_kept) cost_kept,
	ROUND(SUM(own.cost_kept) / SUM(own.articles_kept),2) cost_kept_avg,
	SUM(own.cost_kept_at) cost_kept_at,
	SUM(own.cost_kept_be) cost_kept_be,
	SUM(own.cost_kept_ch) cost_kept_ch,
	SUM(own.cost_kept_de) cost_kept_de,
	SUM(own.cost_kept_dk) cost_kept_dk,
	SUM(own.cost_kept_lu) cost_kept_lu,
	SUM(own.cost_kept_nl) cost_kept_nl,
	SUM(own.cost_kept_se) cost_kept_se,
	
	CAST(SUM(own.articles_returned) AS SMALLINT) articles_returned,
	CAST(SUM(own.articles_returned_at) AS SMALLINT) articles_returned_at,
	CAST(SUM(own.articles_returned_be) AS SMALLINT) articles_returned_be,
	CAST(SUM(own.articles_returned_ch) AS SMALLINT) articles_returned_ch,
	CAST(SUM(own.articles_returned_de) AS SMALLINT) articles_returned_de,
	CAST(SUM(own.articles_returned_dk) AS SMALLINT) articles_returned_dk,
	CAST(SUM(own.articles_returned_lu) AS SMALLINT) articles_returned_lu,
	CAST(SUM(own.articles_returned_nl) AS SMALLINT) articles_returned_nl,
	CAST(SUM(own.articles_returned_se) AS SMALLINT) articles_returned_se,
		
	SUM(own.sales_returned) sales_returned,
	ROUND(SUM(own.sales_returned) / SUM(own.articles_returned),2) sales_returned_avg,
	SUM(own.sales_returned_at) sales_returned_at,
	SUM(own.sales_returned_be) sales_returned_be,
	SUM(own.sales_returned_ch) sales_returned_ch,
	SUM(own.sales_returned_de) sales_returned_de,
	SUM(own.sales_returned_dk) sales_returned_dk,
	SUM(own.sales_returned_lu) sales_returned_lu,
	SUM(own.sales_returned_nl) sales_returned_nl,
	SUM(own.sales_returned_se) sales_returned_se,
		
	SUM(own.cost_returned) cost_returned,
	ROUND(SUM(own.cost_returned) / SUM(own.articles_returned),2) cost_returned_avg,
	SUM(own.cost_returned_at) cost_returned_at,
	SUM(own.cost_returned_be) cost_returned_be,
	SUM(own.cost_returned_ch) cost_returned_ch,
	SUM(own.cost_returned_de) cost_returned_de,
	SUM(own.cost_returned_dk) cost_returned_dk,
	SUM(own.cost_returned_lu) cost_returned_lu,
	SUM(own.cost_returned_nl) cost_returned_nl,
	SUM(own.cost_returned_se) cost_returned_se,
		
	CAST(SUM(own.articles_lost) AS SMALLINT) articles_lost,
	SUM(own.cost_lost) cost_lost,
	SUM(own.sales_lost) sales_lost,
		
	CAST(SUM(own.virtual_stock_articles_sent) AS SMALLINT) virtual_stock_articles_sent,
	SUM(own.virtual_stock_sales_sent) virtual_stock_sales_sent,
	SUM(own.virtual_stock_cost_sent) virtual_stock_cost_sent,
	ROUND(SUM(own.virtual_stock_sales_sent) / SUM(own.virtual_stock_articles_sent),2) virtual_stock_sales_sent_avg,
	ROUND(SUM(own.virtual_stock_cost_sent) / SUM(own.virtual_stock_articles_sent),2) virtual_stock_cost_sent_avg
	
FROM 
	bi.own_stock own
GROUP BY 1,2


