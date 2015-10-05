CREATE OR REPLACE VIEW datamart.fact_order
AS

WITH o_position AS
(
	SELECT
	coa.order_position_id,
	coa.order_id,
	coa.state,
	coa.quantity,

	coa.items_picked_wt_can,
	coa.items_picked,
	coa.items_kept,
	coa.items_returned,
	coa.items_lost,
	coa.items_cancelled,

	/*Sales in Local Currency*/
	coa.items_picked_wt_can*coa.sales_in_local_currency as sales_picked_wt_can_in_local_currency,
	coa.items_picked*coa.sales_in_local_currency as sales_picked_in_local_currency,
		coa.items_kept*coa.sales_in_local_currency as sales_kept_in_local_currency,
		coa.items_returned*coa.sales_in_local_currency as sales_returned_in_local_currency,
		coa.items_lost*coa.sales_in_local_currency as sales_lost_in_local_currency,
		coa.items_cancelled*coa.sales_in_local_currency as sales_cancelled_in_local_currency,
		/*COALESCE(
				CASE 
						WHEN coa.state=512 then coa.sales_in_local_currency
						ELSE coa.sales_in_local_currency*return_probability 
				END,0)*/0 as sales_returned_est_in_local_currency,
		/*COALESCE(
				CASE 
						WHEN coa.state=1024 then coa.sales_in_local_currency
						ELSE coa.sales_in_local_currency*(1-return_probability)
				END,0)*/0 as sales_kept_est_in_local_currency,

	/*Sales In Euros*/
	coa.items_picked_wt_can*coa.sales_in_local_currency/e.exchange_rate	as sales_picked_wt_can_in_eur,
	coa.items_picked*coa.sales_in_local_currency/e.exchange_rate as sales_picked_in_eur,
	coa.items_kept*coa.sales_in_local_currency/e.exchange_rate as sales_kept_in_eur,
	coa.items_returned*coa.sales_in_local_currency/e.exchange_rate as sales_returned_in_eur,
	coa.items_lost*coa.sales_in_local_currency/e.exchange_rate as sales_lost_in_eur,
	coa.items_cancelled*coa.sales_in_local_currency/e.exchange_rate as sales_cancelled_in_eur,
	/*COALESCE(
		CASE 
			WHEN coa.state=512 then coa.sales_in_local_currency/e.exchange_rate
			ELSE (coa.sales_in_local_currency/e.exchange_rate)*return_probability 
		END,0)*/0 as sales_returned_est_in_eur,
	/*COALESCE(
		CASE 
			WHEN coa.state=1024 then coa.sales_in_local_currency/e.exchange_rate
			ELSE (coa.sales_in_local_currency/e.exchange_rate)*(1-return_probability)
		END,0)*/0 as sales_kept_est_in_eur,
	/*COST*/
	coa.items_picked_wt_can*CASE WHEN opfpp.purchase_price_fixed is not null THEN opfpp.purchase_price_fixed ELSE coa.cost_in_eur END as cost_picked_with_can,
		coa.items_picked*CASE WHEN opfpp.purchase_price_fixed is not null THEN opfpp.purchase_price_fixed ELSE coa.cost_in_eur END as cost_picked,
		coa.items_kept*CASE WHEN opfpp.purchase_price_fixed is not null THEN opfpp.purchase_price_fixed ELSE coa.cost_in_eur END as cost_kept,
		coa.items_returned*CASE WHEN opfpp.purchase_price_fixed is not null THEN opfpp.purchase_price_fixed ELSE coa.cost_in_eur END as cost_returned,
		coa.items_lost*CASE WHEN opfpp.purchase_price_fixed is not null THEN opfpp.purchase_price_fixed ELSE coa.cost_in_eur END as cost_lost,
		coa.items_cancelled*CASE WHEN opfpp.purchase_price_fixed is not null THEN opfpp.purchase_price_fixed ELSE coa.cost_in_eur END as cost_cancelled,

	/*COALESCE(CASE WHEN coa.state=512 THEN coa.cost_in_eur ELSE coa.cost_in_eur*return_probability END,0)*/0 as cost_returned_est,
	/*COALESCE(CASE WHEN coa.state=1024 THEN coa.cost_in_eur ELSE coa.cost_in_eur*(1-return_probability) END,0)*/0 as cost_kept_est

	FROM stage.v_fact_order_position coa
	JOIN stage.v_dim_customer_order co ON co.order_id = coa.order_id
	LEFT JOIN datamart.historical_exchange_rates e on e.currency_code = co.country_code_iso AND cast(co.date_invoiced as date) = e.date
	LEFT JOIN datamart.order_position_fixed_purchase_prices opfpp on coa.order_position_id = opfpp.order_position_id
	--LEFT JOIN stage.return_rate_probability rp on rp.order_position_id=coa.order_position_id
)

