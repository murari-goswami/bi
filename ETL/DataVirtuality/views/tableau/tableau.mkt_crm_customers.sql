-- Name: tableau.mkt_crm_customers
-- Created: 2015-06-01 17:21:27
-- Updated: 2015-08-25 16:15:41

CREATE VIEW tableau.mkt_crm_customers
AS

SELECT
	c.customer_id,
	c.email,
	c.first_name,
	c.last_name,
	c.token,
	c.default_domain,
    CASE WHEN c.gender = 'Male' THEN 'Herr' ELSE 'Frau' END as anrede,
    c.formal as du_sie,
	case
		when c.gender= 'Male' THEN 'Lieber'
		when c.gender= 'Female' THEN 'Liebe'
	end AS "begruessung",
	c.date_created,
	c.subscribe_status,
	c.subscribed_to_sms,
	c.phone_number,
  	co.order_id,
  	co.shipping_country,
  	co.shipping_first_name,
  	co.shipping_last_name,
  	co.sales_channel,
  	st.stylist,
  	st.first_name as stylist_firstname,
    st.last_name as stylist_lastname,
  	st_o.stylist as stylist_order,
  	st_o.first_name as stylist_firstname_order,
    st_o.last_name as stylist_lastname_order,
    do.funnel_status,
    do.last_order_date
from bi.customer c
LEFT JOIN bi.customer_order co on co.customer_id=c.customer_id
LEFT JOIN raw.customer_salesforce sal on sal.customer_id = c.customer_id
LEFT JOIN bi.stylist st on st.stylist_id=c.new_stylist_id
LEFT JOIN bi.stylist st_o on st_o.stylist_id=co.stylist_id
/* For deciding whether someone is a no-call dropoff */
LEFT JOIN
(
	SELECT 
	    cu.customer_id,
	    co.last_order_date,
	    CASE
	        WHEN co.last_delivery_date is not null THEN 'Invoiced order'
	        WHEN co.no_call_funnel_dropoffs > 0 THEN 'No-call dropoff'
	        WHEN co.website_funnel_dropoffs > 0 THEN 'Other dropoff'
	        ELSE 'Other'
	    END AS funnel_status
	FROM bi.customer cu
	LEFT JOIN
  	(
    	SELECT
		    customer_id,
		    MAX(date_invoiced) as last_delivery_date,
		    MAX(date_incoming) as last_order_date,
		    SUM(CASE WHEN sales_channel = 'websiteWithoutDateAndPendingConfirmation' THEN 1 ELSE 0 END) AS no_call_funnel_dropoffs,
		    SUM(CASE WHEN sales_channel = 'website' THEN 1 ELSE 0 END) AS website_funnel_dropoffs
    	FROM bi.customer_order
    	WHERE is_real_order='Real Order'
    	GROUP BY 1
  	) co ON co.customer_id = cu.customer_id
) do ON c.customer_id = do.customer_id
where c.email not like '%invalid%'


