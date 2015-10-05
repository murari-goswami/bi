-- Name: raw.customer_order_state_number
-- Created: 2015-04-24 18:17:51
-- Updated: 2015-04-24 18:17:51

CREATE VIEW raw.customer_order_state_number AS

/*	CERTAIN FIELDS ARE BEING BROUGHT INTO THIS QUERY THAT WOULD OTHERWISE COME DIRECTLY FROM BI.CUSTOMER_ORDER. THE REASON FOR THAT IS BECAUSE THIS IS UPDATED HOURLY, NOT DAILY */

SELECT 
  	co.id AS order_id,
  	co.state AS order_state_number,
  	co.date_created,
  	co.date_picked AS date_stylist_picked,
  	ad.country AS shipping_country
FROM 
  	postgres.customer_order co
  	JOIN
  	postgres.address ad
  		ON co.shipping_address_id = ad.id
  	LEFT JOIN
	(
	  	SELECT DISTINCT
	      order_id
	    FROM 
	    	postgres.order_position
	    GROUP BY 1
	    HAVING 
	    	SUM(state)/SUM(quantity) = 2048
	) op
		 ON co.id = op.order_id
WHERE 
	co.state < 1536
AND op.order_id IS NULL


