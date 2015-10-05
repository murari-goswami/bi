-- Name: bi.own_stock
-- Created: 2015-05-22 16:21:01
-- Updated: 2015-06-10 15:06:27

CREATE VIEW bi.own_stock AS

/* This query brings together data from multiple tables and sources. It presents a daily article level breakdown of sales (sent/kept/returned), inventory, POs, virtual stock, etc.
Once new KPIs are finalized, confirm that AVG fields, as well as MIN/MAX, are needed */


SELECT
	COALESCE(stock.article_id, bookings.article_id, coa.article_id) AS article_id,
	COALESCE(stock.date_created, bookings.stock_booking_date, coa.date_shipped)  AS date_created,

	/*  inventory at t0 AND t1 FROM stock_entry history + stock_entry current stock*/
	stock.stock_beg,
	stock.stock_end,
	stock.reserved_beg,
	stock.reserved_end,

	/*Stock movements FROM stock_mutation */
	bookings.po_bookings,
	bookings.po_article_sales_price,
	bookings.po_article_cost,
	bookings.supplier_returns,	

	/*Deliveries AND returns FROM purchase_order ow only*/
	poa.poa_initial_qty,
	poa.poa_intial_qty_sales,
	poa.poa_intial_qty_cost,
	poa.poa_revised_qty,
	poa.poa_revised_qty_sales,
	poa.poa_revised_qty_cost,
	poa.poa_booked_qty,
	poa.poa_booked_qty_sales,
	poa.poa_booked_qty_cost,
	poa.poa_article_sales_price_min,
	poa.poa_article_sales_price_max,
	poa.poa_article_sales_price_avg,
	poa.poa_article_cost_min,
	poa.poa_article_cost_max,
	poa.poa_article_cost_avg,
	
	/* Customer Order Articles Sales */
	coa.articles_sent,
	coa.articles_sent_at,
	coa.articles_sent_be,
	coa.articles_sent_ch,
	coa.articles_sent_de,
	coa.articles_sent_dk,
	coa.articles_sent_lu,
	coa.articles_sent_nl,
	coa.articles_sent_se,
	
	coa.sales_sent,
	coa.sales_sent_avg,
	coa.sales_sent_at,
	coa.sales_sent_be,
	coa.sales_sent_ch,
	coa.sales_sent_de,
	coa.sales_sent_dk,
	coa.sales_sent_lu,
	coa.sales_sent_nl,
	coa.sales_sent_se,
	
	coa.cost_sent,
	coa.cost_sent_avg,
	coa.cost_sent_at,
	coa.cost_sent_be,
	coa.cost_sent_ch,
	coa.cost_sent_de,
	coa.cost_sent_dk,
	coa.cost_sent_lu,
	coa.cost_sent_nl,
	coa.cost_sent_se,
	
	coa.articles_kept,
	coa.articles_kept_at,
	coa.articles_kept_be,
	coa.articles_kept_ch,
	coa.articles_kept_de,
	coa.articles_kept_dk,
	coa.articles_kept_lu,
	coa.articles_kept_nl,
	coa.articles_kept_se,
	
	coa.sales_kept,
	coa.sales_kept_avg,
	coa.sales_kept_at,
	coa.sales_kept_be,
	coa.sales_kept_ch,
	coa.sales_kept_de,
	coa.sales_kept_dk,
	coa.sales_kept_lu,
	coa.sales_kept_nl,
	coa.sales_kept_se,
	
	coa.cost_kept,
	coa.cost_kept_avg,
	coa.cost_kept_at,
	coa.cost_kept_be,
	coa.cost_kept_ch,
	coa.cost_kept_de,
	coa.cost_kept_dk,
	coa.cost_kept_lu,
	coa.cost_kept_nl,
	coa.cost_kept_se,
	
	coa.articles_returned,
	coa.articles_returned_at,
	coa.articles_returned_be,
	coa.articles_returned_ch,
	coa.articles_returned_de,
	coa.articles_returned_dk,
	coa.articles_returned_lu,
	coa.articles_returned_nl,
	coa.articles_returned_se,
	
	coa.sales_returned,
	coa.sales_returned_avg,
	coa.sales_returned_at,
	coa.sales_returned_be,
	coa.sales_returned_ch,
	coa.sales_returned_de,
	coa.sales_returned_dk,
	coa.sales_returned_lu,
	coa.sales_returned_nl,
	coa.sales_returned_se,
	
	coa.cost_returned,
	coa.cost_returned_avg,
	coa.cost_returned_at,
	coa.cost_returned_be,
	coa.cost_returned_ch,
	coa.cost_returned_de,
	coa.cost_returned_dk,
	coa.cost_returned_lu,
	coa.cost_returned_nl,
	coa.cost_returned_se,
	
	coa.articles_lost,
	coa.cost_lost,
	coa.sales_lost,
	
	coa.virtual_stock_articles_sent,
	coa.virtual_stock_cost_sent,
	coa.virtual_stock_sales_sent,
	coa.virtual_stock_cost_sent_avg,
	coa.virtual_stock_sales_sent_avg	

