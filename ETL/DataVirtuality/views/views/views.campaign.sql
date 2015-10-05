-- Name: views.campaign
-- Created: 2015-04-24 18:18:57
-- Updated: 2015-04-24 18:18:57

CREATE VIEW views.campaign 
AS
SELECT
campaign_id as id,
NULL as version,
discount_code as code,
date_discount_start as date_start,
date_discount_end as date_end,
discount_usable_amount as useable_amount,
discount_percentage,
discount_absolute,
campaign_type,
campaign_title,
discount_currency as currency
FROM raw.discount_campaigns c


