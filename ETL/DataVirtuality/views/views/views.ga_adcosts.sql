-- Name: views.ga_adcosts
-- Created: 2015-04-24 18:17:13
-- Updated: 2015-04-24 18:17:13

CREATE view views.ga_adcosts
AS
SELECT
	date_created,
	country,
	source,
	medium,
	campaign,
	adcosts
FROM dwh.ga_adcosts


