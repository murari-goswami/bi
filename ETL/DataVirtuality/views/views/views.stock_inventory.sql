-- Name: views.stock_inventory
-- Created: 2015-04-24 18:18:05
-- Updated: 2015-04-24 18:18:05

CREATE view views.stock_inventory
AS
SELECT 
	s1.date_created, 
	s1.sku as sku, 
	s1.quantity as quantity, 
	s1.reserved as reserved, 
	s2.quantity as quantity2, 
	s2.reserved as reserved2 
FROM 
(
	SELECT 
		cast(now() as date) as date_created, 
		se.quantity, 
		se.reserved, 
		se.sku 
	FROM views.stock_entry se
	UNION 
	SELECT 
		cast(timestampadd(SQL_TSI_DAY, -1, seh.date_created) as date) as date_created,
		seh.quantity,
		seh.reserved,
		seh.sku 
	FROM dwh.stock_entry_history seh
) s1
JOIN 
(
	SELECT 
		cast(seh2.date_created as date) as date_created,
		seh2.quantity,
		seh2.reserved,
		seh2.sku
	FROM dwh.stock_entry_history seh2
) s2 on s1.date_created = s2.date_created AND s1.sku = s2.sku


