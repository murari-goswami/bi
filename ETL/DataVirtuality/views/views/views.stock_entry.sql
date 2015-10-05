-- Name: views.stock_entry
-- Created: 2015-04-24 18:17:21
-- Updated: 2015-04-24 18:17:21

CREATE view views.stock_entry 
AS 
SELECT 
	CAST(curdate() AS DATE) as date_created, 
	quantity, 
	reserved, 
	sku 
FROM postgres.stock_entry se
WHERE stock_location_id=2


