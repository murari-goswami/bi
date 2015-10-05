-- Name: bi.stock_booked
-- Created: 2015-04-24 18:19:28
-- Updated: 2015-06-24 16:22:46

CREATE VIEW bi.stock_booked AS

/* 	please see https://outfittery.atlassian.net/wiki/display/OPS/List+of+Booking-supplier
	for additional explanation of supplier IDs
*/


SELECT
	sb.stock_booked_id,
	sb.purchase_order_id,
	sb.article_id,
	sb.stock_date,
	sb.date_stock_booked,
	CAST(sb.date_stock_booked AS DATE) AS stock_booking_date,
	sb.date_processed,
	sb.last_updated,
	sb.stock_booking_packing_slip_number,
	sb.stock_booking_code,
	sb.stock_booking_processing_reason,
	sb.stock_booking_processing_state_number,
	sb.stock_booking_processing_result,
	sb.supplier_id,
	sb.stock_defects,
	sb.stock_booked,
    /* THERE ISN'T ANY GOOD INFORMATION TO DEFINE THIS, SO JUST A GUESS */
    CASE
      WHEN sb.stock_booking_code = 1 THEN 'po/return'
      WHEN sb.stock_booking_code = 3 THEN 'other bookings'
      ELSE 'Ask BI'
    END AS stock_booking_state,
    /* THERE ISN'T ANY GOOD INFORMATION TO DEFINE THIS, SO JUST A GUESS */
    CASE
      WHEN sb.stock_booking_processing_state_number = 2 THEN 'processed successfully'
      ELSE 'processed unsuccessfully/other'
    END AS stock_booking_processing_state,

	/* SECTION TO COUNT BOOKINGS BY DIFFERENT CLASSIFICATION LOGIC */
	/*----all bookings on a PO----*/
    CASE 
        WHEN sb.stock_booking_code = 1 AND sb.supplier_id NOT IN (999998, 999998, 999997, 999996, 999995, 999992, 1, 20) AND po.stock_location_id = 2 AND sb.purchase_order_id IS NOT NULL
        THEN sb.stock_booked
    END AS po_bookings, /* also known as ow_dlv = own stock delivery received */
    
    /*----all manual un-booking----*/
    /* to cancel a booking */
    CASE
        WHEN sb.stock_booking_code = 3 AND sb.supplier_id = 999998 AND sb.stock_booking_processing_state_number = 2                                               
        THEN sb.stock_booked
    END AS manual_unbookings,
    /*----all 999997 (customer return) bookings----*/
    CASE 
        WHEN sb.stock_booking_code = 1 AND sb.supplier_id = 999997 AND sb.stock_booking_processing_state_number = 2                                               
        THEN sb.stock_booked
    END AS customer_returns, 
    /*----all picklist difference bookings: plus----*/
    /* The picklist is by grouping items to be shipped from multiple orders together; did too may or too few get picked */
    CASE 
        WHEN sb.stock_booking_code = 3 AND sb.supplier_id = 999996 AND sb.stock_booking_processing_state_number = 2 AND sb.stock_booked> 0   
        THEN sb.stock_booked
    END AS picklist_plus, 
    /*----all picklist difference bookings: minus----*/
    CASE 
        WHEN sb.stock_booking_code = 3 AND sb.supplier_id = 999996 AND sb.stock_booking_processing_state_number = 2 AND sb.stock_booked< 0   
        THEN sb.stock_booked
    END AS picklist_minus, 
    /*----all doc data cycle counts bookings----*/
    /*A cycle count is an inventory auditing procedure where a small subset of inventory, in a specific location, is counted on a specified day.*/
    CASE 
        WHEN sb.stock_booking_code = 3 AND sb.supplier_id = 999995 AND sb.stock_booking_processing_state_number = 2                                              
        THEN sb.stock_booked
    END AS cycle_counts,
    /*----all custom request bookings (cycle counts)----*/
    CASE 
        WHEN sb.stock_booking_code = 3 AND sb.supplier_id = 999992 AND sb.stock_booking_processing_state_number = 2 AND sb.stock_booking_packing_slip_number NOT IN ('Lieferr. Retour', 'KUNDENWUNSCH') 
        THEN sb.stock_booked
    END AS custom_requests, 
    /*----all supplier return bookings----*/
    CASE 
        WHEN sb.stock_booking_code = 3 AND sb.supplier_id IN (999992, 999998) AND sb.stock_booking_processing_state_number = 2 
			AND sb.stock_booking_packing_slip_number IN ('KUNDENWUNSCH', 'Lieferr. Retour', 'SO', 'SO/BENSHERMAN', 'SO/BENSHERMAN,', 'SO/BUGATTI', 'SO/CAMPUS','SO/DOCKeRS', 'SO/DOCKERS','SO/FTC',
              	'SO/GANT','SO/LEVIS','SO/LVIS','SO/MAZE','SO/KIOMI','SO/MICHAALSKY','SO/MICHALSKY','SO/MICHALSY','SO/OUTFIT.Basic','SO/OUTFIT.BASIC','SO/PAEZ','SO/SELECTED', 'SO BENSCHERMAN','SO LEVIS',
              	'SO SELECTED', 'LPP ARNE 11.07.2014', 'LPP126729979', 'LPP', 'LPP 4052871253388', '446850002 DOCKERS', 'CAMPUS', 'GANT S5690', 'Campus', 'REF:  TOM TAILOR') 
             OR LEFT(sb.stock_booking_packing_slip_number, 3)  = 'CNR'
             OR LEFT(sb.stock_booking_packing_slip_number, 6)  = 'SO CNR'
            AND LEFT(sb.stock_booking_packing_slip_number, 5) != 'CNR-Z'
        THEN sb.stock_booked
    END AS supplier_returns, /* also called ow_lret */   
    /*----all swiss return bookings----*/
    CASE
        WHEN sb.stock_booking_code = 3 AND sb.supplier_id = 999987 AND sb.stock_booking_processing_state_number = 2
        THEN sb.stock_booked
    END AS swiss_returns,
    /*----all Zalando bookings----*/
    CASE 
        WHEN sb.stock_booking_code = 1 AND sb.supplier_id = 25     AND sb.stock_booking_processing_state_number = 2
        THEN sb.stock_booked
    END AS zalando_bookings, /* also known as quantity_z_dlv = zalando deliveries received */
    /*----all Zalando return bookings----*/
	CASE
		WHEN sb.stock_booking_code = 3 AND sb.supplier_id IN (999992, 999998) AND sb.stock_booking_processing_state_number = 2
    		AND sb.stock_booking_packing_slip_number IN ('20140807-CNR-Z', 'RETOURE Z 1', '20140807-CNR Z', '20140806-CNR-Z', 'SVEN04072014', 'SVEN 4.7.2014', 'AUSBUCH_ LARS', 'Retoure Z1',
				'ZALANDO LIEF RET. 2', 'Z-Retoure 14.08', 'Z-LIEF-RETOUR TEIL 2', 'ZALANDO LIF RET T2', 'CNR-Z', 'Z-LIEF-RET T2', 'Ref Z-RETOURE 1', 'ZALANDO LIEF--RETOUR',
    			'ZALANDO LIEFRET', 'RETOURE O 1', 'Z-RETOURE 25.8.14', '20140807_CNR-Z', 'Retoure Z 1', '20140806_CNR-Z', 'SVEN 04.07.2014', 'Z-RETOURE 14.08.2014') 
    		OR LEFT(sb.stock_booking_packing_slip_number,5) = 'CNR-Z'
		THEN sb.stock_booked
    END AS zalando_returns, /* also known as z_lret */ 
	/*----sample bookings----*/
    CASE
        WHEN sb.stock_booking_code = 1 AND sb.supplier_id = 20     AND sb.stock_booking_processing_state_number = 2
        THEN sb.stock_booked
    END AS samples,
    /*----minus sample bookings----*/
    CASE 
        WHEN sb.stock_booking_code = 1 AND sb.supplier_id = 20     AND sb.stock_booking_processing_state_number = 2 AND sb.stock_booked> 0   
        THEN sb.stock_booked
    END AS samples_plus,
    /*----plus sample bookings----*/
    CASE 
        WHEN sb.stock_booking_code = 1 AND sb.supplier_id = 20     AND sb.stock_booking_processing_state_number = 2 AND sb.stock_booked< 0   
        THEN sb.stock_booked
    END AS samples_minus,
    /*----all Outlet Store bookings----*/
    CASE 
        WHEN sb.stock_booking_code = 3 AND sb.supplier_id IN (999992, 999998) AND sb.stock_booking_processing_state_number = 2 AND LOWER(sb.stock_booking_packing_slip_number) LIKE 'outlet%' 
        THEN sb.stock_booked
    END AS outlet_store_bookings   
    
FROM
	raw.stock_booked AS sb
	LEFT JOIN 
	bi.purchase_order po
        ON sb.purchase_order_id = po.purchase_order_id


