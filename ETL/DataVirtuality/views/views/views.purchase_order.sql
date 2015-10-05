-- Name: views.purchase_order
-- Created: 2015-04-24 18:17:10
-- Updated: 2015-04-24 18:17:10

CREATE view views.purchase_order AS 

SELECT 
	purchase_order.id,
	purchase_order.version,
	purchase_order.date_created,
	purchase_order.date_fulfilled,
	purchase_order.due_date,
	purchase_order.last_updated,
	purchase_order.order_id,
	purchase_order.state,
	purchase_order.supplier_id,
	purchase_order.class,
	purchase_order.flagged_for_resubmission,
	purchase_order.date_canceled,
	purchase_order.date_initialized,
	purchase_order.stock_location_id,
	purchase_order.season,
	purchase_order.order_typ
FROM 
	postgres.purchase_order



/* newer code, but rolling back because of erp
SELECT 
	purchase_order_id AS id,
	CAST(NULL AS LONG) AS version,
	po_date_created AS date_created,
	po_date_fulfilled AS date_fulfilled,
	po_date_due AS due_date,
	po_date_updated AS last_updated,
	order_id,
	po_state_number AS state,
	supplier_id,
	po_class AS class,
	po_flagged_for_resubmission AS flagged_for_resubmission,
	po_date_cancelled AS date_canceled,
	po_date_initialized AS date_initialized,
	stock_location_id,
	CAST(
	CASE
		WHEN po_season ='1-SS' 		THEN 'FS'
		WHEN po_season ='2-FW' 		THEN 'HW'
		WHEN po_season ='2014-1-SS' THEN 'FS14'
		WHEN po_season ='2015-1-SS' THEN 'FS15'
		WHEN po_season ='2016-1-SS' THEN 'FS16'
		WHEN po_season ='2017-1-SS' THEN 'FS17'
		WHEN po_season ='2018-1-SS' THEN 'FS18'
		WHEN po_season ='2019-1-SS' THEN 'FS19'
		WHEN po_season ='2020-1-SS' THEN 'FS20'
		WHEN po_season ='2014-2-FW' THEN 'HW14'
		WHEN po_season ='2015-2-FW' THEN 'HW15'
		WHEN po_season ='2016-2-FW' THEN 'HW16'
		WHEN po_season ='2017-2-FW' THEN 'HW17'
		WHEN po_season ='2018-2-FW' THEN 'HW18'
		WHEN po_season ='2019-2-FW' THEN 'HW19'
		WHEN po_season ='2020-2-FW' THEN 'HW20'
		WHEN po_season IS NULL THEN NULL
		ELSE 'Ask BI'
	END 
	AS STRING(50)) AS season,
	CAST(
	CASE
		WHEN po_order_type  = 'special reduced price order'		THEN 'Sonderposten'
		WHEN po_order_type  = 'early order for later season' 	THEN 'Vororder'
		WHEN po_order_type  = 'reorder' 						THEN 'Nachorder'
		WHEN po_order_type  = 'order delivered instantly' 		THEN 'Sofortorder'
		WHEN po_order_type  = 'optional order held at supplier' THEN 'Blockorder'
		WHEN po_order_type  IS NULL THEN NULL
		ELSE 'Ask BI'
	END
	AS STRING(50)) AS order_typ
FROM 
	bi.purchase_order
*/


