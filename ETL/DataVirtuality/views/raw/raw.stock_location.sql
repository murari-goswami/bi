-- Name: raw.stock_location
-- Created: 2015-04-24 18:17:10
-- Updated: 2015-04-24 18:17:10

CREATE VIEW raw.stock_location AS

SELECT 
	id AS stock_location_id,
	CASE
		WHEN id = 1	THEN 'Zalando Germany'
		WHEN id = 2	THEN 'Outfittery'
		WHEN id = 3	THEN 'Zalando Switzerland'
		WHEN id = 4	THEN 'FashionID'
	END AS stock_location_supplier,
	supplier_id
FROM postgres.stock_location


