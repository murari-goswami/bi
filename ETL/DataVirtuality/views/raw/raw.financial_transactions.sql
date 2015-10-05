-- Name: raw.financial_transactions
-- Created: 2015-04-24 18:17:20
-- Updated: 2015-04-24 18:17:20

CREATE VIEW raw.financial_transactions
AS
SELECT 
a.id as financial_transaction_id,
a.order_id,
a.customer_id,
a.date_created,
a.provider,
a.transaction_id,
a.provider_transaction_id,
a.provider_transaction_token,
a.status,
a.valuation, 
LEFT(ftd.arvatotype, 4000) as arvato_type,
CAST(LEFT(ftd.arvatoorderlimit, 4000) as float) as arvato_order_limit,
LEFT(ftd.arvatoresult, 4000) as arvato_result,
CAST(LEFT(ftd.arvatoscore, 4000) as integer) as arvato_score,
LEFT(a.response_code, 4000) as response_code,
LEFT(a.request_body, 4000) as request_body,
LEFT(a.response_body, 4000) as response_body
FROM postgres.financial_transaction a
JOIN postgres.financial_transaction_details ftd on a.id = ftd.id


