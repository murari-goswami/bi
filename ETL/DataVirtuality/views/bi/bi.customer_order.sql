-- Name: bi.customer_order
-- Created: 2015-04-24 18:19:34
-- Updated: 2015-09-18 17:44:18

CREATE view bi.customer_order
as

WITH rev AS
( 
  /* At this top-level we apply forecast return rates to estimate revenue for non-completed orders */ 
  SELECT 
    x.order_id, 
 
    /* If all articles on an order are cancelled, then set the order_state as 'Cancelled' */ 
    CASE WHEN x.article_cancellation_state = 1 THEN null ELSE x.revenue_state END as revenue_state, 
    CASE  
      WHEN x.revenue_state = 'Final' AND x.articles_sent = x.articles_kept THEN 'All Kept' 
      WHEN x.revenue_state = 'Final' AND x.articles_sent = x.articles_returned THEN 'All Returned' 
      WHEN x.revenue_state = 'Estimated' THEN 'Open' 
      WHEN x.revenue_state = 'Final' AND x.articles_returned > 0 THEN 'Returned' 
      ELSE null 
    END as kept_state, 

    CASE  
      WHEN x.article_cancellation_state = 1 THEN 'Cancelled'  
      WHEN x.revenue_state is null THEN 'Cancelled' 
      ELSE null  
    END as order_state, 

    CASE  
      WHEN x.article_cancellation_state = 1 THEN 2048  
      WHEN x.revenue_state is null THEN 2048 
      ELSE null  
    END as order_state_number,

    x.exchange_rate, 
    x.articles_picked, 
    x.articles_sent, 
    CASE WHEN x.revenue_state = 'Final' THEN COALESCE(x.articles_kept, 0) ELSE x.articles_kept END as articles_kept, 
    CASE WHEN x.revenue_state = 'Final' THEN COALESCE(x.articles_returned, 0) ELSE x.articles_returned END as articles_returned, 
    x.sales_picked, 
    x.sales_sent, 
    /* If the order is finalised, then simply take the current state. Otherwise use the forecast return rate to calculated kept & returned 
       NOTE: once we have good billing information, we can build that into this logic, but for now it's commented out. 
     */ 
    CASE 
      WHEN x.revenue_state = 'Final' then x.sales_sent - COALESCE(x.sales_returned, 0)
      ELSE x.sales_kept_est 
    END AS sales_kept,
    CASE 
      WHEN x.revenue_state = 'Final' then x.sales_returned
      ELSE x.sales_returned_est
    END AS sales_returned,

    x.cost_picked, 
    x.cost_sent, 
    CASE 
      WHEN x.revenue_state = 'Final' then x.cost_kept
      ELSE x.cost_kept_est 
    END AS cost_kept,
    CASE 
      WHEN x.revenue_state = 'Final' then x.cost_returned
      ELSE x.cost_returned_est
    END AS cost_returned,

    x.own_stock_articles_sent,

    CASE WHEN x.revenue_state = 'Final' AND x.own_stock_articles_sent > 0 THEN COALESCE(x.own_stock_articles_kept, 0) ELSE x.own_stock_articles_kept END as own_stock_articles_kept, 
    
    CASE WHEN x.revenue_state = 'Final' AND x.own_stock_articles_sent > 0 THEN COALESCE(x.own_stock_articles_returned, 0) ELSE x.own_stock_articles_returned END as own_stock_articles_returned, 
    
    COALESCE(x.own_stock_sales_sent,x.own_stock_sales_picked) as own_stock_sales_sent, 

    x.own_stock_sales_kept_est as own_stock_sales_kept,
    
    CASE WHEN x.revenue_state = 'Final' AND x.own_stock_sales_sent > 0 
      THEN COALESCE(x.own_stock_sales_returned, 0)  
      ELSE x.own_stock_sales_returned_est
    END as own_stock_sales_returned, 
    
    COALESCE(x.own_stock_cost_sent,x.own_stock_cost_picked) as own_stock_cost_sent, 
    
    CASE WHEN x.revenue_state = 'Final' THEN x.own_stock_cost_kept
      ELSE x.own_stock_cost_kept_est 
    END as own_stock_cost_kept, 
    
    CASE WHEN x.revenue_state = 'Final' AND x.own_stock_cost_sent > 0 
      THEN COALESCE(x.own_stock_cost_returned, 0)  
      ELSE x.own_stock_cost_returned_est
    END as own_stock_cost_returned,
    x.partner_articles_sent,
    
    CASE WHEN x.revenue_state = 'Final' AND x.partner_articles_sent > 0 THEN COALESCE(x.partner_articles_kept, 0) ELSE x.partner_articles_kept END as partner_articles_kept, 
    
    CASE WHEN x.revenue_state = 'Final' AND x.partner_articles_sent > 0 THEN COALESCE(x.partner_articles_returned, 0) ELSE x.partner_articles_returned END as partner_articles_returned, 
    
    COALESCE(x.partner_sales_sent,x.partner_sales_picked) as partner_sales_sent, 
    
    CASE WHEN x.revenue_state = 'Final' THEN x.partner_sales_sent - COALESCE(x.partner_sales_returned, 0)
      else x.partner_stock_sales_kept_est 
    end as partner_sales_kept, 
    
    CASE WHEN x.revenue_state = 'Final' AND x.partner_sales_sent > 0 
      THEN COALESCE(x.partner_sales_returned, 0) 
      ELSE x.partner_stock_sales_returned_est 
    END as partner_sales_returned, 
    
    COALESCE(x.partner_cost_sent,x.partner_cost_picked) as partner_cost_sent, 
    
    CASE WHEN x.revenue_state = 'Final' THEN x.partner_cost_kept
      ELSE x.partner_stock_cost_kept_est 
    END as partner_cost_kept, 
    
    CASE WHEN x.revenue_state = 'Final' AND x.partner_cost_sent > 0 
      THEN COALESCE(x.partner_cost_returned, 0) 
      ELSE x.partner_stock_cost_returned_est 
    END as partner_cost_returned,

    CASE 
      WHEN x.revenue_state = 'Final' then x.own_stock_sales_sent_wo_ph - COALESCE(x.own_stock_sales_returned_wo_ph, 0)
      ELSE x.own_stock_sales_kept_wo_ph_est
    END as own_stock_sales_kept_wo_ph,

    CASE 
      WHEN x.revenue_state = 'Final' then x.own_stock_cost_kept_wo_ph
    ELSE x.own_stock_cost_kept_wo_ph_est 
    end as own_stock_cost_kept_wo_ph, 

    CASE 
      WHEN x.revenue_state = 'Final' then x.paul_hunter_sales_sent - COALESCE(x.paul_hunter_sales_returned, 0)
      ELSE x.paul_hunter_sales_kept_est 
    end as paul_hunter_sales_kept, 

    CASE 
      WHEN x.revenue_state = 'Final' then x.paul_hunter_cost_kept
      ELSE x.paul_hunter_cost_kept_est 
    END as paul_hunter_cost_kept, 
    
    x.discount_total, 
    x.discount_goodwill, 
    x.discount_marketing, 
    x.discount_paid_voucher, 
    x.billing_received, 
    x.date_paid
  FROM  
  ( 
    SELECT  
    /* Use the customer_order_articles subquery as the base, but we need to add a few things in from customer_order here */ 
      coa.*,  
      co.order_state, 
      co.order_state_number,
      co.sales_channel,
      cu.phone_number,
      co.date_preview_created,
      
    /* Calculate the revenue state. If Estimated, then we will create a forecasted revenue */ 
      CASE  
        WHEN co.order_state = 'Completed'  
          AND co.date_returned is null  
          AND NOT COALESCE(co.billing_received_in_local_currency, arv.billing_received_arvato,0) > 1  
          AND co.date_invoiced > TIMESTAMPADD(SQL_TSI_DAY, -70, CURDATE()) 
          THEN 'Estimated' 
        WHEN co.order_state in ('Returned', 'Completed') THEN 'Final' 
        WHEN co.order_state = 'Cancelled' THEN null 
        WHEN co.order_state_number < 512 AND TIMESTAMPDIFF(SQL_TSI_DAY, co.date_invoiced, CURDATE()) > 100 THEN null 
        ELSE 'Estimated' 
      END as revenue_state,   
 
    /* Apply exchange rates where needed */ 
      CAST(e.exchange_rate as decimal) as exchange_rate, 
      co.discount_total_in_local_currency/e.exchange_rate as discount_total, 
      co.discount_goodwill_in_local_currency/e.exchange_rate as discount_goodwill, 
      co.discount_marketing_in_local_currency/e.exchange_rate as discount_marketing, 
      co.discount_paid_voucher_in_local_currency/e.exchange_rate as discount_paid_voucher, 
      COALESCE(co.billing_received_in_local_currency, arv.billing_received_arvato)/e.exchange_rate as billing_received, 
      COALESCE(co.date_paid, arv.date_arvato_paid) as date_paid 
 
    FROM raw.customer_order co 
    LEFT JOIN raw.customer cu on cu.customer_id = co.customer_id 
    LEFT JOIN dwh.historical_exchange_rates e on e.currency_code = co.currency_code AND cast(co.date_invoiced as date) = e.date 
    LEFT JOIN  
    ( 
      SELECT  
        ordernumber as order_id, 
        MIN(date_created) as date_arvato_paid, 
        SUM(amount) as billing_received_arvato 
      FROM dwh.arvato_payments ap 
      GROUP BY 1 
    ) arv on arv.order_id = co.order_id 
    JOIN  
    ( 
      /* Calculate base numbers from articles. NOTE that lost is included with returned. */ 
      SELECT 
        coa.order_id, 
        MIN(CASE WHEN coa.order_article_state != 'Cancelled' THEN 0 ELSE 1 END) as article_cancellation_state, 
        SUM(coa.articles_picked) as articles_picked, 
        SUM(coa.articles_sent) as articles_sent, 
        SUM(coa.articles_kept) as articles_kept, 
        SUM(CASE WHEN coa.articles_returned is null AND coa.articles_lost is null THEN null ELSE COALESCE(coa.articles_returned, 0) + COALESCE(coa.articles_lost, 0) END) as articles_returned, 
        SUM(coa.sales_picked) as sales_picked, 
        SUM(coa.sales_sent) as sales_sent, 

        SUM(coa.sales_kept) as sales_kept, 
        SUM(CASE WHEN coa.sales_returned is null AND coa.sales_lost is null THEN null ELSE COALESCE(coa.sales_returned, 0) + COALESCE(coa.sales_lost, 0) END) as sales_returned, 

        /*Estimation KPI's-Sales*/
        SUM(sales_returned_est) AS sales_returned_est,
        SUM(sales_kept_est) AS sales_kept_est,
        SUM(cost_returned_est) AS cost_returned_est,
        SUM(cost_kept_est) AS cost_kept_est,
        
        SUM(CASE WHEN coa.stock_location_id = 2 THEN coa.sales_kept_est ELSE 0 END) AS own_stock_sales_kept_est,
        SUM(CASE WHEN coa.stock_location_id = 2 THEN coa.cost_kept_est ELSE 0 END) AS own_stock_cost_kept_est,
        SUM(CASE WHEN coa.stock_location_id = 2 THEN COALESCE(coa.sales_returned_est, 0) ELSE 0 END) AS own_stock_sales_returned_est,
        SUM(CASE WHEN coa.stock_location_id = 2 THEN COALESCE(coa.cost_returned_est, 0) ELSE 0 END) AS own_stock_cost_returned_est,

        SUM(CASE WHEN coa.stock_location_id != 2 THEN coa.sales_kept_est ELSE 0 END) AS partner_stock_sales_kept_est,
        SUM(CASE WHEN coa.stock_location_id != 2 THEN coa.cost_kept_est ELSE 0 END) AS partner_stock_cost_kept_est,
        SUM(CASE WHEN coa.stock_location_id != 2 THEN COALESCE(coa.sales_returned_est, 0) ELSE 0 END) AS partner_stock_sales_returned_est,
        SUM(CASE WHEN coa.stock_location_id != 2 THEN COALESCE(coa.cost_returned_est, 0) ELSE 0 END) AS partner_stock_cost_returned_est,

        /*Estimation-New KPI's for Own Stock (Withoud Paul Hunter) and Paul Hunter*/
        SUM(CASE WHEN coa.stock_location_id = 2 and brand<>'PAUL HUNTER' THEN coa.sales_kept_est ELSE 0 END) AS own_stock_sales_kept_wo_ph_est,
        SUM(CASE WHEN coa.stock_location_id = 2 and brand<>'PAUL HUNTER' THEN coa.cost_kept_est ELSE 0 END) AS own_stock_cost_kept_wo_ph_est,

        SUM(CASE WHEN brand='PAUL HUNTER' THEN coa.sales_kept_est ELSE 0 END) AS paul_hunter_sales_kept_est,
        SUM(CASE WHEN brand='PAUL HUNTER' THEN coa.cost_kept_est ELSE 0 END) AS paul_hunter_cost_kept_est,

        /*Cost*/
        SUM(coa.cost_picked) as cost_picked, 
        SUM(coa.cost_sent) as cost_sent,
        SUM(coa.cost_kept) as cost_kept,
        SUM(CASE WHEN coa.cost_returned is null AND coa.cost_lost is null THEN null ELSE COALESCE(coa.cost_returned, 0) + COALESCE(coa.cost_lost, 0) END) as cost_returned, 
        
        SUM(CASE WHEN coa.stock_location_id = 2 THEN coa.articles_sent ELSE null END) as own_stock_articles_sent, 
        SUM(CASE WHEN coa.stock_location_id != 2 THEN coa.articles_sent ELSE null END) as partner_articles_sent, 
        
        SUM(CASE WHEN coa.stock_location_id = 2 THEN CASE WHEN coa.articles_returned is null AND coa.articles_lost is null THEN null ELSE COALESCE(coa.articles_returned, 0) + COALESCE(coa.articles_lost, 0) END ELSE null END) as own_stock_articles_returned, 
        SUM(CASE WHEN coa.stock_location_id != 2 THEN CASE WHEN coa.articles_returned is null AND coa.articles_lost is null THEN null ELSE COALESCE(coa.articles_returned, 0) + COALESCE(coa.articles_lost, 0) END ELSE null END) as partner_articles_returned, 
        
        SUM(CASE WHEN coa.stock_location_id = 2 THEN coa.articles_kept ELSE null END) as own_stock_articles_kept, 
        SUM(CASE WHEN coa.stock_location_id != 2 THEN coa.articles_kept ELSE null END) as partner_articles_kept, 
        
        SUM(CASE WHEN coa.stock_location_id = 2 THEN coa.sales_picked ELSE null END) as own_stock_sales_picked, 
        SUM(CASE WHEN coa.stock_location_id != 2 THEN coa.sales_picked ELSE null END) as partner_sales_picked, 
        
        SUM(CASE WHEN coa.stock_location_id = 2 THEN coa.sales_sent ELSE null END) as own_stock_sales_sent,
        SUM(CASE WHEN coa.stock_location_id != 2 THEN coa.sales_sent ELSE null END) as partner_sales_sent,
        SUM(CASE WHEN coa.stock_location_id = 2 and brand<>'PAUL HUNTER' THEN coa.sales_sent ELSE null END) as own_stock_sales_sent_wo_ph,
        SUM(CASE WHEN brand='PAUL HUNTER' THEN coa.sales_sent ELSE null END) as paul_hunter_sales_sent,
        
        SUM(CASE WHEN coa.stock_location_id = 2 THEN CASE WHEN coa.sales_returned is null AND coa.sales_lost is null THEN null ELSE COALESCE(coa.sales_returned, 0) + COALESCE(coa.sales_lost, 0) END ELSE null END) as own_stock_sales_returned, 
        SUM(CASE WHEN coa.stock_location_id != 2 THEN CASE WHEN coa.sales_returned is null AND coa.sales_lost is null THEN null ELSE COALESCE(coa.sales_returned, 0) + COALESCE(coa.sales_lost, 0) END ELSE null END) as partner_sales_returned, 
        SUM(CASE WHEN coa.stock_location_id = 2 and brand<>'PAUL HUNTER' THEN CASE WHEN coa.sales_returned is null AND coa.sales_lost is null THEN null ELSE COALESCE(coa.sales_returned, 0) + COALESCE(coa.sales_lost, 0) END ELSE null END) as own_stock_sales_returned_wo_ph, 
        SUM(CASE WHEN brand='PAUL HUNTER' THEN CASE WHEN coa.sales_returned is null AND coa.sales_lost is null THEN null ELSE COALESCE(coa.sales_returned, 0) + COALESCE(coa.sales_lost, 0) END ELSE null END) as paul_hunter_sales_returned, 
        

        SUM(CASE WHEN coa.stock_location_id = 2 THEN coa.sales_kept ELSE null END) as own_stock_sales_kept, 
        SUM(CASE WHEN coa.stock_location_id != 2 THEN coa.sales_kept ELSE null END) as partner_sales_kept, 
        SUM(CASE WHEN coa.stock_location_id = 2 and brand<>'PAUL HUNTER' THEN coa.sales_kept ELSE null END) as own_stock_sales_kept_wo_ph,
        SUM(CASE WHEN brand='PAUL HUNTER' THEN coa.sales_kept ELSE null END) as paul_hunter_sales_kept, 

        SUM(CASE WHEN coa.stock_location_id = 2 THEN coa.cost_picked ELSE null END) as own_stock_cost_picked, 
        SUM(CASE WHEN coa.stock_location_id != 2 THEN coa.cost_picked ELSE null END) as partner_cost_picked,        
        SUM(CASE WHEN coa.stock_location_id = 2 THEN coa.cost_sent ELSE null END) as own_stock_cost_sent, 
        SUM(CASE WHEN coa.stock_location_id != 2 THEN coa.cost_sent ELSE null END) as partner_cost_sent, 
        SUM(CASE WHEN coa.stock_location_id = 2 and brand<>'PAUL HUNTER' THEN coa.cost_sent ELSE null END) as own_stock_cost_sent_wo_ph,
        SUM(CASE WHEN brand='PAUL HUNTER' THEN coa.cost_sent ELSE null END) as paul_hunter_cost_sent, 
        
        SUM(CASE WHEN coa.stock_location_id = 2 THEN CASE WHEN coa.cost_returned is null AND coa.cost_lost is null THEN null ELSE COALESCE(coa.cost_returned, 0) + COALESCE(coa.cost_lost, 0) END ELSE null END) as own_stock_cost_returned, 
        SUM(CASE WHEN coa.stock_location_id != 2 THEN CASE WHEN coa.cost_returned is null AND coa.cost_lost is null THEN null ELSE COALESCE(coa.cost_returned, 0) + COALESCE(coa.cost_lost, 0) END ELSE null END) as partner_cost_returned,         
        SUM(CASE WHEN coa.stock_location_id = 2 and brand<>'PAUL HUNTER' THEN CASE WHEN coa.cost_returned is null AND coa.cost_lost is null THEN null ELSE COALESCE(coa.cost_returned, 0) + COALESCE(coa.cost_lost, 0) END ELSE null END) as own_stock_cost_returned_wo_ph, 
        SUM(CASE WHEN brand='PAUL HUNTER' THEN CASE WHEN coa.cost_returned is null AND coa.cost_lost is null THEN null ELSE COALESCE(coa.cost_returned, 0) + COALESCE(coa.cost_lost, 0) END ELSE null END) as paul_hunter_cost_returned, 

        SUM(CASE WHEN coa.stock_location_id = 2 THEN coa.cost_kept ELSE null END) as own_stock_cost_kept,
        SUM(CASE WHEN coa.stock_location_id = 2 and brand<>'PAUL HUNTER' THEN coa.cost_kept ELSE null END) as own_stock_cost_kept_wo_ph,
        SUM(CASE WHEN coa.stock_location_id != 2 THEN coa.cost_kept ELSE null END) as partner_cost_kept,
        SUM(CASE WHEN brand='PAUL HUNTER' THEN coa.cost_kept ELSE null END) as paul_hunter_cost_kept
      FROM bi.customer_order_articles coa  
      GROUP BY coa.order_id
    ) coa on coa.order_id = co.order_id 
    WHERE co.order_state_number >= 16 AND co.order_state_number < 2048  /* There should be no revenue estimations for Cancelled or not-yet-sent orders */ 
  ) x 
) 
 
