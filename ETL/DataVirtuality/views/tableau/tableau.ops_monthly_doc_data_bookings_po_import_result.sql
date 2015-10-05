-- Name: tableau.ops_monthly_doc_data_bookings_po_import_result
-- Created: 2015-04-24 18:17:48
-- Updated: 2015-04-24 18:17:48

CREATE view tableau.ops_monthly_doc_data_bookings_po_import_result
as
SELECT a.outfittery_purchaseid, 
       a.date_created  AS po_import_result_max_date, 
       a.message, 
       a.processing_reason, 
       po.date_created AS po_date_created,
       dpo.doc_data_po_last_updated,
       sm.date_booked
FROM   (SELECT * 
        FROM   (SELECT Row_number() OVER (partition BY outfittery_purchaseid ORDER BY date_created DESC) AS rnum, 
                       outfittery_purchaseid, 
                       date_created, 
                       message, 
                       processing_reason 
                FROM   postgres.doc_data_purchase_order_import_result
                ) a 
        WHERE  rnum = 1
        ) a 
       JOIN postgres.purchase_order po 
       ON a.outfittery_purchaseid = po.id 
       LEFT JOIN	(select
       				outfittery_purchase_orderid,
       				max(last_updated) as doc_data_po_last_updated
       				FROM postgres.doc_data_purchase_order
       				GROUP BY 1
       			) dpo
       ON a.outfittery_purchaseid = dpo.outfittery_purchase_orderid
       LEFT JOIN (select
       			po_number,
       			max(date_created) as date_booked
       			FROM postgres.doc_data_stock_mutation
       			GROUP BY 1
       		) sm
       ON a.outfittery_purchaseid = sm.po_number


