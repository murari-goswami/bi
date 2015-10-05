-- Name: raw.customer_order_logists_outbound_sla
-- Created: 2015-04-24 18:19:18
-- Updated: 2015-05-12 15:02:56

CREATE VIEW raw.customer_order_logists_outbound_sla 
AS

WITH sla AS
(
  SELECT 
    CAST(order_id AS LONG) AS order_id,
    sla_date_start,
    sla_date_start_adjusted,
    date_shipment_confirmation_max,
    date_shipped,
    b.next_ship_day,
    /* all orders that are received before 14 on a work day, must ship same day. All orders received after 14, must ship the following day */
    case 
      when cast(sla_date_start_adjusted as date) >= cast(date_shipment_confirmation_max as date) then 'on_time'
      when hour(sla_date_start_adjusted) >= 14 and cast(timestampadd(SQL_TSI_DAY,+1,sla_date_start) as date) = cast(date_shipment_confirmation_max as date) then 'on_time'
      when hour(sla_date_start_adjusted) >= 14 and b.next_ship_day = cast(date_shipment_confirmation_max as date) then 'on_time'
      else 'late' 
    end as sla_performance,
  sum(cal2.working_days) as sla_working_days
  FROM 
  (
    SELECT
      order_id,
      sla_date_start,
      next_ship_day,
      /* sometimes the start day is on a weeked or holiday, so we need to push the start day to the next work day at 8am */
      case 
        when working_days = 1 then cast((cal.business_day)||' '||(cast(a.sla_date_start as time)) as timestamp)
        when working_days = 0 then cast((cal.business_day)||' '||(parseTime ('08:00:00', 'HH:mm:ss')) as timestamp)
        else null 
      end as "sla_date_start_adjusted",
      date_shipment_confirmation_max,
      date_shipped
    FROM 
    (
      SELECT
      /* for the start day, we, ideally, want to take sales order import result, bit if the order goes on backorder, that's our fault and doc data's performance should not be impacted. 
      Therefore, we take max picklist created date for orders that have had the backorder status; if it didnt go backorder/not on stock, then take the date from the sales order import results */
        ddms.order_id,
        case 
          when  plc.PLC_status_max_date < ddsoir.max_date_created then plc.PLC_status_max_date
          when bo.bo_status_max_date is null then ddsoir.max_date_created else plc.plc_status_max_date 
        end as "sla_date_start",
        ddsc.max_date_created as "date_shipment_confirmation_max",
        parsedate(min(ddms.shipping_date), 'yyyyMMdd') as date_shipped
      FROM raw.stock_shipped ddms
      
      JOIN 
      (
        SELECT 
          order_id, 
          max(date_stock_imported) as max_date_created 
        FROM raw.stock_imported 
        GROUP BY 1
      )ddsoir ON ddsoir.order_id = ddms.order_id
    
      JOIN 
      (
        SELECT 
          order_id, 
          max(date_stock_shipped) as max_date_created 
        FROM raw.stock_shipped
        GROUP BY 1
      )ddsc ON ddsc.order_id = ddms.order_id
      
      JOIN
      (
        SELECT 
          order_id,
          max(date_status_change) as plc_status_max_date
        FROM raw.stock_sales_order_status_change  
        WHERE message = 'PICKLIST CREATED' 
        GROUP BY 1
      )PLC ON ddms.order_id = PLC.order_id
      
      left join
      (
        SELECT 
          order_id,
          max(date_status_change) as bo_status_max_date
        FROM raw.stock_sales_order_status_change 
        WHERE message = 'BACKORDER' 
        OR message = 'NOT ON STOCK'
        GROUP BY 1
      ) BO ON ddms.order_id = BO.order_id
      
      WHERE shipping_date > 20130630
      /*----eliminate outlet order_ids----*/
      AND receiver_company not in ('Outfittery', 'Outfittery Outlet')
      AND receiver_name not in ('Outfittery GmbH', 'Outfittery GMBH', 'Outfittery  GmbH', 'Outfittery   GmbH', 'OUTFITTERY Stylist', 'Salesorder OUTFITTERY Einkauf')
      GROUP BY 1,2,3
    ) a
    left join dwh.calendar cal on cast(sla_date_start as date) = cal."date"
  ) b
  left join dwh.calendar cal2 on cal2."date" between cast(b.sla_date_start_adjusted as date) and cast(b.date_shipment_confirmation_max as date)
  WHERE order_id NOT LIKE '% %' /* TO GET RID OF BAD ORDER ID */
  group by 1,2,3,4,5,6
)


SELECT
  sla.order_id,
  sla.sla_date_start,
  sla.sla_date_start_adjusted,
  sla.date_shipment_confirmation_max AS sla_date_shipment_confirmation,
  sla.date_shipped  AS sla_date_shipped,
  sla.next_ship_day  AS sla_next_ship_day,
  sla.sla_performance,
  sla.sla_working_days,
  CASE
    WHEN sla.sla_working_days = 1     THEN TIMESTAMPDIFF(SQL_TSI_HOUR, sla.sla_date_start_adjusted, sla.date_shipment_confirmation_max)
    WHEN sla.sla_working_days IS NULL   THEN TIMESTAMPDIFF(SQL_TSI_HOUR, sla.sla_date_start, sla.date_shipment_confirmation_max)
    WHEN sla.sla_working_days > 1     THEN ((sla.sla_working_days-2)*24) + (24 - HOUR(sla.sla_date_start_adjusted)) + HOUR(sla.date_shipment_confirmation_max)
  END AS sla_hours
FROM sla


