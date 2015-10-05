-- Name: raw.customer_address
-- Created: 2015-09-09 14:18:26
-- Updated: 2015-09-09 14:18:26

create view raw.customer_address
as

select 
	ca.customer_addresses_id as customer_id,
	ca.address_id,
	ad.first_name,
	ad.last_name,
	ad.co,
	ad.street,
	ad.street_number,
	ad.city,
	ad.zip,
	ad.country,
	ad.active,
	ad.default_address
from "postgres.customer_address" ca
LEFT JOIN "postgres.address" ad on ca.address_id=ad.id