SELECT 
  co.order_id, 
  co.parent_order_id, 
  co.customer_id, 
  co.preview_id, 
  co.customer_preview_id, 
  co.campaign_id, 
  co.stylist_id, 
  co.invoice_number, 
  co.sales_channel, 
  cos.saleschannel_special as sales_channel_special, 
/* The definition of 'Call Box' is that the order has had a valid phone date OR that it comes from the sales_channel = 'clubWithCall'.  
   The inclusion of clubWithCall is due to these orders being automatically generated by a script. It doesn't create phone dates, but these orders must be called.  
*/  
  CASE  
    WHEN co.date_phone_call > '2012-05-10'  
      AND co.date_phone_call < TIMESTAMPADD(SQL_TSI_MONTH, 2, curdate())  
      AND co.date_phone_call >= co.date_created 
      THEN 'Call Box' 
    WHEN cod.original_phone_date > '2012-05-10'  
      AND cod.original_phone_date < TIMESTAMPADD(SQL_TSI_MONTH, 2, curdate())  
      AND cod.original_phone_date >= co.date_created 
      THEN 'Call Box'  
    WHEN co.sales_channel = 'clubWithCall' THEN 'Call Box' 
    ELSE 'No Call Box' 
  END as box_type, 
  co.order_type, 
  co.order_type_completed, 
 
