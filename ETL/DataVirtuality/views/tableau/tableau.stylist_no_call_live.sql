-- Name: tableau.stylist_no_call_live
-- Created: 2015-06-10 09:39:57
-- Updated: 2015-09-11 15:06:24

CREATE VIEW tableau.stylist_no_call_live
AS

SELECT  
	co.id,
	co.date_created,
	st_c.stylist as customer_stylist,
	st_c.team as customer_stylist_team,
	CASE
	    WHEN cos.salesforce_order_stage = 'Datum vorschlagen' THEN 'Suggest date' 
	    WHEN cos.salesforce_order_stage in ('Artikel bestellen', 'order articles') THEN 'Order articles' 
	    WHEN cos.salesforce_order_stage in ('Feedback zur Bestellung einholen', 'get feedback') THEN 'Get feedback' 
	    WHEN cos.salesforce_order_stage in ('Termin ausmachen', 'arrange a date') THEN 'Arrange a date' 
	    WHEN cos.salesforce_order_stage in ('Inaktiv', 'inactive') THEN 'Inactive' 
	    WHEN cos.salesforce_order_stage = 'on hold' THEN 'On hold' 
	    WHEN cos.salesforce_order_stage in ('Packen', 'packing') THEN 'Packing' 
	    WHEN cos.salesforce_order_stage in ('Informationen vervollständigen', 'complete information') THEN 'Complete information' 
	    WHEN cos.salesforce_order_stage in ('abgeschloßen & Nachbereitung', 'completed & postprocessing') THEN 'Completed & Follow-up'  
	    WHEN cos.salesforce_order_stage = 'Vorschau erstellen' THEN 'Create preview' 
	    WHEN cos.salesforce_order_stage is null THEN 'Order not synced' 
	    ELSE 'Ask BI'
	END as order_sales_stage,
	CASE 
		WHEN CAST(co.date_created AS DATE)>=TIMESTAMPADD(SQL_TSI_WEEK, -4,CURDATE()) THEN 1 
		ELSE 0 
	END AS last_4_week
FROM postgres.customer_order co
LEFT JOIN bi.stylist st_c on st_c.stylist_id = co.stylelist_id
LEFT JOIN raw.customer_order_salesforce cos on cos.order_id=co.id
LEFT JOIN
(
  SELECT 
    customer_id,
    count(*) as nb_orders
  FROM postgres.customer_order 
  GROUP BY 1
)f_order on f_order.customer_id=co.customer_id
WHERE nb_orders=1
AND co.phone_date is null
AND cos.ops_check='OK'
AND cos.preview_not_liked='false'


