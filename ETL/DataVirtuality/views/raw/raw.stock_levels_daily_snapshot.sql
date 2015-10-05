-- Name: raw.stock_levels_daily_snapshot
-- Created: 2015-05-13 10:03:39
-- Updated: 2015-05-13 10:03:39

CREATE VIEW raw.stock_levels_daily_snapshot AS 

/* 	this query takes an snapshot of the numbers in postgres.stock_entry at 00:30; effectively, it's the ending inventory
	of the prior day and the beginning inventory of the next day; postgres.stock_entry gets a nightly overwrite 
	with doc data data at 4AM; it then gets updated throughout the day */

SELECT 
	CURDATE() AS date_created, 
	CAST(sku AS INTEGER) AS article_id,
	CAST(quantity AS SMALLINT) AS quantity, 
	CAST(reserved AS SMALLINT) AS reserved
FROM 
	postgres.stock_entry se
WHERE
	stock_location_id = 2 /* outfittery/own stock */
	
	
/* original code

CREATE view raw.stock_entry 
AS 
SELECT 
	CAST(curdate() AS DATE) as date_created, 
	quantity, 
	reserved, 
	sku as article_id
FROM postgres.stock_entry se
WHERE stock_location_id=2
*/