/* When sales_channel = 'website' then it's highly likely to not be a 'real order'. In such cases we set the state to 'Initiated'. */   
  CASE WHEN co.sales_channel = 'website' AND co.order_state ='Incoming' AND NOT (co.date_preview_created is not null OR cu.phone_number is not null) THEN 'Initiated' ELSE COALESCE(rev.order_state, co.order_state) END as order_state, 
  CASE WHEN co.sales_channel = 'website' AND co.order_state ='Incoming' AND NOT (co.date_preview_created is not null OR cu.phone_number is not null) THEN 4 ELSE COALESCE(rev.order_state_number, co.order_state_number) END as order_state_number, 
  rev.revenue_state,
  rev.kept_state,
  CASE
    WHEN cos.salesforce_order_stage = 'Datum vorschlagen' THEN 'Suggest date'
    WHEN cos.salesforce_order_stage in ('Artikel bestellen', 'order articles') THEN 'Order articles'
    WHEN cos.salesforce_order_stage in ('Feedback zur Bestellung einholen', 'get feedback') THEN 'Get feedback'
    WHEN cos.salesforce_order_stage in ('Termin ausmachen', 'arrange a date') THEN 'Arrange a date'
    WHEN cos.salesforce_order_stage in ('Inaktiv', 'inactive') THEN 'Inactive'
    WHEN cos.salesforce_order_stage = 'on hold' THEN 'On hold'
    WHEN cos.salesforce_order_stage in ('Packen', 'packing') THEN 'Packing'
    WHEN cos.salesforce_order_stage in ('Informationen vervollst‰ndigen', 'complete information') THEN 'Complete information' 
    WHEN cos.salesforce_order_stage in ('abgeschloﬂen & Nachbereitung', 'completed & postprocessing') THEN 'Completed & Follow-up'
    WHEN cos.salesforce_order_stage = 'Vorschau erstellen' THEN 'Create preview'
    WHEN cos.salesforce_order_stage is null THEN 'Order not synced'
    ELSE 'Ask BI' 
  END as order_sales_stage, 
 
