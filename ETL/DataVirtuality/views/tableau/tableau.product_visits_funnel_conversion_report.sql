-- Name: tableau.product_visits_funnel_conversion_report
-- Created: 2015-09-07 09:59:13
-- Updated: 2015-09-30 17:54:09

CREATE VIEW tableau.product_visits_funnel_conversion_report
AS

SELECT
  date_created,
  domain,
  marketing_channel as channel,
  devicecategory,
  visits,
  started_survey,
  completed_survey,
  account_created,
  size_details_added,
  personal_details_added,
  placed_first_order
FROM bi.marketing_funnel_by_date_domain_channel_device


