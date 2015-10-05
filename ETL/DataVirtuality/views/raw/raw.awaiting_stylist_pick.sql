-- Name: raw.awaiting_stylist_pick
-- Created: 2015-04-24 18:19:38
-- Updated: 2015-04-24 18:19:38

CREATE VIEW raw.awaiting_stylist_pick AS

SELECT DISTINCT
 co.id AS order_id, 
 co.stylelist_id AS stylist_id,
 current_date AS date_awaiting_stylist_pick
FROM 
	postgres.customer_order co
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
AND co.state < 16
/* 128 */


