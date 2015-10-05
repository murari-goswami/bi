-- Name: bi.purchase_order
-- Created: 2015-04-24 18:18:01
-- Updated: 2015-04-24 18:18:01

CREATE VIEW bi.purchase_order AS

SELECT
	po.*,
	poi.po_date_import_result
FROM 
	raw.purchase_order po
	LEFT JOIN
	(
		SELECT 
			purchase_order_id, MAX(po_date_import_result) AS po_date_import_result
		FROM
		  raw.purchase_order_import_result
		GROUP BY 1
	) AS poi
		ON po.purchase_order_id = poi.purchase_order_id

/*
SELECT 
	po.*,
	sl.stock_location_supplier	
FROM 
	raw.purchase_order po
	JOIN
	raw.stock_location sl
		ON po.stock_location_id = sl.stock_location_id
order by 1 desc
*/


