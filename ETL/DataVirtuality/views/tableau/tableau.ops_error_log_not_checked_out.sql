-- Name: tableau.ops_error_log_not_checked_out
-- Created: 2015-04-24 18:17:50
-- Updated: 2015-04-24 18:17:50

CREATE view tableau.ops_error_log_not_checked_out
AS
SELECT 
order_id,
date_created as order_position_date_created,
article_id,
state
FROM postgres.order_position 
where state = 8
and cast(date_created as date) >= timestampadd(SQL_TSI_day, -5, curdate())


