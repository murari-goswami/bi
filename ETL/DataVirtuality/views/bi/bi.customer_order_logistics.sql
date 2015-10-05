-- Name: bi.customer_order_logistics
-- Created: 2015-04-24 18:20:49
-- Updated: 2015-09-13 19:08:02

CREATE view bi.customer_order_logistics AS

SELECT
	z.*,
	CASE WHEN logistics_order_state = 'created' 					THEN 1 END AS orders_created,
	CASE WHEN logistics_order_state = 'awaiting stylist pick' 		THEN 1 END AS orders_awaiting_stylist_pick,
	CASE WHEN logistics_order_state = 'stylist picked'				THEN 1 END AS orders_stylist_picked,
	CASE WHEN logistics_order_state = 'header created'				THEN 1 END AS orders_header_created,
	CASE WHEN logistics_order_state = 'data import error'			THEN 1 END AS orders_import_error,
	CASE WHEN logistics_order_state = 'imported successfully'		THEN 1 END AS orders_imported_successfully,
	CASE WHEN logistics_order_state = 'backordered/not on stock'	THEN 1 END AS orders_backordered_nos,
	CASE WHEN logistics_order_state = 'picklist created'			THEN 1 END AS orders_picklist_created,
	CASE WHEN logistics_order_state = 'packed'						THEN 1 END AS orders_packed,
	CASE WHEN logistics_order_state = 'shipped'						THEN 1 END AS orders_shipped,
	CASE WHEN logistics_order_state = 'returned'					THEN 1 END AS orders_returned,
	CASE WHEN logistics_order_state IN ('returned', 'shipped')		THEN 1 END AS orders_shipped_and_returned

FROM

