-- Name: tableau.bisdev_country_mismatch
-- Created: 2015-09-08 18:10:49
-- Updated: 2015-09-08 18:11:53

CREATE view tableau.bisdev_country_mismatch
as

select 
	co.order_id,
	co.customer_id,
	cu.first_name,
	cu.last_name,
	cu.email,
	cu.phone_number,
    billing_first_name, 
    billing_last_name, 
    billing_co
    billing_street, 
    billing_street_number, 
    billing_zip, 	
	billing_city,
    billing_country, 
	shipping_first_name, 
	shipping_last_name, 
	shipping_co,
	shipping_street, 
	shipping_street_number, 
	shipping_zip, 
	shipping_city,
	shipping_country, 
	cu.default_domain
from bi.customer_order co
left join bi.customer cu on cu.customer_id=co.customer_id
where cu.default_domain<>'COM'
and cu.default_domain<>co.shipping_country