/* The definitions of the different customer types is within the view raw.customer */   
  CASE  
    WHEN cu.user_type = 'Test User' THEN 'Test Order' 
    WHEN cu.user_type = 'Outfittery Showroom' THEN 'Outfittery Order' 
    WHEN cu.user_type = 'Real User' THEN 'Real Order' 
    ELSE 'Ask BI' 
  END as is_real_order, 
  co.payment_type, 
  co.payment_state, 
  co.cancellation_reason,
 
/* If the order is or has ever been set to 'Pre-pay' as its payment method, then set this to 1 */   
  CASE  
    WHEN co.payment_type = 'Pre-pay' THEN 1 
    WHEN cod.pre_pay is not null THEN cod.pre_pay  
    ELSE 0 
  END as pre_pay, 
  fr.arvato_result, 
  ft.arvato_score, 
  co.sales_maximum_type, 
  co.sales_maximum_in_local_currency/rev.exchange_rate as sales_maximum, 
  cos.ops_check, 
  cos.debt_collection_set as given_to_debt_collection, 
 
  co.currency_code, 
  v.vat_rate*100 as vat_percentage, 
  rev.exchange_rate, 
 
/* Discount data */ 
  co.discount_type, 
  rev.discount_total, 
  rev.discount_goodwill, 
  rev.discount_marketing, 
  rev.discount_paid_voucher, 
 