SELECT
	op_1.order_id,
	op_1.items_b4_can,
	op_1.items_cancelled,
	op_1.items_b4_ret,
	op_1.items_returned,
	op_1.items_kept,
	op_1.gross_sales_b4_can_in_eur,
	op_1.gross_sales_can_in_eur,
	op_1.gross_sales_b4_ret_in_eur,
	op_1.gross_sales_ret_in_eur,
	op_1.gross_sales_ret_est_in_eur,
	COALESCE(op_1.sales_kept_in_eur,op_1.sales_kept_est_in_eur) as gross_sales_expected_in_eur,
	op_1.gross_sales_b4_can_in_local_currency,
	op_1.gross_sales_can_in_local_currency,
	op_1.gross_sales_b4_ret_in_local_currency,
	op_1.gross_sales_ret_in_local_currency,
	op_1.gross_sales_ret_est_in_local_currency,
	co_1.discount_goodwill as discount_goodwill_in_local_currency,
	COALESCE(op_1.sales_kept_in_local_currency,op_1.sales_kept_est_in_local_currency) as gross_sales_expected_in_local_currency,
	op_1.cogs_b4_can,
	op_1.cogs_cancelled,
	op_1.cogs_b4_ret,
	op_1.cogs_ret,
	op_1.cogs_ret_est,
	COALESCE(op_1.cogs_kept,op_1.cogs_kept_est) as cogs_expected,
	co_1.discount_total,
	co_2.date_amount_paid,
	CASE	
			WHEN COALESCE(op_1.sales_kept_in_local_currency,op_1.sales_kept_est_in_local_currency) - co_1.discount_total < 0 THEN 0 
			ELSE COALESCE(op_1.sales_kept_in_local_currency,op_1.sales_kept_est_in_local_currency) - co_1.discount_total 
		END as billing_total,
		co_2.billing_received,
		CASE	
			WHEN COALESCE(op_1.sales_kept_in_local_currency,op_1.sales_kept_est_in_local_currency) - co_1.discount_total < 0 THEN 0 
			ELSE COALESCE(op_1.sales_kept_in_local_currency,op_1.sales_kept_est_in_local_currency) - co_1.discount_total
		END - co_2.billing_received as billing_open,

		CASE	
			WHEN COALESCE(op_1.sales_kept_in_local_currency,op_1.sales_kept_est_in_local_currency) - co_1.discount_total < 0 THEN 0 
			ELSE COALESCE(op_1.sales_kept_in_local_currency,op_1.sales_kept_est_in_local_currency) - co_1.discount_total
		END * (v.vat_rate/(1 + v.vat_rate)) as billing_vat, 
		CASE	
		
			WHEN COALESCE(op_1.sales_kept_in_local_currency,op_1.sales_kept_est_in_local_currency) - co_1.discount_total < 0 THEN 0 
			ELSE COALESCE(op_1.sales_kept_in_local_currency,op_1.sales_kept_est_in_local_currency) - co_1.discount_total
		END / (1 + v.vat_rate) as billing_net_sales

