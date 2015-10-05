-- Name: tableau.ops_lost_articles_stock_mutations_agg
-- Created: 2015-04-24 18:19:37
-- Updated: 2015-04-24 18:19:37

CREATE view tableau.ops_lost_articles_stock_mutations_agg
as
SELECT op.article_id, 
       op.lost_articles, 
       ddr.return_file_count, 
       sb.all_bookings, 
       sb.all_bookings_on_po, 
       sb.all_999998_bookings, 
       sb.all_999997_bookings, 
       sb.all_999996_bookings_plus,
       sb.all_999996_bookings_minus,
       sb.all_999995_bookings,  
       sb.all_999992_bookings, 
       sb.all_supplier_return_bookings, 
       sb.ch_return_bookings,
       sb.zalando_bookings,
       sb.zalando_return_bookings,
       sb.samples,
       sb.samples_plus,
       sb.samples_minus,
       sb.outlet_store_bookings 
FROM   (SELECT op.article_id, 
               count(op.article_id)    AS lost_articles 
        FROM   bi.customer_order_articles op
        WHERE  op.order_article_state_number = 1536 
        GROUP  BY 1
        ) op 
       LEFT JOIN (SELECT
                      sb.article_id,
                      sum(sb.stock_booked) AS all_bookings, 
                      sum(sb.po_bookings) AS all_bookings_on_po, 
                      sum(sb.manual_unbookings) AS all_999998_bookings, 
                      sum(sb.customer_returns) AS all_999997_bookings, 
                      sum(sb.picklist_plus) AS all_999996_bookings_plus,
                      sum(sb.picklist_minus) AS all_999996_bookings_minus,
                      sum(sb.cycle_counts) AS all_999995_bookings,  
                      sum(sb.custom_requests) AS all_999992_bookings, 
                      sum(sb.supplier_returns) AS all_supplier_return_bookings, 
                      sum(sb.swiss_returns) AS ch_return_bookings,
                      sum(sb.zalando_bookings) AS zalando_bookings,
                      sum(sb.zalando_returns) AS zalando_return_bookings,
                      sum(sb.samples) AS samples,
                      sum(sb.samples_plus) AS samples_plus,
                      sum(sb.samples_minus) AS samples_minus,
                      sum(sb.outlet_store_bookings) AS outlet_store_bookings
                  FROM bi.stock_booked sb
                  GROUP  BY 1
                  ) sb  ON sb.article_id = op.article_id 
       LEFT JOIN (SELECT r.outfittery_article_number, 
                         count(r.outfittery_article_number) AS return_file_count 
                  FROM   postgres.doc_data_return r
                  GROUP  BY 1
                  ) ddr ON op.article_id = ddr.outfittery_article_number


