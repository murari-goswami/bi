-- Name: tableau.ops_dpd_test
-- Created: 2015-06-12 15:16:52
-- Updated: 2015-06-12 15:16:52

CREATE view tableau.ops_dpd_test
AS

SELECT 
  co.id, 
  INITCAP(ship_add.first_name) as shipping_first_name,
  INITCAP(ship_add.last_name) as shipping_last_name,
  INITCAP(ship_add.street) as shipping_street,
  ship_add.street_number as shipping_street_number,
  INITCAP(ship_add.co) as shipping_co,
  ship_add.zip as shipping_zip,
  INITCAP(ship_add.city) as shipping_city,
  CASE 
  WHEN ship_add.country='A' THEN 'AT'
  WHEN ship_add.country='' THEN null
  ELSE ship_add.country 
  END as shipping_country
FROM postgres.customer_order co
JOIN postgres.address as ship_add on ship_add.id = co.shipping_address_id
where cast(date_picked as date)=curdate()
and country='DE'


