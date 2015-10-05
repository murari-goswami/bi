Case : BI-1171

Anatomy for :: Analysis of return process time in PL 
-----------------------------------------------------------------------------------------------------------------------------------

1. Time of arrival of German returns in PL and time of returned.
    Q1 : Is this stands for Poland ??. If yes, Do we receive Poland information from the source.
    Q2 : "Time of return" - Doesit mean the shipping time and the return time.
    Q3 : Retrun order - are they "shipment_type" as "DHL RETOURE (returns)" OR "DHL PAKET/Rücksendung / Nachentgelt (returns/excess charge)"
         OR "DHL PAKET/Rücksendung (parcel returns)" OR "DHL RETOURE Sperrgut (returns bulky goods)"
         OR "DHL RETOURE (returns)(Germany)"
    Q4 : Is original order Id and the return order id will be the same ? In ordre to check for the original shipment day for  
         the main order from the customer_order table.     

2. If DHL has lost any parcels. Due to fact we can raise a claim at DHL within 48h after handing over parcels to our truck for Poland.
	Q1 : I want to understand, when a parcel is tagged as lost ?
	     If you can confirm from DHL website perspective, I can check that.
	Q2 : I can give this in a separate tabular format if I know the criteria of losing an article.     

3. This is for Germany required only, incl. ordernumber, DHL tracking and return number and needs to be updated every hour.
	Q1 : I want am not very clear of this sentence now. Can you please explain ?
	Q2 : Dom



==== Nothing much to do in the case. Its all about increasing the frequency. The rest part of this, where a new ETL routine needs to be established, we we have to work on this separatelly and we will see how we can benefit out of it through a separate project work as this will not be JIRA task for fixing any report or any ad hoc report out of the basket. ====


SQL Queries =>
--------------------------------------------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------------------------

ALTER view raw.customer_order_articles_logistics  
AS 
SELECT 
  ddsoh.orderid as order_id, 
  ddsol.outfittery_article_number AS article_id, 
  ddsoh.shipping_code, 
  ddsoh.sales_order_header_date, 
  ddsol.sales_order_line_date_created, 
  ddsol.sales_order_line_date_cancelled, 
  ddsoir.sales_order_import_result_date, 
  ddsoir.error_date, 
  ddsoir.error_message, 
  ddsosc.date_picklist_created, 
  ddsosc.date_backorder, 
  ddsosc.date_not_on_stock, 
  ddsc.date_created as shipment_confirmation_date, 
  ddsc.transport_company_code AS shipment_confirmation_transport_company_code, 
  ddms.receiver_country_code AS shipping_country, 
  ddms.date_created as shipment_manifest_date, 
  ddms.track_and_trace_number, 
  ddms.return_track_and_trace_number,
  left(ddms.processing_reason, 4000) as shipment_manifest_error, 
  ddr.date_created as return_date 
