-- Name: bi.customer_order_articles
-- Created: 2015-04-24 18:18:02
-- Updated: 2015-09-15 13:54:45

CREATE VIEW bi.customer_order_articles
AS

SELECT
  coa.order_position_id,
  coa.order_id,
  coa.group_id,
  coa.outfit_id,
  coa.article_id,
  coa.stock_location_id,
  coa.supplier_article_id,
  coa.supplier_order_number,
  coa.track_and_trace_number,
  coa.order_position_count,
  coa.order_article_state,
  coa.order_article_state_number,
  i.brand,
  coa.articles_picked,
  coa.articles_sent,
  coa.articles_kept,
  coa.articles_returned,
  coa.articles_lost,
  
  coa.articles_picked*coa.sales_in_local_currency/e.exchange_rate as sales_picked,
  coa.articles_sent*coa.sales_in_local_currency/e.exchange_rate as sales_sent,
  coa.articles_kept*coa.sales_in_local_currency/e.exchange_rate as sales_kept,
  coa.articles_returned*coa.sales_in_local_currency/e.exchange_rate as sales_returned,
  coa.articles_lost*coa.sales_in_local_currency/e.exchange_rate as sales_lost,

  coa.articles_picked*CASE WHEN opfpp.purchase_price_fixed is not null THEN opfpp.purchase_price_fixed ELSE coa.cost END as cost_picked,
  coa.articles_sent*CASE WHEN opfpp.purchase_price_fixed is not null THEN opfpp.purchase_price_fixed ELSE coa.cost END as cost_sent,
  coa.articles_kept*CASE WHEN opfpp.purchase_price_fixed is not null THEN opfpp.purchase_price_fixed ELSE coa.cost END as cost_kept,
  coa.articles_returned*CASE WHEN opfpp.purchase_price_fixed is not null THEN opfpp.purchase_price_fixed ELSE coa.cost END as cost_returned,
  coa.articles_lost*CASE WHEN opfpp.purchase_price_fixed is not null THEN opfpp.purchase_price_fixed ELSE coa.cost END as cost_lost,

 /*Estimation on Sales*/

  return_probability IS NULL "estimation_missing",
  
  COALESCE(CASE 
            WHEN coa.order_article_state_number=512 and revenue_state='Final' then coa.sales_in_local_currency/e.exchange_rate
            WHEN coa.order_article_state_number=2048 THEN 0
            ELSE (coa.sales_in_local_currency/e.exchange_rate)*return_probability
    END,0) as sales_returned_est,
    COALESCE(CASE 
            WHEN coa.order_article_state_number=1024 and revenue_state='Final' then coa.sales_in_local_currency/e.exchange_rate
            WHEN coa.order_article_state_number=2048 THEN 0
            ELSE (coa.sales_in_local_currency/e.exchange_rate)*(1-return_probability)
    END,0) as sales_kept_est,
    /*Own Stock Sales Estimation*/
    COALESCE(CASE 
            WHEN coa.order_article_state_number=512 and coa.stock_location_id=2 and revenue_state='Final' then coa.sales_in_local_currency/e.exchange_rate
            WHEN coa.order_article_state_number=2048 THEN 0
            WHEN coa.order_article_state_number=512 and coa.stock_location_id=2 and revenue_state<>'Final' then (coa.sales_in_local_currency/e.exchange_rate)*return_probability
    END,0) as own_stock_sales_returned_est,
    COALESCE(CASE 
            WHEN coa.order_article_state_number=1024 and coa.stock_location_id=2 and revenue_state='Final' then coa.sales_in_local_currency/e.exchange_rate
            WHEN coa.order_article_state_number=2048 THEN 0
            WHEN coa.order_article_state_number=1024 and coa.stock_location_id=2 and revenue_state<>'Final' then (coa.sales_in_local_currency/e.exchange_rate)*(1-return_probability)
    END,0) as own_stock_sales_kept_est,
    /*Patner Stock Sales Estimation*/
    COALESCE(CASE 
            WHEN coa.order_article_state_number=512 and coa.stock_location_id<>2 and revenue_state='Final' then coa.sales_in_local_currency/e.exchange_rate
            WHEN coa.order_article_state_number=2048 THEN 0
            WHEN coa.order_article_state_number=512 and coa.stock_location_id<>2 and revenue_state<>'Final' then (coa.sales_in_local_currency/e.exchange_rate)*return_probability
    END,0) as partner_stock_sales_returned_est,
    COALESCE(CASE 
            WHEN coa.order_article_state_number=1024 and coa.stock_location_id<>2 and revenue_state='Final' then coa.sales_in_local_currency/e.exchange_rate
            WHEN coa.order_article_state_number=2048 THEN 0
            WHEN coa.order_article_state_number=1024 and coa.stock_location_id<>2 and revenue_state<>'Final' then (coa.sales_in_local_currency/e.exchange_rate)*(1-return_probability)
    END,0) as partner_stock_sales_kept_est,

    COALESCE(CASE 
            WHEN coa.order_article_state_number=512 and revenue_state='Final' THEN coa.cost 
            WHEN coa.order_article_state_number=2048 THEN 0
            ELSE coa.cost*return_probability 
    END,0) as cost_returned_est,
    COALESCE(CASE 
            WHEN coa.order_article_state_number=1024 and revenue_state='Final' THEN coa.cost 
            WHEN coa.order_article_state_number=2048 THEN 0
            ELSE coa.cost*(1-return_probability) 
    END,0) as cost_kept_est,

    /*Cost-Own Stock*/
    COALESCE(CASE 
            WHEN coa.order_article_state_number=512 and coa.stock_location_id=2 and revenue_state='Final' THEN coa.cost 
            WHEN coa.order_article_state_number=2048 THEN 0
            WHEN coa.order_article_state_number=512 and coa.stock_location_id=2 and revenue_state<>'Final' THEN coa.cost*return_probability 
    END,0) as own_stock_cost_returned_est,
    COALESCE(CASE 
            WHEN coa.order_article_state_number=1024 and coa.stock_location_id=2 and revenue_state='Final' THEN coa.cost
            WHEN coa.order_article_state_number=2048 THEN 0
            WHEN coa.order_article_state_number=1024 and coa.stock_location_id=2 and revenue_state<>'Final' THEN coa.cost*(1-return_probability) 
    END,0) as own_stock_cost_kept_est,
    /*Cost-Partner Stock*/
    COALESCE(CASE 
            WHEN coa.order_article_state_number=512 and coa.stock_location_id<>2 and revenue_state='Final' THEN coa.cost 
            WHEN coa.order_article_state_number=2048 THEN 0
            WHEN coa.order_article_state_number=512 and coa.stock_location_id<>2 and revenue_state<>'Final' THEN coa.cost*return_probability 
            END,0) as partner_stock_cost_returned_est,
    COALESCE(CASE 
            WHEN coa.order_article_state_number=1024 and coa.stock_location_id<>2 and revenue_state='Final' THEN coa.cost
            WHEN coa.order_article_state_number=2048 THEN 0
            WHEN coa.order_article_state_number=1024 and coa.stock_location_id<>2 and revenue_state<>'Final' THEN coa.cost*(1-return_probability) 
    END,0) as partner_stock_cost_kept_est,
  
  coa.date_created,
  coa.date_picked,
  coa.date_cancelled,
  coa.date_returned,
  coa.date_shipped,
  coa.date_incoming,
  coa.date_returned_online,
  coa.date_lost, 

  /*Feedback Reasons*/
  coa.feedback_damaged,
  coa.feedback_was_dirty,
  coa.feedback_late_delivery,
  coa.feedback_good_colour,
  coa.feedback_good_quality,
  coa.feedback_good_fit,
  coa.feedback_good_match_to_customers_style,
  coa.feedback_dont_like_style,
  coa.feedback_not_needed,
  coa.feedback_would_like_to_try_something_new,
  coa.feedback_bad_fit,
  coa.feedback_too_big,
  coa.feedback_too_small,
  coa.feedback_too_short,
  coa.feedback_too_long,
  coa.feedback_too_tight,
  coa.feedback_too_wide,
  coa.feedback_too_outrageous,
  coa.feedback_too_simple,
  coa.feedback_too_cheap,
  coa.feedback_too_expensive,
  coa.feedback_too_low_quality,
  coa.feedback_dont_like_the_brand,
  coa.feedback_dont_like_the_pattern,
  coa.feedback_dont_like_the_colour,
  coa.feedback_fraud,
  coa.feedback_comment
