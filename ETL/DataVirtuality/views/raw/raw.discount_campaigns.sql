-- Name: raw.discount_campaigns
-- Created: 2015-04-24 18:17:21
-- Updated: 2015-04-24 18:17:21

CREATE VIEW raw.discount_campaigns 
AS
SELECT
	c.id as campaign_id,
	c.code as discount_code,
	c.campaign_type,
	c.campaign_title,
	c.date_start as date_discount_start,
	c.date_end as date_discount_end,
	c.useable_amount as discount_usable_amount,
	c.currency as discount_currency,	
	c.discount_percentage,
	c.discount_absolute
FROM postgres.campaign c