FROM 
/*---there are often multiple entries in doc_data_sales_order_header, because every time an order is adjusted (by finance or a line item is cancelled because it is out of stock) it is re-submitted. Therefore, always use the min ---*/ 
( 
  SELECT  
    a.orderid, 
    a.shipping_code, 
    min(a.date_created) AS sales_order_header_date 
  FROM postgres.doc_data_sales_order_header a 
  GROUP BY 1,2 
) AS ddsoh  
LEFT JOIN 
/*---quantity = 0 means that the articles is out of stock and will go on backorder. This leads to the item getting cancelled off of the order. Therefore the max date where quantity = 0 is sales_order_line_date_cancelled ---*/ 
( 
  SELECT 
    a.orderid, 
    a.outfittery_article_number, 
    a.line_number, 
    MIN(CASE WHEN a.quantity  = 1 THEN a.date_created END) AS sales_order_line_date_created, 
    CASE WHEN MIN(CASE WHEN a.quantity < 1 THEN a.date_created END) > MIN(CASE WHEN a.quantity = 1 THEN a.date_created END) 
          THEN MIN(CASE WHEN a.quantity < 1 THEN a.date_created END) 
            ELSE NULL END AS sales_order_line_date_cancelled 
    FROM 
    postgres.doc_data_sales_order_line a 
    group by 1,2,3 
) AS ddsol ON ddsoh.orderid = ddsol.orderid  
/*--- if the line item in doc_data_sales_order_import_result has a message, that means it is "on error" and requires action from operations. Sometimes a line entry with a message shows up with the  
error message, "No changes possible in order", after it has been shipped. These can be ignored.  ---*/ 
LEFT JOIN  
(SELECT  
    a.orderid, 
    a.line_number, 
    MIN(CASE WHEN a.message  = '' THEN a.date_created END) AS sales_order_import_result_date, 
    CASE WHEN MIN(CASE WHEN a.message != '' THEN a.date_created END) < MIN(b.date_created) 
        THEN MIN(CASE WHEN a.message != '' THEN a.date_created END) 
        ELSE NULL END AS error_date, 
    CASE WHEN MIN(CASE WHEN a.message != '' THEN a.date_created END) < MIN(b.date_created) 
        THEN max(a.message) 
        ELSE NULL END AS error_message 
    FROM postgres.doc_data_sales_order_import_result a 
    JOIN postgres.doc_data_shipment_confirmation b on b.orderid = a.orderid and b.line_number = a.line_number 
    GROUP BY 1,2 
) AS ddsoir ON ddsoir.orderid = ddsoh.orderid and ddsoir.line_number = ddsol.line_number  
LEFT JOIN 
  (SELECT  
 a.orderid, 
 a.customer_article_number,  
    MIN(CASE WHEN a.message  = 'PICKLIST CREATED' THEN a.date_created END) AS date_picklist_created, 
 CASE WHEN MIN(CASE WHEN a.message = 'BACKORDER' THEN a.date_created END) < MIN(CASE WHEN a.message  = 'PICKLIST CREATED' THEN a.date_created END)  
  THEN MIN(CASE WHEN a.message = 'BACKORDER' THEN a.date_created END)  
   WHEN MIN(CASE WHEN a.message  = 'PICKLIST CREATED' THEN a.date_created END) is null 
    THEN MIN(CASE WHEN a.message = 'BACKORDER' THEN a.date_created END)  
     ELSE NULL END AS date_backorder, 
 CASE WHEN MIN(CASE WHEN a.message = 'NOT ON STOCK' THEN a.date_created END) < MIN(CASE WHEN a.message  = 'PICKLIST CREATED' THEN a.date_created END)  
  THEN MIN(CASE WHEN a.message = 'NOT ON STOCK' THEN a.date_created END)  
   WHEN MIN(CASE WHEN a.message  = 'PICKLIST CREATED' THEN a.date_created END) is null 
    THEN MIN(CASE WHEN a.message = 'NOT ON STOCK' THEN a.date_created END)  
     ELSE NULL END AS date_not_on_stock 
 FROM postgres.doc_data_sales_order_status_change a  
 GROUP BY 1,2 
      ) ddsosc on ddsosc.orderid = ddsoh.orderid and ddsosc.customer_article_number = ddsol.outfittery_article_number 
/*--- shipment confirmation is the time that all the contents of the order has been collected and it needs to be packed and labeled  ---*/ 
LEFT JOIN postgres.doc_data_shipment_confirmation ddsc on ddsc.orderid = ddsoh.orderid and ddsc.outfittery_article_number = ddsol.outfittery_article_number  
/*--- the shipment manifest is received every night at 22:30 with the previous day's packed orders ---*/ 
LEFT JOIN postgres.doc_data_manifest_shipping ddms on ddms.orderid = ddsoh.orderid and ddms.outfittery_article_number =ddsol.outfittery_article_number 
LEFT JOIN postgres.doc_data_return ddr on ddr.original_orderid = ddsoh.orderid and ddr.outfittery_article_number =ddsol.outfittery_article_number
