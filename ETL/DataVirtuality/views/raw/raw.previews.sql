-- Name: raw.previews
-- Created: 2015-04-24 18:17:44
-- Updated: 2015-04-24 18:17:44

CREATE VIEW raw.previews
AS
SELECT
	p.id as preview_id,
	p.name as preview_name,
	CASE WHEN p.name is not null THEN 'Topic Box' ELSE 'Showroom' END as preview_type,
	p.date_created as date_created
FROM postgres.preview p 
WHERE p.class = 'com.ps.customer.preview.Preview'


