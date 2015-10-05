-- Name: raw.purchase_order
-- Created: 2015-04-24 18:17:10
-- Updated: 2015-04-24 18:17:10

CREATE VIEW raw.purchase_order AS

SELECT
	po.id AS purchase_order_id,
	po.order_id,
	po.date_created AS po_date_created,
	po.date_fulfilled AS po_date_fulfilled,
	po.date_canceled AS po_date_cancelled,
	po.due_date AS po_date_due,
	po.last_updated AS po_date_updated,
	po.date_initialized AS po_date_initialized,
	/* ddpo.po_import_result AS po_date_import_result, */
	po.supplier_id,
	po.state AS po_state_number,
	po.class AS po_class,
	CASE
		WHEN po.order_typ ='Sonderposten' 	THEN 'special reduced price order'
		WHEN po.order_typ ='Vororder' 		THEN 'early order for later season'
		WHEN po.order_typ ='Nachorder' 		THEN 'reorder'
		WHEN po.order_typ ='Sofortorder' 	THEN 'order delivered instantly'
		WHEN po.order_typ ='Blockorder' 	THEN 'optional order held at supplier'
		WHEN po.order_typ IS NULL THEN NULL
		ELSE 'Ask BI'
	END AS po_order_type,
	CASE
		WHEN po.state = 4 		THEN 'PO created'
		WHEN po.state = 8 		THEN 'PO issued to supplier'
		WHEN po.state = 1024 	THEN 'PO complete'
		WHEN po.state = 2048	THEN 'PO cancelled'
		ELSE 'Ask BI'
	END AS po_state,
	CASE
		WHEN po.season IS NULL THEN NULL
		ELSE
		CASE
			WHEN po.season LIKE '%13' OR po.season LIKE '%2013%' THEN '2013-'
			WHEN po.season LIKE '%14' OR po.season LIKE '%2014%' THEN '2014-'
			WHEN po.season LIKE '%15' OR po.season LIKE '%2015%' THEN '2015-'
			WHEN po.season LIKE '%16' OR po.season LIKE '%2016%' THEN '2016-'
			WHEN po.season LIKE '%17' OR po.season LIKE '%2017%' THEN '2017-'
			WHEN po.season LIKE '%18' OR po.season LIKE '%2018%' THEN '2018-'
			WHEN po.season LIKE '%19' OR po.season LIKE '%2019%' THEN '2019-'
			WHEN po.season LIKE '%20' OR po.season LIKE '%2020%' THEN '2020-'
			ELSE ''
		END ||
		CASE
			WHEN LOWER(po.season) LIKE '%fs%' 	 		THEN '1-SS'
			WHEN LOWER(po.season) LIKE '%hw%'			THEN '2-FW'
			ELSE ''
		END 
	END AS po_season,
	po.flagged_for_resubmission AS po_flagged_for_resubmission,
	po.stock_location_id
FROM
	postgres.purchase_order po
	/*
	LEFT JOIN
	(
		SELECT 
			outfittery_purchaseid, MAX(ddpo.date_created) AS po_import_result
		FROM
			postgres.doc_data_purchase_order_import_result ddpo
		GROUP BY 1
	) ddpo
		ON po.id = ddpo.outfittery_purchaseid
	*/


