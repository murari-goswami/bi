-- Name: tableau.billing_arvato_checklist_red_dark
-- Created: 2015-04-24 18:24:52
-- Updated: 2015-07-30 17:59:04

CREATE view tableau.billing_arvato_checklist_red_dark
AS
SELECT 
	fd.order_id,
	fd.customer_id,
	fd.fd_date_created,
	fd.customer_order_date_created,
	fd.arvatoresult_1,
	fd.provider_transaction_id1,
	cu.default_page
FROM views.financial_data fd
JOIN views.customer cu on cu.customer_id=fd.customer_id
WHERE arvatoresult_1='RED_DARK'