FROM raw.customer_order_articles coa
JOIN raw.customer_order co ON co.order_id = coa.order_id
LEFT JOIN bi.item i on i.article_id=coa.article_id
LEFT JOIN dwh.historical_exchange_rates e on e.currency_code = co.currency_code AND cast(co.date_invoiced as date) = e.date
LEFT JOIN dwh.order_position_fixed_purchase_prices opfpp on coa.order_position_id = opfpp.order_position_id
LEFT JOIN raw.return_rate_probability rp on rp.order_position_id=coa.order_position_id
/*This join is used to apply right estimation on order position*/
LEFT JOIN
(
  SELECT 
    co.order_id,
  CASE
    WHEN co.order_state = 'Completed'
        AND co.date_returned is null  
          AND COALESCE(co.billing_received_in_local_currency, arv.billing_received_arvato,0) < 1
          AND co.date_invoiced > TIMESTAMPADD(SQL_TSI_DAY, -70, CURDATE()) 
          THEN 'Estimated' 
      WHEN co.order_state in ('Returned', 'Completed') THEN 'Final'     
      WHEN co.order_state = 'Cancelled' THEN null 
      WHEN co.order_state_number < 512 AND TIMESTAMPDIFF(SQL_TSI_DAY, co.date_invoiced, CURDATE()) > 100 THEN null     
      ELSE 'Estimated'
     END as revenue_state
  FROM raw.customer_order co 
  LEFT JOIN
  ( 
    SELECT
      ordernumber as order_id, 
          MIN(date_created) as date_arvato_paid, 
          SUM(amount) as billing_received_arvato 
        FROM dwh.arvato_payments ap 
        GROUP BY 1
  )arv on arv.order_id = co.order_id
)a on a.order_id=coa.order_id


