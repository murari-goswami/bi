-- Name: tableau.ops_daily_shipped_and_returned_dd
-- Created: 2015-04-24 18:20:29
-- Updated: 2015-09-15 10:13:54

CREATE VIEW tableau.ops_daily_shipped_and_returned_dd 
AS 

SELECT 
	co.customer_id,
	log.order_id,
	log.article_id,
	log.shipment_manifest_date,
	log.return_date,
	log.shipping_country,
	log.track_and_trace_number,
	log.return_track_and_trace_number,
	a.article_ean,
	a.article_commodity_group4,
	co.date_returned as date_order_returned
FROM 
	raw.customer_order_articles_logistics AS log
	LEFT JOIN 
	bi.article AS a 
		ON a.article_id = log.article_id
	LEFT JOIN 
	bi.customer_order AS co 
		ON log.order_id = co.order_id