/* Top-level Revenue */   
  rev.articles_picked, 
  rev.articles_sent, 
  rev.articles_kept, 
  rev.articles_returned, 
  rev.sales_picked, 
  rev.sales_sent, 
  rev.sales_kept,  
  rev.sales_returned, 
  CASE  
    WHEN rev.sales_kept - rev.discount_total < 0 THEN 0 
    ELSE rev.sales_kept - rev.discount_total 
  END as billing_total, 
  rev.billing_received,  
  CASE  
    WHEN rev.sales_kept - rev.discount_total < 0 THEN 0 
    ELSE rev.sales_kept - rev.discount_total 
  END - rev.billing_received as billing_open, 
  CASE  
    WHEN rev.sales_kept - rev.discount_total < 0 THEN 0 
    ELSE rev.sales_kept - rev.discount_total 
  END * (v.vat_rate/(1 + v.vat_rate)) as billing_vat, 
  CASE  
    WHEN rev.sales_kept - rev.discount_total < 0 THEN 0 
    ELSE rev.sales_kept - rev.discount_total 
  END / (1 + v.vat_rate) as billing_net_sales, 
  rev.cost_picked, 
  rev.cost_sent, 
  rev.cost_returned, 
  rev.cost_kept, 
 
/* Own stock numbers */ 
  rev.own_stock_articles_sent, 
  rev.own_stock_articles_returned, 
  rev.own_stock_articles_kept, 
  rev.own_stock_sales_sent, 
  rev.own_stock_sales_returned, 
  rev.own_stock_sales_kept, 
  rev.own_stock_cost_sent, 
  rev.own_stock_cost_returned, 
  rev.own_stock_cost_kept, 
 