FROM 
	
	bi.stock_levels_history AS stock

	/*Backlog FROM purchase - always agg. yesterday*/
	LEFT JOIN
	(	 
		SELECT /* for all data; no date filter */
			TIMESTAMPADD(SQL_TSI_DAY, -1, CURDATE()) AS date_created,
			poa.article_id AS article_id,
			CAST(SUM(poa.stock_booked) AS INTEGER) AS poa_booked_qty,
			CAST(SUM(poa.stock_ordered_revised) AS INTEGER) AS poa_revised_qty,
			CAST(SUM(poa.stock_ordered_initially) AS INTEGER) AS poa_initial_qty,
			MIN(poa.article_sales_price) AS poa_article_sales_price_min,
			MAX(poa.article_sales_price) AS poa_article_sales_price_max,
			MIN(poa.article_cost) AS poa_article_cost_min,
			MAX(poa.article_cost) AS poa_article_cost_max,
			ROUND(AVG(poa.article_sales_price),2) AS poa_article_sales_price_avg,
			ROUND(AVG(poa.article_cost),2) AS poa_article_cost_avg,
			ROUND(SUM(poa.stock_ordered_initially*poa.article_sales_price),2) AS poa_intial_qty_sales,
			ROUND(SUM(poa.stock_ordered_initially*poa.article_cost),2) AS poa_intial_qty_cost,
			ROUND(SUM(poa.stock_ordered_revised*poa.article_sales_price),2) AS poa_revised_qty_sales,
			ROUND(SUM(poa.stock_ordered_revised*poa.article_cost),2) AS poa_revised_qty_cost,
			ROUND(SUM(poa.stock_booked*poa.article_sales_price),2) AS poa_booked_qty_sales,
			ROUND(SUM(poa.stock_booked*poa.article_cost),2) AS poa_booked_qty_cost
		FROM 
			bi.purchase_order_articles poa
			JOIN 
			bi.purchase_order po 
				ON poa.purchase_order_id = po.purchase_order_id 
		WHERE
			po.stock_location_id=2
		AND	poa.driving_tbl_poa IS NOT NULL
		GROUP BY 1,2
	) AS poa
		 ON stock.date_created 	= poa.date_created
		AND stock.article_id 	= poa.article_id

	/* stock movements */
	FULL JOIN
	(
		SELECT
			sb.article_id,
			sb.stock_booking_date,
			ROUND(AVG(poa.article_sales_price),2) AS po_article_sales_price,
			ROUND(AVG(poa.article_cost),2) AS po_article_cost,
			CAST(SUM(sb.po_bookings) AS SMALLINT) AS po_bookings,
		    CAST(SUM(sb.supplier_returns) AS SMALLINT) AS supplier_returns
		FROM 
			bi.stock_booked AS sb
			LEFT JOIN
			bi.purchase_order AS po
				 ON sb.purchase_order_id  = po.purchase_order_id
				AND po.stock_location_id != 2
			LEFT JOIN
			/* bringing in poa to get the cost/sales price at the time of the po */
			bi.purchase_order_articles AS poa
				 ON sb.purchase_order_id 	= poa.purchase_order_id
				AND sb.article_id 			= poa.article_id
				and poa.driving_tbl_poa IS NOT NULL /* to address full outer join on poa table */
		WHERE
			sb.stock_booking_processing_state_number = 2
		AND COALESCE(sb.po_bookings,0) + COALESCE(sb.supplier_returns,0) > 0 /* to eliminate rows with no data */
		AND po.purchase_order_id IS NULL  /* to eliminate POs with a stock location other than 2, own stock */
		GROUP BY 1,2
	) AS bookings 
		  ON stock.article_id	= bookings.article_id
		 AND stock.date_created	= bookings.stock_booking_date

	/* customer order articles info */
	FULL JOIN
	(
		SELECT
			CAST(coa.date_shipped AS DATE) AS date_shipped,
			coa.article_id,
			
			/* SENT */
			CAST(SUM(coa.articles_sent) AS SMALLINT) AS articles_sent,
			CAST(SUM(CASE WHEN co.shipping_country = 'AT' THEN coa.articles_sent END) AS SMALLINT) AS articles_sent_at,
			CAST(SUM(CASE WHEN co.shipping_country = 'BE' THEN coa.articles_sent END) AS SMALLINT) AS articles_sent_be,
			CAST(SUM(CASE WHEN co.shipping_country = 'CH' THEN coa.articles_sent END) AS SMALLINT) AS articles_sent_ch,
			CAST(SUM(CASE WHEN co.shipping_country = 'DE' THEN coa.articles_sent END) AS SMALLINT) AS articles_sent_de,
			CAST(SUM(CASE WHEN co.shipping_country = 'DK' THEN coa.articles_sent END) AS SMALLINT) AS articles_sent_dk,
			CAST(SUM(CASE WHEN co.shipping_country = 'LU' THEN coa.articles_sent END) AS SMALLINT) AS articles_sent_lu,
			CAST(SUM(CASE WHEN co.shipping_country = 'NL' THEN coa.articles_sent END) AS SMALLINT) AS articles_sent_nl,
			CAST(SUM(CASE WHEN co.shipping_country = 'SE' THEN coa.articles_sent END) AS SMALLINT) AS articles_sent_se,
		
			ROUND(SUM(coa.sales_sent),2) AS sales_sent,
			ROUND(AVG(coa.sales_sent),2) AS sales_sent_avg,
			ROUND(SUM(CASE WHEN co.shipping_country = 'AT' THEN coa.sales_sent END),2) AS sales_sent_at,
			ROUND(SUM(CASE WHEN co.shipping_country = 'BE' THEN coa.sales_sent END),2) AS sales_sent_be,
			ROUND(SUM(CASE WHEN co.shipping_country = 'CH' THEN coa.sales_sent END),2) AS sales_sent_ch,
			ROUND(SUM(CASE WHEN co.shipping_country = 'DE' THEN coa.sales_sent END),2) AS sales_sent_de,
			ROUND(SUM(CASE WHEN co.shipping_country = 'DK' THEN coa.sales_sent END),2) AS sales_sent_dk,
			ROUND(SUM(CASE WHEN co.shipping_country = 'LU' THEN coa.sales_sent END),2) AS sales_sent_lu,
			ROUND(SUM(CASE WHEN co.shipping_country = 'NL' THEN coa.sales_sent END),2) AS sales_sent_nl,
			ROUND(SUM(CASE WHEN co.shipping_country = 'SE' THEN coa.sales_sent END),2) AS sales_sent_se,
		
			ROUND(SUM(CAST(coa.cost_sent AS DECIMAL)),2) AS cost_sent,
			ROUND(AVG(CAST(coa.cost_sent AS DECIMAL)),2) AS cost_sent_avg,
			ROUND(SUM(CASE WHEN co.shipping_country = 'AT' THEN CAST(coa.cost_sent AS DECIMAL) END),2) AS cost_sent_at,
			ROUND(SUM(CASE WHEN co.shipping_country = 'BE' THEN CAST(coa.cost_sent AS DECIMAL) END),2) AS cost_sent_be,
			ROUND(SUM(CASE WHEN co.shipping_country = 'CH' THEN CAST(coa.cost_sent AS DECIMAL) END),2) AS cost_sent_ch,
			ROUND(SUM(CASE WHEN co.shipping_country = 'DE' THEN CAST(coa.cost_sent AS DECIMAL) END),2) AS cost_sent_de,
			ROUND(SUM(CASE WHEN co.shipping_country = 'DK' THEN CAST(coa.cost_sent AS DECIMAL) END),2) AS cost_sent_dk,
			ROUND(SUM(CASE WHEN co.shipping_country = 'LU' THEN CAST(coa.cost_sent AS DECIMAL) END),2) AS cost_sent_lu,
			ROUND(SUM(CASE WHEN co.shipping_country = 'NL' THEN CAST(coa.cost_sent AS DECIMAL) END),2) AS cost_sent_nl,
			ROUND(SUM(CASE WHEN co.shipping_country = 'SE' THEN CAST(coa.cost_sent AS DECIMAL) END),2) AS cost_sent_se,
		
		
			/* KEPT */
			CAST(SUM(coa.articles_kept) AS SMALLINT) AS articles_kept,
			CAST(SUM(CASE WHEN co.shipping_country = 'AT' THEN coa.articles_kept END) AS SMALLINT) AS articles_kept_at,
			CAST(SUM(CASE WHEN co.shipping_country = 'BE' THEN coa.articles_kept END) AS SMALLINT) AS articles_kept_be,
			CAST(SUM(CASE WHEN co.shipping_country = 'CH' THEN coa.articles_kept END) AS SMALLINT) AS articles_kept_ch,
			CAST(SUM(CASE WHEN co.shipping_country = 'DE' THEN coa.articles_kept END) AS SMALLINT) AS articles_kept_de,
			CAST(SUM(CASE WHEN co.shipping_country = 'DK' THEN coa.articles_kept END) AS SMALLINT) AS articles_kept_dk,
			CAST(SUM(CASE WHEN co.shipping_country = 'LU' THEN coa.articles_kept END) AS SMALLINT) AS articles_kept_lu,
			CAST(SUM(CASE WHEN co.shipping_country = 'NL' THEN coa.articles_kept END) AS SMALLINT) AS articles_kept_nl,
			CAST(SUM(CASE WHEN co.shipping_country = 'SE' THEN coa.articles_kept END) AS SMALLINT) AS articles_kept_se,
		
			ROUND(SUM(coa.sales_kept),2) AS sales_kept,
			ROUND(AVG(coa.sales_kept),2) AS sales_kept_avg,
			ROUND(SUM(CASE WHEN co.shipping_country = 'AT' THEN coa.sales_kept END),2) AS sales_kept_at,
			ROUND(SUM(CASE WHEN co.shipping_country = 'BE' THEN coa.sales_kept END),2) AS sales_kept_be,
			ROUND(SUM(CASE WHEN co.shipping_country = 'CH' THEN coa.sales_kept END),2) AS sales_kept_ch,
			ROUND(SUM(CASE WHEN co.shipping_country = 'DE' THEN coa.sales_kept END),2) AS sales_kept_de,
			ROUND(SUM(CASE WHEN co.shipping_country = 'DK' THEN coa.sales_kept END),2) AS sales_kept_dk,
			ROUND(SUM(CASE WHEN co.shipping_country = 'LU' THEN coa.sales_kept END),2) AS sales_kept_lu,
			ROUND(SUM(CASE WHEN co.shipping_country = 'NL' THEN coa.sales_kept END),2) AS sales_kept_nl,
			ROUND(SUM(CASE WHEN co.shipping_country = 'SE' THEN coa.sales_kept END),2) AS sales_kept_se,
		
			ROUND(SUM(CAST(coa.cost_kept AS DECIMAL)),2) AS cost_kept,
			ROUND(AVG(CAST(coa.cost_kept AS DECIMAL)),2) AS cost_kept_avg,
			ROUND(SUM(CASE WHEN co.shipping_country = 'AT' THEN CAST(coa.cost_kept AS DECIMAL) END),2) AS cost_kept_at,
			ROUND(SUM(CASE WHEN co.shipping_country = 'BE' THEN CAST(coa.cost_kept AS DECIMAL) END),2) AS cost_kept_be,
			ROUND(SUM(CASE WHEN co.shipping_country = 'CH' THEN CAST(coa.cost_kept AS DECIMAL) END),2) AS cost_kept_ch,
			ROUND(SUM(CASE WHEN co.shipping_country = 'DE' THEN CAST(coa.cost_kept AS DECIMAL) END),2) AS cost_kept_de,
			ROUND(SUM(CASE WHEN co.shipping_country = 'DK' THEN CAST(coa.cost_kept AS DECIMAL) END),2) AS cost_kept_dk,
			ROUND(SUM(CASE WHEN co.shipping_country = 'LU' THEN CAST(coa.cost_kept AS DECIMAL) END),2) AS cost_kept_lu,
			ROUND(SUM(CASE WHEN co.shipping_country = 'NL' THEN CAST(coa.cost_kept AS DECIMAL) END),2) AS cost_kept_nl,
			ROUND(SUM(CASE WHEN co.shipping_country = 'SE' THEN CAST(coa.cost_kept AS DECIMAL) END),2) AS cost_kept_se,
		
			
			/* RETURNED */
			CAST(SUM(coa.articles_returned) AS SMALLINT) AS articles_returned,
			CAST(SUM(CASE WHEN co.shipping_country = 'AT' THEN coa.articles_returned END) AS SMALLINT) AS articles_returned_at,
			CAST(SUM(CASE WHEN co.shipping_country = 'BE' THEN coa.articles_returned END) AS SMALLINT) AS articles_returned_be,
			CAST(SUM(CASE WHEN co.shipping_country = 'CH' THEN coa.articles_returned END) AS SMALLINT) AS articles_returned_ch,
			CAST(SUM(CASE WHEN co.shipping_country = 'DE' THEN coa.articles_returned END) AS SMALLINT) AS articles_returned_de,
			CAST(SUM(CASE WHEN co.shipping_country = 'DK' THEN coa.articles_returned END) AS SMALLINT) AS articles_returned_dk,
			CAST(SUM(CASE WHEN co.shipping_country = 'LU' THEN coa.articles_returned END) AS SMALLINT) AS articles_returned_lu,
			CAST(SUM(CASE WHEN co.shipping_country = 'NL' THEN coa.articles_returned END) AS SMALLINT) AS articles_returned_nl,
			CAST(SUM(CASE WHEN co.shipping_country = 'SE' THEN coa.articles_returned END) AS SMALLINT) AS articles_returned_se,
		
			ROUND(SUM(coa.sales_returned),2) AS sales_returned,
			ROUND(AVG(coa.sales_returned),2) AS sales_returned_avg,
			ROUND(SUM(CASE WHEN co.shipping_country = 'AT' THEN coa.sales_returned END),2) AS sales_returned_at,
			ROUND(SUM(CASE WHEN co.shipping_country = 'BE' THEN coa.sales_returned END),2) AS sales_returned_be,
			ROUND(SUM(CASE WHEN co.shipping_country = 'CH' THEN coa.sales_returned END),2) AS sales_returned_ch,
			ROUND(SUM(CASE WHEN co.shipping_country = 'DE' THEN coa.sales_returned END),2) AS sales_returned_de,
			ROUND(SUM(CASE WHEN co.shipping_country = 'DK' THEN coa.sales_returned END),2) AS sales_returned_dk,
			ROUND(SUM(CASE WHEN co.shipping_country = 'LU' THEN coa.sales_returned END),2) AS sales_returned_lu,
			ROUND(SUM(CASE WHEN co.shipping_country = 'NL' THEN coa.sales_returned END),2) AS sales_returned_nl,
			ROUND(SUM(CASE WHEN co.shipping_country = 'SE' THEN coa.sales_returned END),2) AS sales_returned_se,
		
			ROUND(SUM(CAST(coa.cost_returned AS DECIMAL)),2) AS cost_returned,
			ROUND(AVG(CAST(coa.cost_returned AS DECIMAL)),2) AS cost_returned_avg,
			ROUND(SUM(CASE WHEN co.shipping_country = 'AT' THEN CAST(coa.cost_returned AS DECIMAL) END),2) AS cost_returned_at,
			ROUND(SUM(CASE WHEN co.shipping_country = 'BE' THEN CAST(coa.cost_returned AS DECIMAL) END),2) AS cost_returned_be,
			ROUND(SUM(CASE WHEN co.shipping_country = 'CH' THEN CAST(coa.cost_returned AS DECIMAL) END),2) AS cost_returned_ch,
			ROUND(SUM(CASE WHEN co.shipping_country = 'DE' THEN CAST(coa.cost_returned AS DECIMAL) END),2) AS cost_returned_de,
			ROUND(SUM(CASE WHEN co.shipping_country = 'DK' THEN CAST(coa.cost_returned AS DECIMAL) END),2) AS cost_returned_dk,
			ROUND(SUM(CASE WHEN co.shipping_country = 'LU' THEN CAST(coa.cost_returned AS DECIMAL) END),2) AS cost_returned_lu,
			ROUND(SUM(CASE WHEN co.shipping_country = 'NL' THEN CAST(coa.cost_returned AS DECIMAL) END),2) AS cost_returned_nl,
			ROUND(SUM(CASE WHEN co.shipping_country = 'SE' THEN CAST(coa.cost_returned AS DECIMAL) END),2) AS cost_returned_se,
		
		
			/* LOST */
			CAST(SUM(coa.articles_lost) AS SMALLINT) AS articles_lost,
			ROUND(CAST(SUM(coa.cost_lost) AS DECIMAL),2) AS cost_lost,
			ROUND(CAST(SUM(coa.sales_lost) AS DECIMAL),2) AS sales_lost,
		
			
			/* VIRTUAL STOCK */
			CAST (SUM(CASE WHEN coa.order_article_state = 'Sent' THEN coa.articles_sent END) AS SMALLINT) AS virtual_stock_articles_sent,
			ROUND(SUM(CASE WHEN coa.order_article_state = 'Sent' THEN CAST(coa.cost_sent AS DECIMAL) END),2) AS virtual_stock_cost_sent,
			ROUND(SUM(CASE WHEN coa.order_article_state = 'Sent' THEN CAST(coa.sales_sent AS DECIMAL) END),2) AS virtual_stock_sales_sent,
			ROUND(AVG(CASE WHEN coa.order_article_state = 'Sent' THEN CAST(coa.cost_sent AS DECIMAL) END),2) AS virtual_stock_cost_sent_avg,
			ROUND(AVG(CASE WHEN coa.order_article_state = 'Sent' THEN CAST(coa.sales_sent AS DECIMAL) END),2) AS virtual_stock_sales_sent_avg
		
		FROM
			bi.customer_order AS co
			JOIN
			bi.customer_order_articles AS coa
				ON co.order_id = coa.order_id
		WHERE
			coa.stock_location_id =  2 /* own stock */
		AND coa.order_article_state_number !=2048 /* not cancelled */
		AND co.date_shipped  >= '2014-01-01'
		AND coa.date_shipped >= '2014-01-01'
		GROUP BY 1,2
	) AS coa 					/* coalesce to address 3 table full join */
		 ON coa.article_id 		= COALESCE(stock.article_id, bookings.article_id)
		AND coa.date_shipped 	= COALESCE(stock.date_created, bookings.stock_booking_date)

WHERE
	stock.date_created >='2014-01-01'
	/* the following strips out almost 2/3 of rows that have essentially no data; if any of the measures !=0 then the row is kept */
AND	COALESCE(ABS(stock.stock_beg),0) +
	COALESCE(ABS(stock.reserved_beg),0) +
	COALESCE(ABS(stock.stock_end),0) +
	COALESCE(ABS(stock.reserved_end),0) +
	COALESCE(ABS(bookings.po_bookings),0) +
	COALESCE(ABS(bookings.supplier_returns),0) +
	COALESCE(ABS(poa.poa_booked_qty),0) +
	COALESCE(ABS(poa.poa_revised_qty),0) +
	COALESCE(ABS(poa.poa_initial_qty),0) +
	COALESCE(ABS(coa.articles_sent),0) +
	COALESCE(ABS(coa.articles_kept),0) +
	COALESCE(ABS(coa.articles_returned),0) +
	COALESCE(ABS(coa.articles_lost),0) +
	COALESCE(ABS(coa.virtual_stock_articles_sent),0)
	> 0


