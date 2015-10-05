-- Name: tableau.ops_error_log_not_checked_out_with_states
-- Created: 2015-06-24 10:54:17
-- Updated: 2015-06-24 12:03:57

CREATE VIEW tableau.ops_error_log_not_checked_out_with_states AS

SELECT
	coa.order_id,
	coa.article_id,
	co.order_type,
	co.order_state_number,
	order_state,
	coa.order_article_state_number,
	coa.order_article_state,
	coa.date_created
FROM
	bi.customer_order AS co
	JOIN
	bi.customer_order_articles AS coa
		ON co.order_id = coa.order_id
WHERE
		co.date_preview_created IS NULL
	AND	coa.order_article_state_number = 8
	AND coa.date_created >= timestampadd(SQL_TSI_day, -5, curdate())


