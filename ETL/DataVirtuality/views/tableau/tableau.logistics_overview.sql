-- Name: tableau.logistics_overview
-- Created: 2015-04-24 18:19:37
-- Updated: 2015-04-24 18:19:37

CREATE view tableau.logistics_overview
AS
SELECT 
distinct co.id as order_id, 
co.country, 
co.date_picked, 
ddsoir.order_on_error, 
ddsoh.transmitted_pending_shipment, 
bo.backorder_orderid, 
bo.picklist_created_pending_shipment, 
ddsc.packed_order, 
ddms.shipped_order, 
st.awaiting_stylist_pick,
ddr.returned_order
from  
( 
  SELECT 
  co.id,
  co.state,
  co.date_picked,
  co.shipping_address_id,
  ad.country
  from
  (select 
    id,
    state,
    cast((case when date_picked is null then current_date else date_picked end) as date)as "date_picked",
    shipping_address_id
    FROM postgres.customer_order
    where cast(date_created as date) > '2014-01-01'
    and cast(date_picked as date) > timestampadd(sql_tsi_month,-2,curdate())
    and state < 1536
  ) co
  left join 
  (
    SELECT
    order_id as canceled_order,
    state_agg
    FROM (select
          order_id,
            sum(state)/sum(quantity) as state_agg
            FROM postgres.order_position
            group by 1
          ) op 
    where state_agg = 2048
    ) op
  on op.canceled_order = co.id
  inner join 
  (
    SELECT 
    id, 
    country 
    FROM postgres.address
  ) ad 
  on ad.id = co.shipping_address_id
  where op.canceled_order is null
) co
left join 
/* ----order status---- */
(
    SELECT
  sosc.orderid,
  case when message<> 'PICKLIST CREATED' then sosc.orderid  else null end as backorder_orderid,
  case when message = 'PICKLIST CREATED' then sosc.orderid  else null end as picklist_created_pending_shipment
  FROM
  (
   SELECT 
    row_number() over (partition by a.orderid order by a.date_created desc) as rnum, 
    a.orderid, 
    a.message 
    from postgres.doc_data_sales_order_status_change a
    left join (SELECT orderid from postgres.doc_data_shipment_confirmation) b on a.orderid = b.orderid
    where b.orderid is null
  ) sosc
  where rnum = 1 
) bo  on bo.orderid = co.id
left join
/* ----all orders on error: these errors appear in the message field in the sales order import result and usually require some type of action---- */
(
  SELECT 
  ddsoir.orderid as order_on_error 
  FROM 
  (
    SELECT 
    orderid, 
    message from postgres.doc_data_sales_order_import_result group by 1,2
  ) ddsoir 
  left join 
  (
    SELECT 
    orderid from postgres.doc_data_sales_order_status_change
  ) ddsosc 
  on ddsosc.orderid = ddsoir.orderid 
  where ddsosc.orderid is null 
  and message <> ''
) ddsoir
on ddsoir.order_on_error = co.id
left join 
/* ----all orders that have been transmitted to doc data (verified by the receipt of the sales order header) and have made it to the picklist creation (which happens at 7am and 2pm)---- */
(
  SELECT 
  a.orderid as transmitted_pending_shipment
  FROM 
  (
    SELECT 
    ddsoh.orderid from postgres.doc_data_sales_order_header ddsoh 
    left join 
    (
      SELECT 
      orderid from postgres.doc_data_sales_order_status_change
    ) ddsosc on ddsosc.orderid = ddsoh.orderid
    where ddsosc.orderid is null
    group by 1
  ) a
) ddsoh
on ddsoh.transmitted_pending_shipment = co.id
left join 
/* ----all orders that have been added to the shipment confirmation, i.e. all items have been pulled for packing (packing takes about 10 minutes), but are not on the shipment manifest (transmitted 1x per day at 22:30)---- */
(
  SELECT 
  ddsc.orderid as packed_order 
  FROM postgres.doc_data_shipment_confirmation ddsc 
  left join postgres.doc_data_manifest_shipping ddms 
  on ddsc.orderid = ddms.orderid 
  where ddms.orderid is null
  group by 1
) ddsc
on ddsc.packed_order = co.id
left join 
/* ----all orders on the shipment manifest---- */
(
  SELECT 
  orderid as shipped_order, 
  cast(shipping_date as date) as shipping_date from postgres.doc_data_manifest_shipping
) ddms
on ddms.shipped_order = co.id
left join
/* ----all orders awaiting to be picked---- */
(
SELECT 
 co.id AS awaiting_stylist_pick, 
 co.stylelist_id AS stylist_id,
 current_date AS date_picked
FROM postgres.customer_order co
 	JOIN 
 	bi.customer_order_salesforce sfo 
		ON sfo.order_id = co.id
 	LEFT JOIN 
 	bi.stylist st
 		 ON co.stylelist_id = st.stylist_id
 		AND st.stylist NOT IN ('Eve Rosenthal','Doreen Jansen','Ria Herzog','Lea Maler','Katrin Svensson','Nicole Eden','Lisa Fuchs','Mandy Brunnecker')
WHERE 
	sfo.ops_check = 'OK' 
AND sfo.salesforce_order_stage = 'Artikel bestellen'
AND co.state < 128
) st 
on st.awaiting_stylist_pick = co.id
left join
/* ----all orders that have been returned---- */
(select
ddr.original_orderid as returned_order
FROM postgres.doc_data_return ddr
) ddr
on ddr.returned_order = co.id


