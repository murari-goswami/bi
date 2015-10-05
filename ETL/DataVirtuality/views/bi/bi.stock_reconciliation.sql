-- Name: bi.stock_reconciliation
-- Created: 2015-04-24 18:17:42
-- Updated: 2015-04-24 18:17:42

CREATE VIEW bi.stock_reconciliation AS

SELECT
	c.date,
	se.sku,
	se.quantity,
	CASE WHEN dd.docdata_quantity is null THEN 0 ELSE dd.docdata_quantity END as docdata_quantity,
	CASE 
		WHEN se.quantity != 
			CASE WHEN dd.docdata_quantity is null THEN 0 ELSE dd.docdata_quantity END
			THEN 1 
		ELSE 0 
	END as stock_mismatch,
	se.reserved,
	CASE WHEN dd.docdata_reserved is null THEN 0 ELSE dd.docdata_reserved END as docdata_reserved
FROM 
	dwh.calendar c 
	JOIN 
	dwh.stock_entry_history se 
		 on se.date_created = c.date
	LEFT JOIN 
	dwh.stock_entry_history_dd dd 
		 on dd.date_created = c.date 
		AND dd.sku = se.sku
WHERE 
	c.date >  timestampadd(SQL_TSI_DAY, -7, curdate())
AND c.date <= curdate()
AND c.date >= '2014-12-02'


