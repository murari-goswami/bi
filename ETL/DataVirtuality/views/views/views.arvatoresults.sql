-- Name: views.arvatoresults
-- Created: 2015-04-24 18:18:06
-- Updated: 2015-08-11 16:20:28

CREATE view views.arvatoresults
AS

WITH arv_rank as
(
SELECT
		ft.order_id,
		ft.customer_id,
		ft.date_created,
		ft.arvato_type as arvatotype,
		ft.arvato_result as arvatoresult,
		ft.arvato_order_limit as arvatoorderlimit,
		ft.response_code,
		ft.request_body,
		ft.valuation,
		ft.provider_transaction_id,
		row_number() over(partition by ft.order_id ORDER BY ft.date_created) AS rank
	FROM raw.financial_transactions ft
)
SELECT
	r1.order_id,
	r1.customer_id,
	r1.date_created as arv_date_created,
	r1.arvatoresult_1,
	r2.arvatoresult_2,
	r3.arvatoresult_3,
	/*Response Code*/
	r1.responseCode_1,
	r2.responseCode_2,
	r3.responseCode_3,
	/*Order Limit*/
	r1.arvatoorderlimit1,
	r2.arvatoorderlimit2,
	r3.arvatoorderlimit3,
	/*Valuation*/
	r1.valuation1,
	r2.valuation2,
	r3.valuation3,
	/*Request Code*/
	r1.requestbody_1,
	r2.requestbody_2,
	r3.requestbody_3,
	/*Provider Transaction ID*/
	r1.provider_transaction_id1,
	r2.provider_transaction_id2,
	r3.provider_transaction_id3,
	ft_value.avg_arvatoorderlimit,
	ft_value.max_valuation
FROM
(
	SELECT 
		order_id,
		customer_id,
		date_created,
		arvatoresult AS arvatoresult_1,
		response_code AS responseCode_1,
		request_body AS requestbody_1,
		arvatoorderlimit AS arvatoorderlimit1,
		valuation AS valuation1,
		provider_transaction_id AS provider_transaction_id1
	FROM arv_rank
	WHERE rank=1
)r1
LEFT JOIN
(
	SELECT 
		order_id,
		arvatoresult AS arvatoresult_2,
		response_code AS responseCode_2,
		request_body AS requestbody_2,
		arvatoorderlimit AS arvatoorderlimit2,
		valuation AS valuation2,
		provider_transaction_id AS provider_transaction_id2
	FROM arv_rank
	WHERE rank=2
)r2 on r2.order_id=r1.order_id
LEFT JOIN
(
	SELECT 
		order_id,
		arvatoresult AS arvatoresult_3,
		response_code AS responseCode_3,
		request_body AS requestbody_3,
		arvatoorderlimit AS arvatoorderlimit3,
		valuation AS valuation3,
		provider_transaction_id AS provider_transaction_id3
	FROM arv_rank
	WHERE rank=3
)r3 on r3.order_id=r1.order_id
LEFT JOIN
(
	SELECT
		order_id,
		max(valuation) AS max_valuation,
		avg(arvatoorderlimit) AS avg_arvatoorderlimit
	FROM arv_rank
	group by 1
) ft_value ON ft_value.order_id=r1.order_id


