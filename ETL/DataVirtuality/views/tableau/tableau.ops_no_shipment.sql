-- Name: tableau.ops_no_shipment
-- Created: 2015-04-24 18:19:27
-- Updated: 2015-04-27 16:33:43

CREATE VIEW tableau.ops_no_shipment
AS

SELECT
  dt.order_id,
  dt.tracking_number,
  dt.slug,
  origin_country_iso3,
  col.return_track_and_trace_number,
  CASE 
  	WHEN dt.tracking_number=col.return_track_and_trace_number THEN 'Return Link'
  	ELSE 'Tracking Link'
  END as link_type,
  dt.tag,
  col.date_shipped,
  col.date_returned,
  CASE 
    WHEN origin_country_iso3 in ('DEU','BEL') then dt1.info_recieved_date
    WHEN origin_country_iso3 in ('CHE','AUT') then dt1.intransit_date
    ELSE dt1.init_created
  END AS start_date,
  dt1.info_recieved_date,
  dt1.intransit_date,
  dt1.outfordelivery_date,
  dt1.attemptfail_date,
  dt1.exception_date,
  dt1.expired_date,
  dt1.delivered_date
FROM
(
  SELECT * 
  FROM bi.delivery_tracking 
  WHERE rank=1
)dt
LEFT JOIN bi.customer_order_logistics col on col.order_id=dt.order_id and (col.track_and_trace_number=dt.tracking_number or col.return_track_and_trace_number=dt.tracking_number)
LEFT JOIN
(
  SELECT
  order_id,
  tracking_number,
    COUNT(order_id) AS nb_of_lines,
    COUNT(CASE WHEN tag='AttemptFail' THEN order_id ELSE NULL END) AS nb_of_attemptfails,
    COUNT(CASE WHEN tag='Exception' THEN order_id ELSE NULL END) AS nb_of_exceptions,
    MAX(CASE WHEN tag='Init' THEN created_at ELSE NULL END) AS init_created,
    MAX(CASE WHEN tag='InfoReceived' THEN updated_at ELSE NULL END) AS info_recieved_date,
    MAX(CASE WHEN tag='InTransit' THEN updated_at ELSE NULL END) AS intransit_date,
    MAX(CASE WHEN tag='OutForDelivery' THEN updated_at ELSE NULL END) AS outfordelivery_date,
    MAX(CASE WHEN tag='AttemptFail' THEN updated_at ELSE NULL END) AS attemptfail_date,
    MAX(CASE WHEN tag='Exception' THEN updated_at ELSE NULL END) AS exception_date,
    MAX(CASE WHEN tag='Expired' THEN updated_at ELSE NULL END) AS expired_date,
    MAX(CASE WHEN tag='Delivered' THEN updated_at ELSE NULL END) AS delivered_date
  FROM bi.delivery_tracking
  GROUP BY 1,2
)dt1 on dt.order_id=dt1.order_id and dt.tracking_number=dt1.tracking_number


