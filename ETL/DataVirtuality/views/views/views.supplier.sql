-- Name: views.supplier
-- Created: 2015-04-24 18:17:12
-- Updated: 2015-04-24 18:17:12

CREATE view views.supplier 
AS 
SELECT 
	su.id,
	su.version,
	su."name",
	su.active,
	su.address_id,
	su.contact_person,
	su.cross_docking,
	su.date_created,
	su.fax_number,
	su.last_updated,
	su.phone_number,
	su.address_city,
	su.address_co,
	su.address_country,
	su.address_street,
	su.address_street_number,
	su.address_zip,
	su.address_first_name,
	su.address_last_name,
	su.address_salutation,
	su.address_active,
	su.address_default_address
FROM postgres.supplier su


