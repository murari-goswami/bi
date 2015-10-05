-- Name: tableau.ops_delivery_tracking
-- Created: 2015-04-24 18:20:59
-- Updated: 2015-09-23 11:40:27

CREATE view tableau.ops_delivery_tracking 
AS

SELECT
  dt.order_id,
  dt.tracking_number,
  CASE 
  	WHEN col.date_returned IS NOT NULL and dt1.date_delivered_to_customer IS NULL then 'deliverd'
  	ELSE dt.tag 
  END AS tag,
  dt.active,
  dt.shipment_type,
  dt.slug AS carrier,
  CASE
  WHEN dt.shipment_type like ('%Rücksendung%') OR dt.shipment_type like ('%returned%') then
'return/refusal'
    WHEN (dt1.date_1st_attemptfail is not null OR dt1.date_1st_attemptfail='' OR dt1.date_1st_exception is not null OR dt1.date_1st_exception='') and dt1.date_delivered_to_customer is null then 'non-delivered after exception/attemptfail'
    WHEN (dt1.date_1st_attemptfail is not null OR dt1.date_1st_attemptfail='' OR dt1.date_1st_exception is not null OR dt1.date_1st_exception='') and dt1.date_delivered_to_customer is not null then 'delivered after exception/attemptfail'
    WHEN dt1.date_1st_attemptfail is null And dt1.date_1st_exception is null and dt1.date_delivered_to_customer is not null  THEN 'delivered without exceptions/attemptfails'
    ELSE 'non-delivered' 
  END AS delivery_state_with_exceptions,
  dt1.nb_of_tracking_events,
  dt1.nb_of_exceptions,
  dt1.nb_of_attemptfails,
  co.date_submitted,
  dt1.date_transmission_to_aftership, /*this date is set by IT after we get shippment label*/
  dt1.date_transmission_to_carrier,
  dt1.date_1st_scan_by_carrier,
  dt1.date_1st_out_for_delivery,
  dt1.date_1st_attemptfail,
  dt1.date_1st_exception,
  dt1.expired_date,
  dt1.date_delivered_to_customer,
  /*Customer Order Details*/
  co.order_state,
  co.order_type,
  co.payment_type,
  co.shipping_first_name,
  co.shipping_last_name,
  co.shipping_co,
  co.shipping_street,
  co.shipping_street_number,
  co.shipping_city,
  co.shipping_zip,
  co.shipping_country,
  /*Customer Order Logistics*/
  col.return_track_and_trace_number,
  col.date_shipped,
  col.date_returned
FROM
(
  SELECT * 
  FROM bi.delivery_tracking 
  WHERE rank=1
)dt
JOIN bi.customer_order_logistics col on col.order_id=dt.order_id and col.track_and_trace_number=dt.tracking_number
LEFT JOIN
(
  SELECT
  	order_id,
  	tracking_number,
    COUNT(order_id) AS nb_of_tracking_events,
    COUNT(CASE WHEN tag='AttemptFail' THEN order_id ELSE NULL END) AS nb_of_attemptfails,
    COUNT(CASE WHEN tag='Exception' THEN order_id ELSE NULL END) AS nb_of_exceptions,
    MAX(CASE WHEN tag='Init' THEN created_at ELSE NULL END) AS date_transmission_to_aftership,
    MAX(CASE WHEN tag='InfoReceived' THEN updated_at ELSE NULL END) AS date_transmission_to_carrier,
    MIN(CASE WHEN tag='InTransit' THEN updated_at ELSE NULL END) AS date_1st_scan_by_carrier,
    MIN(CASE WHEN tag='OutForDelivery' THEN updated_at ELSE NULL END) AS date_1st_out_for_delivery,
    MIN(CASE WHEN tag='AttemptFail' THEN updated_at ELSE NULL END) AS date_1st_attemptfail,
    MIN(CASE WHEN tag='Exception' THEN updated_at ELSE NULL END) AS date_1st_exception,
    MAX(CASE WHEN tag='Expired' THEN updated_at ELSE NULL END) AS expired_date,
    MAX(CASE WHEN tag='Delivered' THEN updated_at ELSE NULL END) AS date_delivered_to_customer
  FROM bi.delivery_tracking
  GROUP BY 1,2
)dt1 on dt.order_id=dt1.order_id and dt.tracking_number=dt1.tracking_number
LEFT JOIN bi.customer_order co on co.order_id=dt.order_id
LEFT JOIN dwh.calendar ca on ca."date"=cast(dt1.date_delivered_to_customer as date)


