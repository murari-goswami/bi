-- Name: raw.order_comment
-- Created: 2015-09-28 15:52:55
-- Updated: 2015-09-28 15:52:55

CREATE VIEW raw.order_comment
AS

SELECT 
	order_id,
	date_create as date_created,
	comment,
	user_name
FROM postgres.order_comment oc


