-- Name: sandbox.logistics_orders_by_day
-- Created: 2015-04-24 18:24:18
-- Updated: 2015-04-24 18:24:18

CREATE VIEW sandbox.logistics_orders_by_day AS

SELECT
	cal.date,
	data.logistics_order_processing_state,
	COUNT(*) orders
FROM
	dwh.calendar cal
	JOIN
	(
		SELECT
			col.order_id,
			CAST(col.date_created AS DATE) AS cal_date,
			'created' AS logistics_order_processing_state
		FROM 
			bi.customer_order_logistics col
		WHERE 
			CAST(col.date_created AS DATE) BETWEEN TIMESTAMPADD(SQL_TSI_MONTH,-2,CURDATE()) AND CURDATE()
		
		UNION
		
		SELECT
			col.order_id,
			CAST(col.date_stylist_picked AS DATE),
			'stylist picked' 
		FROM 
			bi.customer_order_logistics col
		WHERE 
			CAST(col.date_stylist_picked AS DATE) BETWEEN TIMESTAMPADD(SQL_TSI_MONTH,-2,CURDATE()) AND CURDATE()
		
		UNION
		
		SELECT
			col.order_id,
			CAST(col.date_header_created AS DATE),
			'header created' 
		FROM 
			bi.customer_order_logistics col
		WHERE 
			CAST(col.date_header_created AS DATE) BETWEEN TIMESTAMPADD(SQL_TSI_MONTH,-2,CURDATE()) AND CURDATE()
		
		UNION
		
		SELECT
			col.order_id,
			CAST(col.date_imported AS DATE),
			'imported successfully' 
		FROM 
			bi.customer_order_logistics col
		WHERE 
			CAST(col.date_imported AS DATE) BETWEEN TIMESTAMPADD(SQL_TSI_MONTH,-2,CURDATE()) AND CURDATE()
		
		UNION
		
		SELECT
			col.order_id,
			CAST(col.date_backordered AS DATE),
			'backordered' 
		FROM 
			bi.customer_order_logistics col
		WHERE 
			CAST(col.date_backordered AS DATE) BETWEEN TIMESTAMPADD(SQL_TSI_MONTH,-2,CURDATE()) AND CURDATE()
		
		UNION
		
		SELECT
			col.order_id,
			CAST(col.date_picklist_created AS DATE),
			'picklist created' 
		FROM
			bi.customer_order_logistics col
		WHERE 
			CAST(col.date_picklist_created AS DATE) BETWEEN TIMESTAMPADD(SQL_TSI_MONTH,-2,CURDATE()) AND CURDATE()
		
		UNION
		
		SELECT
			col.order_id,
			CAST(col.date_packed AS DATE),
			'packed' 
		FROM
			bi.customer_order_logistics col
		WHERE 
			CAST(col.date_packed AS DATE) BETWEEN TIMESTAMPADD(SQL_TSI_MONTH,-2,CURDATE()) AND CURDATE()
		
		UNION
		
		SELECT
			col.order_id,
			CAST(col.date_shipped AS DATE),
			'shipped' 
		FROM
			bi.customer_order_logistics col
		WHERE 
			CAST(col.date_shipped AS DATE) BETWEEN TIMESTAMPADD(SQL_TSI_MONTH,-2,CURDATE()) AND CURDATE()
		
		UNION
		
		SELECT
			col.order_id,
			CAST(col.date_returned AS DATE),
			'returned' 
		FROM
			bi.customer_order_logistics col
		WHERE 
			CAST(col.date_returned AS DATE) BETWEEN TIMESTAMPADD(SQL_TSI_MONTH,-2,CURDATE()) AND CURDATE()
	) data
		ON cal.date = data.cal_date
/* 	WHERE cal.date BETWEEN TIMESTAMPADD(SQL_TSI_MONTH,-2,CURDATE()) AND CURDATE()
	throws a DV error, so the date has to go into each part of UNION queries */
GROUP BY 1,2