FROM
(
	SELECT
			op.order_id,
			SUM(op.items_picked_wt_can) as items_b4_can,
			SUM(op.items_cancelled) as items_cancelled,
		SUM(op.items_picked) as items_b4_ret,
			SUM(COALESCE(op.items_returned, 0) + COALESCE(op.items_lost, 0)) as items_returned,
			SUM(op.items_kept) as items_kept,
			/*Sales in EUROs-Datamart*/
				SUM(op.sales_picked_wt_can_in_eur) as gross_sales_b4_can_in_eur,
		SUM(op.sales_cancelled_in_eur) as gross_sales_can_in_eur,
				SUM(op.sales_picked_in_eur) as gross_sales_b4_ret_in_eur,
				SUM(COALESCE(op.sales_returned_in_eur, 0) + COALESCE(op.sales_lost_in_eur, 0)) as gross_sales_ret_in_eur, 
				SUM(op.sales_returned_est_in_eur) as gross_sales_ret_est_in_eur,
				SUM(op.sales_kept_in_eur) as sales_kept_in_eur,
				SUM(op.sales_kept_est_in_eur) as sales_kept_est_in_eur,
				/*Sales in Local Currency-Datamart*/
				SUM(op.sales_picked_wt_can_in_local_currency) as gross_sales_b4_can_in_local_currency,
		SUM(op.sales_cancelled_in_local_currency) as gross_sales_can_in_local_currency,
				SUM(op.sales_picked_in_local_currency) as gross_sales_b4_ret_in_local_currency,
				SUM(COALESCE(op.sales_returned_in_local_currency, 0) + COALESCE(op.sales_lost_in_local_currency, 0)) as gross_sales_ret_in_local_currency, 
				SUM(op.sales_returned_est_in_local_currency) as gross_sales_ret_est_in_local_currency,
				SUM(op.sales_kept_in_local_currency) as sales_kept_in_local_currency, 
				SUM(op.sales_kept_est_in_local_currency) as sales_kept_est_in_local_currency,
				/*COGS (currency is always in EUR)-Datamart*/
			SUM(op.cost_picked_with_can) as cogs_b4_can,
			SUM(op.cost_cancelled) as cogs_cancelled, 
			SUM(op.cost_picked) as cogs_b4_ret,
			SUM(COALESCE(op.cost_returned, 0) + COALESCE(op.cost_lost, 0)) as cogs_ret,
			SUM(op.cost_returned_est) AS cogs_ret_est,
			SUM(op.cost_kept) as cogs_kept,
			SUM(op.cost_kept_est) AS cogs_kept_est

	FROM o_position op
	GROUP BY op.order_id
)op_1
LEFT JOIN stage.v_dim_customer_order co_1 on co_1.order_id=op_1.order_id
LEFT JOIN datamart.calendar c on c.date = cast(co_1.date_invoiced as date)
LEFT JOIN datamart.vat_rates v on v.year_month = c.year_month AND co_1.shipping_country = v.country_code_iso
LEFT JOIN
(
	SELECT
		c.order_id,
		/*billing recieved arvato customers is uploaded in dwh from arvato ftp server*/
		COALESCE(CASE 
			WHEN c.payment_type<>'Arvato' THEN c.total_amount_payed
			ELSE arv.billing_received_arvato
		END,0) AS billing_received,
		CASE
			WHEN c.payment_type<>'Arvato' THEN c.date_paid
			ELSE arv.date_arvato_paid
		END AS date_amount_paid
	FROM stage.v_dim_customer_order c
	LEFT JOIN
	(
		SELECT	
			ordernumber as order_id, 
			MIN(date_created) as date_arvato_paid, 
			SUM(amount) as billing_received_arvato 
		FROM datamart.arvato_payments ap 
		GROUP BY 1 
	)arv on arv.order_id = cast(c.order_id as varchar)
)co_2 on co_1.order_id=co_2.order_id