-- Name: ml.order_position_return_probability_estimation
-- Created: 2015-07-21 17:34:48
-- Updated: 2015-08-25 16:17:56

CREATE VIEW ml.order_position_return_probability_estimation
AS

WITH o_position AS
(
    SELECT
      coa_1.order_id,
      coa_1.order_position_id,
      coa_1.date_picked,
      coa_1.date_returned,
      coa_1.date_returned_online,
      coa_1.article_id,
      coa_1.articles_picked,
      coa_1.articles_returned,
      coa_1.articles_lost,
      coa_1.order_article_state_number,
      coa_1.articles_picked*coa_1.sales_in_local_currency/e.exchange_rate as sales_picked
    FROM raw.customer_order_articles coa_1
    LEFT JOIN raw.customer_order co on co.order_id=coa_1.order_id
    LEFT JOIN dwh.historical_exchange_rates e on e.currency_code = co.currency_code 
    AND COALESCE(cast(coa_1.date_picked as date),cast(co.date_invoiced as date)) = e.date
)

  SELECT 
  co.order_id, 
  co.shipping_country, 
  TIMESTAMPDIFF(SQL_TSI_YEAR, cast(cu.date_of_birth as date),co.date_created) as age_at_order_time,
  CASE  
    WHEN co.date_phone_call > '2012-05-10'  
      AND co.date_phone_call < TIMESTAMPADD(SQL_TSI_MONTH, 2, curdate())
      AND co.date_phone_call >= co.date_created 
      THEN 'Call Box'  
    WHEN co.sales_channel = 'clubWithCall' THEN 'Call Box' 
    ELSE 'No Call Box' 
  END as box_type,
  co.order_type,

  coa.date_picked, /*stylist picked date in amidala*/
  COALESCE(dd.date_shipped,co.date_shipped_internal) as date_shipped, /*date shipped is from doc_data*/
  coa.date_returned_online,
  COALESCE(cod.date_returned,co.date_returned) as date_returned,
  coa.date_returned as op_date_returned,
  COALESCE(cod.date_completed,co.date_completed) as date_completed,
  co.date_invoiced,
  coa.order_position_id,
  coa.sales_picked as item_value,
  op.articles_picked_sum as no_items_per_box,
  op.sales_picked_sum as box_value,
  CASE WHEN op.sales_picked_sum=0 THEN 0 ELSE sales_picked/sales_picked_sum END AS item_value_per_box,
  COALESCE(coa.articles_returned,coa.articles_lost,0) AS returned,
  it.category,
  it.product_group,
  /* Calculate the revenue state. If Estimated, then we will create a forecasted revenue */ 
  CASE
  	WHEN co.order_state = 'Completed'  
    	AND co.date_returned is null  
    	AND NOT COALESCE(co.billing_received_in_local_currency, arv.billing_received_arvato,0) > 1  
    	AND co.date_invoiced > TIMESTAMPADD(SQL_TSI_DAY, -70, CURDATE()) 
    THEN 1
    WHEN co.order_state in ('Returned', 'Completed') THEN 0 
    WHEN co.order_state = 'Cancelled' THEN 0 
    WHEN co.order_state_number < 512 AND TIMESTAMPDIFF(SQL_TSI_DAY, co.date_invoiced, CURDATE()) > 100 THEN 0 
    ELSE 1
  END as estimation_needed,
  
  CASE 
	WHEN preview_id IS NOT NULL THEN 1
	ELSE 0
  END AS has_preview,
  arv_2.billing_recieved,
  arv_2.date_paid

FROM o_position coa
LEFT JOIN raw.customer_order co ON Coa.order_id=co.order_id
LEFT JOIN raw.customer_order_details__audit_log cod on cod.order_id = co.order_id 
LEFT JOIN  
(
  SELECT 
    ss.order_id, 
    parsedate(min(ss.shipping_date), 'yyyyMMdd') as date_shipped 
  FROM raw.stock_shipped ss
  GROUP BY 1
) dd on dd.order_id = coa.order_id 
LEFT JOIN  
( 
  SELECT  
    ordernumber as order_id, 
    MIN(date_created) as date_arvato_paid, 
    SUM(amount) as billing_received_arvato 
  FROM dwh.arvato_payments ap 
  GROUP BY 1 
)arv on arv.order_id = co.order_id
LEFT JOIN  
(
    SELECT 
        co.order_id,
        min(coa.article_id) as min_article_id,
       /*takes arvato amount from dwh if payment type is arvato, for historical arvato customers billing recieved will be null*/
        avg(case when co.payment_type='Arvato' THEN arv_1.billing_received_arvato else co.billing_received_in_local_currency end) as billing_recieved,
        min(case when co.payment_type='Arvato' THEN arv_1.date_arvato_paid else co.date_paid end) as date_paid
    FROM raw.customer_order co 
    LEFT JOIN raw.customer_order_articles coa on coa.order_id=co.order_id
    LEFT JOIN  
    ( 
      SELECT  
        ordernumber as order_id, 
        MIN(date_created) as date_arvato_paid, 
        SUM(amount) as billing_received_arvato 
      FROM dwh.arvato_payments ap 
      GROUP BY 1 
   )arv_1 on arv_1.order_id = co.order_id 
   GROUP BY 1
) arv_2 on arv_2.order_id = co.order_id AND arv_2.min_article_id=coa.article_id
LEFT JOIN raw.customer cu on cu.customer_id = co.customer_id 
LEFT JOIN bi.item it on it.article_id=coa.article_id
LEFT JOIN 
(
  SELECT
    o_1.order_id,
    MIN(o_1.article_id) AS min_article_id,
    SUM(o_1.articles_picked) as articles_picked_sum,
    SUM(COALESCE(o_1.sales_picked,0)) as sales_picked_sum
  FROM o_position o_1
  GROUP BY 1
)op on op.order_id=coa.order_id
WHERE coa.order_article_state_number>=16 and coa.order_article_state_number<2048


