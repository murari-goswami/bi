-- Name: raw.customer_order_logistics
-- Created: 2015-04-24 18:17:47
-- Updated: 2015-04-24 18:17:47

CREATE view raw.customer_order_logistics
AS
SELECT aaaaa.*, MIN(r.date_created) as date_returned
FROM
(SELECT aaaa.*, MIN(sc.date_created) as date_shipment_confirmation
FROM
  (
  SELECT aaa.*, MIN(ms.date_created) as date_shipment_manifest
  FROM
    (
    SELECT 
      aa.*, 
      MIN(CASE WHEN p.message  = 'PICKLIST CREATED' THEN p.date_created END) AS date_picklist_created,
      CASE
        WHEN 
          MIN(CASE WHEN p.message != 'PICKLIST CREATED' THEN p.date_created END) /* AS date_picklist_not_created */
          < MIN(CASE WHEN p.message  = 'PICKLIST CREATED' THEN p.date_created END) /* AS date_picklist_created */ 
        THEN 
          MIN(CASE WHEN p.message != 'PICKLIST CREATED' THEN p.date_created END) /* AS date_picklist_not_created */
        WHEN 
          MIN(CASE WHEN p.message  = 'PICKLIST CREATED' THEN p.date_created END) is null
        THEN 
          MIN(CASE WHEN p.message != 'PICKLIST CREATED' THEN p.date_created END)
        ELSE
          NULL
        END AS date_backorder
    FROM
      (
      SELECT a.*, MIN(e.date_created) as date_on_error, MAX(e.message) as logistics_error_message
      FROM
        (
        SELECT 
          co.order_id, co.date_stylist_picked, co.country, co.state, MIN(h.date_created) as sales_order_header_created
        FROM 
              (SELECT
                 co.id as order_id,
                 co.date_picked as date_stylist_picked,
                 ad.country,
                 co.state
              FROM postgres.customer_order as co
              JOIN postgres.address ad on ad.id = co.shipping_address_id
              JOIN (select
          				order_id,
            			sum(state)/sum(quantity) as state_agg
            			FROM postgres.order_position
            			group by 1
              		) op on op.order_id = co.id
              	where state_agg < 1536
              ) co
          LEFT JOIN
          postgres.doc_data_sales_order_header h
             ON h.orderid = co.order_id
        WHERE co.state > 8
        and co.state < 1536
        GROUP BY 1,2,3,4
        ) a
        LEFT JOIN
        postgres.doc_data_sales_order_import_result e
           ON e.orderid = a.order_id
          AND e.message is not null
          AND e.message <> ''
      GROUP BY 1,2,3,4,5
      ) aa
      LEFT JOIN
        postgres.doc_data_sales_order_status_change p 
           ON p.orderid = aa.order_id
      GROUP BY 1,2,3,4,5,6,7
    ) aaa
    LEFT JOIN
    postgres.doc_data_manifest_shipping ms
         ON ms.orderid = aaa.order_id
        AND ms.processing_reason is null
      GROUP BY 1,2,3,4,5,6,7,8,9
  ) aaaa
  LEFT JOIN
  postgres.doc_data_shipment_confirmation sc 
    ON sc.orderid = aaaa.order_id
  GROUP BY 1,2,3,4,5,6,7,8,9,10
) aaaaa
LEFT JOIN 
postgres.doc_data_return r
   ON r.original_orderid = aaaaa.order_id
  AND r.processing_reason is null
GROUP BY 1,2,3,4,5,6,7,8,9,10,11


