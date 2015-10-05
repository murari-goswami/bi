-- Name: bi.stylist
-- Created: 2015-04-24 18:19:24
-- Updated: 2015-08-24 16:54:59

CREATE VIEW bi.stylist
AS

SELECT
	stylist_id,
	salesforce_customer_id,
	role,
	enabled,
	callable,
	balancer_enabled,
	real_stylist,
	first_name,
	last_name,
	stylist_original,
	stylist_email,
	stylist,
	team,
	profile_name,
	/*Düsseldorf Stylist list is provided by Sales Controlling team
	DUS-Düsseldorf Stylist, BER-Berlin Stylist*/
	CASE 
		WHEN stylist IN ('Stefanie Eisend','Nici Mai','Daniel Bergmann','Jonas Zimmermann','Tabea Koschmal','Estelle Schuessler','Eve Rosenthal','Eleni Tarso','Desiree Herbst')
		 THEN 'DUS'
		ELSE 'BER'
	END AS stylist_group,
	 CASE  
  		WHEN callable=false OR balancer_enabled=false THEN 'No Call Stylist' 
  		ELSE 'Call Stylist' 
 		END AS call_group, 
	balance_strategy_resolver_string
FROM raw.stylist