/* Partner stock numbers */ 
  rev.partner_articles_sent, 
  rev.partner_articles_returned, 
  rev.partner_articles_kept, 
  rev.partner_sales_sent, 
  rev.partner_sales_returned, 
  rev.partner_sales_kept, 
  rev.partner_cost_sent, 
  rev.partner_cost_returned, 
  rev.partner_cost_kept, 
 
  rev.own_stock_sales_kept_wo_ph,
  rev.own_stock_cost_kept_wo_ph,
  rev.paul_hunter_sales_kept,
  rev.paul_hunter_cost_kept,
 
/* Dates */  
  co.date_created, 
  co.date_preview_created, 
 
  CASE
  /* Orders with sales_channel = 'website' and websiteWithoutDateAndPendingConfirmation are not real orders, hence exclude date_created should be set to null */ 
    WHEN (co.sales_channel = 'website' AND co.order_state in ('Incoming', 'Cancelled') AND NOT (co.date_preview_created is not null OR cu.phone_number is not   null))
    OR (co.sales_channel = 'websiteWithoutDateAndPendingConfirmation' and co.date_stylist_picked is not null) THEN null
    WHEN co.sales_channel = 'website' AND co.date_preview_created > co.date_created THEN co.date_preview_created
    WHEN CAST(co.date_created as date)<'2015-07-21' THEN COALESCE(cod.date_incoming, co.date_created)
    /*Because of task manager job all old orders in state 4 is changed to 8*/
    WHEN CAST(co.date_created as date)>='2015-07-21' THEN co.date_created
  END date_incoming,
  
  COALESCE(cod.date_cancelled,co.date_cancelled) as date_cancelled,  /* Data from audit_log is more complete than customer_order */ 
  cod.date_prepay_to_credit_card,  
  CASE  
    WHEN co.date_phone_call > '2012-05-10'  
      AND co.date_phone_call < TIMESTAMPADD(SQL_TSI_MONTH, 2, curdate())  
      AND co.date_phone_call >= co.date_created 
      THEN co.date_phone_call  
    WHEN cod.original_phone_date > '2012-05-10'  
      AND cod.original_phone_date < TIMESTAMPADD(SQL_TSI_MONTH, 2, curdate())  
      AND cod.original_phone_date >= co.date_created 
      THEN cod.original_phone_date  
    ELSE null 
  END as date_phone_call, 
  CASE  
    WHEN co.date_phone_call > '2012-05-10'  
      AND co.date_phone_call < TIMESTAMPADD(SQL_TSI_MONTH, 2, curdate())  
      AND co.date_phone_call >= co.date_created 
      THEN co.date_phone_call 
    ELSE null 
  END as date_phone_call_current, 
  CASE 
    WHEN cod.original_phone_date > '2012-05-10'  
      AND cod.original_phone_date < TIMESTAMPADD(SQL_TSI_MONTH, 2, curdate())  
      AND cod.original_phone_date >= co.date_created 
      THEN cod.original_phone_date  
    ELSE null 
  END as date_phone_call_original, 
  cos.date_next_contact, 
  co.date_stylist_picked, 
  cod.date_arvato_accepted, 
  co.date_submitted, 
  co.date_invoiced,
  COALESCE(dd.date_shipped, co.date_shipped_internal) as date_shipped, 
  co.date_shipped_internal, 
  co.date_return_reminder, 
  co.date_returned_online,
  co.date_return_registration,
  COALESCE(cod.date_returned,co.date_returned) as date_returned,
  CASE
    WHEN CAST(co.date_shipped_internal as date)<'2015-07-15' THEN COALESCE(cod.date_completed,co.date_completed) 
    /*this case statment corrects the date_completed for arvato customers (starting from 15th july) if the customer has date_returned then date_completed is 
    date_retuend if it date_returned is null then it adds 21 days to date_shipped*/
    WHEN CAST(co.date_shipped_internal as date)>='2015-07-15' AND co.date_returned IS NOT NULL THEN  COALESCE(cod.date_returned,co.date_returned)
    WHEN CAST(co.date_shipped_internal as date)>='2015-07-15' AND co.date_returned IS NULL
    AND CAST(TIMESTAMPADD(SQL_TSI_DAY,21,co.date_shipped_internal) AS DATE)<CURDATE() THEN TIMESTAMPADD(SQL_TSI_DAY,21,co.date_shipped_internal)
  END AS date_completed,
  co.date_first_reminder, 
  co.date_first_warning,
  co.date_second_warning,
  co.date_third_warning, 
  co.date_given_to_debt_collection,  
  rev.date_paid, 
  nps.date_submitted as date_nps_submitted,
  /*date return registration is set for physical Return registration
   when customer returns the box at postoffice and status in aftership changes to InTransit*/
  CASE 
  WHEN cod.date_returned_online IS NOT NULL AND date_return_registration IS NOT NULL THEN 'Y'
  ELSE 'N'
  END AS aftership_return_confirmation,
  /* Address details */  
  /*If shipping address is same billing address then it is set 'Y',
  column from postgres is wrong*/
  CASE
  WHEN  
    shipping_first_name=billing_first_name
    AND shipping_last_name=billing_last_name
    AND shipping_street=billing_street
    AND shipping_street_number=billing_street_number
    AND shipping_zip=billing_zip
    AND shipping_city=billing_city
    AND shipping_co=billing_co
  THEN 'Y'
  ELSE 'N'
  END AS shipping_address_meets_billing_address,
  co.shipping_city,
  co.shipping_country, 
  co.shipping_street, 
  co.shipping_street_number, 
  co.shipping_zip, 
  co.shipping_first_name, 
  co.shipping_last_name, 
  co.shipping_co, 
  co.billing_city, 
  co.billing_country, 
  co.billing_street, 
  co.billing_street_number, 
  co.billing_zip, 
  co.billing_first_name, 
  co.billing_last_name, 
  co.billing_co, 
 
