-- Name: tableau.stylist_overview_dashboard_live_calls_today
-- Created: 2015-06-09 15:35:38
-- Updated: 2015-06-09 15:35:38

CREATE VIEW tableau.stylist_overview_dashboard_live_calls_today
AS

SELECT   
	CASE 
  		WHEN st.role = 'Fake' AND st.stylist_id != 118566682 THEN 'Fake Stylist ' || st.team
  		ELSE st.first_name || ' ' || st.last_name 
  		END as stylist_name,
  	st.team as stylist_team,
  	count(*) as orders
FROM postgres.customer_order co
LEFT JOIN bi.stylist st on st.stylist_id=co.stylelist_id
WHERE cast(phone_date as date)=curdate()
GROUP BY 1,2


