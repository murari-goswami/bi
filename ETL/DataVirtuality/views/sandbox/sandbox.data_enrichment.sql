-- Name: sandbox.data_enrichment
-- Created: 2015-08-28 10:06:31
-- Updated: 2015-08-28 10:06:31

create view sandbox.data_enrichment
as

with c_order as
(
	SELECT
	  rank() OVER(PARTITION BY co.customer_id ORDER BY co.date_created desc) as rank_cust,
	  co.id,
	  co.customer_id,
	  CASE WHEN ship_add.salutation = 1 THEN 'Herr' WHEN ship_add.salutation = 2 then 'Frau' ELSE null END as ship_salutation,
	  INITCAP(ship_add.last_name) as shipping_last_name,
	  INITCAP(ship_add.first_name) as shipping_first_name,
	  INITCAP(ship_add.street) as shipping_street,
	  ship_add.street_number as shipping_street_number,
	      CASE 
	    WHEN ship_add.country='A' THEN 'AT'
	    WHEN ship_add.country='' THEN null
	    ELSE ship_add.country 
	  END as shipping_country,
	  INITCAP(ship_add.city) as shipping_city,
	  ship_add.zip as shipping_zip,
	  ship_add.co as shipping_co,
	  INITCAP(bill_add.last_name) as billing_last_name,
	  INITCAP(bill_add.first_name) as billing_first_name,
	  INITCAP(bill_add.street) as billing_street,
	  bill_add.street_number as billing_street_number,
	    CASE
	    WHEN bill_add.country='A' then 'AT'
	    WHEN bill_add.country='' THEN null
	    ELSE bill_add.country 
	  END as billing_country,
	  INITCAP(bill_add.city) as billing_city,
	  bill_add.zip as billing_zip,
	  bill_add.co as billing_co,
	  p.email
	FROM postgres.customer_order co
	LEFT JOIN postgres.address as ship_add on ship_add.id = co.shipping_address_id
	LEFT JOIN postgres.address as bill_add on bill_add.id = co.billing_address_id
	LEFT JOIN postgres.principal p on p.id=co.customer_id
)
select * from c_order
where rank_cust=1 and customer_id
in
(
  10120508,
13151566,
40147041,
48426436,
48658733,
58121159,
66643213,
72748276,
73596758,
78642078,
79478773,
82027463,
107131214,
122339407,
132125991,
196069981,
196435918,
215700193,
220888447,
235955415,
236948421
)


