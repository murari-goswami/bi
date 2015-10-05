-- Name: tableau.ops_delivery_return_tracking
-- Created: 2015-09-23 11:39:04
-- Updated: 2015-09-23 17:57:14

CREATE VIEW "tableau.ops_delivery_return_tracking"
AS

SELECT 
	a.order_id,
	a.tracking_number,
	a.date_transmission_to_carrier,
	a.date_1st_scan_by_carrier,
	COALESCE(a.date_received,a.date_delivered_to_customer,a.date_1st_scan_by_carrier) AS date_delivered_to_customer,
	col.date_returned,
	co.shipping_country
FROM
(  
  SELECT
  	order_id,
  	tracking_number,
  	MAX(CASE WHEN tag='InfoReceived' THEN updated_at ELSE NULL END) AS date_transmission_to_carrier,
    MIN(CASE WHEN tag='InTransit' THEN updated_at ELSE NULL END) AS date_1st_scan_by_carrier,
    MAX(CASE WHEN tag='Delivered' THEN updated_at ELSE NULL END) AS date_delivered_to_customer,
    MAX(CASE 
    		WHEN tag='Delivered' AND active=false THEN 
    		CASE WHEN tag='InfoReceived' THEN updated_at ELSE NULL END 
    	ELSE NULL END) as date_received
  FROM bi.delivery_tracking
  GROUP BY 1,2
)a
JOIN bi.customer_order_logistics col on col.order_id=a.order_id and col.return_track_and_trace_number=a.tracking_number
LEFT JOIN bi.customer_order co ON co.order_id=a.order_id