/* Position of the order within the customer's order history */    
  co.all_order_count, 
  co.real_order_count, 
  co.follow_on_count, 
  co.all_order_count_completed,  
  co.real_order_count_completed, 
   
  co.customer_message_content, 
  cos.inactive_reasons, 
  cos.not_reached, 
  cos.wrong_phone_number, 
  cos.call_cancelled, 
  cos.call_confirmed, 
  cos.new_phone_appointment, 
  cos.calender_full as calendar_full,
  nps.nps_score,
  nps.customer_comment as nps_customer_comment
  
FROM raw.customer_order co 
LEFT JOIN raw.customer cu on cu.customer_id = co.customer_id 
LEFT JOIN rev on rev.order_id = co.order_id 
LEFT JOIN raw.customer_order_salesforce cos on cos.order_id = co.order_id 
LEFT JOIN raw.customer_order_details__audit_log cod on cod.order_id = co.order_id 
LEFT JOIN dwh.calendar c on c.date = cast(co.date_invoiced as date) 
LEFT JOIN dwh.vat_rates v on v.year_month = c.year_month AND co.shipping_country = v.country_code_iso
LEFT JOIN dwh.nps_score nps on nps.order_id=co.order_id
LEFT JOIN  
(
  SELECT 
    ss.order_id, 
    parsedate(min(ss.shipping_date), 'yyyyMMdd') as date_shipped 
  FROM raw.stock_shipped ss
  GROUP BY 1
) dd on dd.order_id = co.order_id 
LEFT JOIN  
( 
  SELECT  
    f.order_id, 
    f.arvato_score, 
    row_number() OVER (PARTITION BY f.order_id ORDER BY f.date_created DESC) as rnum 
  FROM raw.financial_transactions f 
  WHERE f.arvato_score is not null 
) ft on ft.order_id = co.order_id AND ft.rnum = 1 
LEFT JOIN  
( 
  SELECT  
    f.order_id, 
    f.arvato_result, 
    row_number() OVER (PARTITION BY f.order_id ORDER BY f.date_created DESC) as rnum 
  FROM raw.financial_transactions f 
  WHERE f.arvato_result is not null 
  AND f.arvato_result != 'ERROR' 
) fr on fr.order_id = co.order_id AND fr.rnum = 1