(
	WITH col AS
	(
	SELECT
		cos.order_id,
		cos.order_state_number,
		cos.shipping_country,
		sla.sla_date_start,
		sla.sla_date_start_adjusted,
		sla.sla_date_shipment_confirmation,
		sla.sla_date_shipped,
		sla.sla_next_ship_day,
		sla.sla_performance,
		sla.sla_working_days,
		sla.sla_hours,
		MIN(cos.date_created) 					AS date_created,
		MIN(p.date_awaiting_stylist_pick) 		AS date_awaiting_stylist_pick,
		MIN(cos.date_stylist_picked) 			AS date_stylist_picked,
		MIN(c.date_header_created) 				AS date_header_created,
		MIN(c.date_import_created) 				AS date_import_created,
		MIN(c.date_imported) 					AS date_imported,
		MIN(c.date_import_error) 				AS date_import_error,
		MIN(c.date_order_status_change_created)	AS date_order_status_change_created,
		MIN(c.date_backordered) 				AS date_backordered,
		MIN(c.date_not_on_stock) 				AS date_not_on_stock,
		MIN(c.date_picklist_created) 			AS date_picklist_created,
		MAX(c.date_picklist_created_max)		AS date_picklist_created_max,
		MAX(c.date_backordered_nos_max)			AS date_backordered_nos_max,
		MIN(c.date_packed) 						AS date_packed,
		MIN(c.date_shipped) 					AS date_shipped,
		MIN(c.date_returned) 					AS date_returned,
		MAX(c.import_error) 					AS import_error,
		MAX(c.transport_company_code) 			AS transport_company_code,
		MAX(c.track_and_trace_number) 			AS track_and_trace_number,
		MAX(c.shipping_code) 					AS shipping_code,
		MAX(c.return_track_and_trace_number)	AS return_track_and_trace_number,
		MAX(c.shipment_error) 					AS shipment_error,
		MAX(c.return_number) 					AS return_number,
		MAX(c.return_error) 					AS return_error
	FROM
		raw.customer_order_state_number cos
		LEFT JOIN
		/* coal is not the driving table b/c it doesn't cover orders before stylist pick */
		bi.customer_order_articles_logistics c
			ON cos.order_id 		= c.order_id
		LEFT JOIN
		raw.awaiting_stylist_pick AS p
			ON cos.order_id 		= p.order_id
		LEFT JOIN
		raw.customer_order_logists_outbound_sla AS sla
			ON cos.order_id 		= sla.order_id
	GROUP BY
		1,2,3,4,5,6,7,8,9,10,11
	)
	
	SELECT
		order_id,
		order_state_number,
		CASE 
			WHEN date_returned						IS NOT NULL THEN 'returned'
			WHEN date_shipped						IS NOT NULL THEN 'shipped'
			WHEN date_packed						IS NOT NULL THEN 'packed'
			/* Orders can go back and forth between picklist and bo/nos; that's why there's logic to find max dates and evaluate. Also, this is a rollup at the order level */
			WHEN date_picklist_created_max IS NOT NULL AND date_backordered_nos_max IS NULL 	THEN 'picklist created'
			WHEN date_picklist_created_max > date_backordered_nos_max 							THEN 'picklist created'
			WHEN date_picklist_created_max IS NULL AND date_backordered_nos_max IS NOT NULL 	THEN 'backordered/not on stock'
			WHEN date_picklist_created_max < date_backordered_nos_max							THEN 'backordered/not on stock'
			WHEN date_imported						IS NOT NULL	THEN 'imported successfully'
			WHEN date_import_error					IS NOT NULL THEN 'data import error'
			WHEN date_header_created				IS NOT NULL THEN 'header created'
			WHEN date_stylist_picked				IS NOT NULL THEN 'stylist picked'
			WHEN date_awaiting_stylist_pick			IS NOT NULL	THEN 'awaiting stylist pick'
			WHEN date_created						IS NOT NULL	THEN 'created'
			ELSE 'Ask BI'
		END AS logistics_order_state,
		CASE /* to sort the list in tableau quickfilters */
			WHEN date_returned						IS NOT NULL THEN '11-returned'
			WHEN date_shipped						IS NOT NULL THEN '10-shipped'
			WHEN date_packed						IS NOT NULL THEN '09-packed'
			WHEN date_picklist_created_max IS NOT NULL AND date_backordered_nos_max IS NULL 	THEN '08-picklist created'
			WHEN date_picklist_created_max > date_backordered_nos_max 							THEN '08-picklist created'
			WHEN date_picklist_created_max IS NULL AND date_backordered_nos_max IS NOT NULL 	THEN '07-backordered/not on stock'
			WHEN date_picklist_created_max < date_backordered_nos_max							THEN '07-backordered/not on stock'
			WHEN date_imported						IS NOT NULL	THEN '06-imported successfully'
			WHEN date_import_error					IS NOT NULL THEN '05-data import error'	
			WHEN date_header_created				IS NOT NULL THEN '04-header created'
			WHEN date_stylist_picked				IS NOT NULL THEN '03-stylist picked'
			WHEN date_awaiting_stylist_pick			IS NOT NULL	THEN '02-awaiting stylist pick'
			WHEN date_created						IS NOT NULL	THEN '01-created'
			ELSE 'Ask BI'
		END AS logistics_order_state_numbered,
		
		/* DATES */
		date_created,
		CASE
			WHEN order_state_number >= 16 THEN NULL ELSE date_awaiting_stylist_pick 
		END AS date_awaiting_stylist_pick,
		COALESCE(date_stylist_picked, date_header_created) AS date_stylist_picked, /* FOR OLDER RECORDS W/ POOR DATA QUALITY */
		CAST(COALESCE(date_stylist_picked, date_header_created, date_created) AS DATE) AS date_stylist_picked_or_created,
		date_header_created,
		date_import_created,
		date_imported,
		date_import_error,
		date_order_status_change_created,
		date_backordered,
		date_not_on_stock,
		date_picklist_created,
		date_packed,
		date_shipped,
		date_returned,
		
		/* OTHER DATE */
		import_error,
		transport_company_code,
		track_and_trace_number,
		shipping_country,
		shipping_code,
		return_track_and_trace_number,
		shipment_error,
		return_number,
		return_error,
		sla_date_start,
		sla_date_start_adjusted,
		sla_date_shipment_confirmation,
		sla_date_shipped,
		sla_next_ship_day,
		sla_performance,
		sla_working_days,
		sla_hours
	FROM
		col
) z


