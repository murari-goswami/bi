-- Name: tableau.ops_lost_articles_order_information
-- Created: 2015-04-24 18:20:06
-- Updated: 2015-04-24 18:20:06

CREATE view tableau.ops_lost_articles_order_information
as
SELECT co.customer_id, 
       cast(co.date_shipped AS DATE) AS date_shipped, 
       co.order_id, 
       coa.article_id, 
       co.shipping_country, 
       coa.sales_sent 
FROM   bi.customer_order co 
       LEFT JOIN bi.customer_order_articles coa 
              ON coa.order_id = co.order_id 
WHERE  coa.order_article_state_number = 1536


