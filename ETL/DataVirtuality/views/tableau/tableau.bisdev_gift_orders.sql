-- Name: tableau.bisdev_gift_orders
-- Created: 2015-09-11 11:30:58
-- Updated: 2015-09-11 17:07:36

CREATE VIEW tableau.bisdev_gift_orders
AS

SELECT 
  co.order_id,
  co.customer_id,
  co.date_created,
  co.date_shipped,
  co.payment_type,
  co.shipping_country,
  co.shipping_city,
  co.sales_sent,
  case when revenue_state='Final' then co.sales_kept end as sales_kept,
  co.billing_received,
  cu.customer_age,
  co.follow_on_count,
  co.real_order_count,
  co.sales_channel,
  co.order_state_number,
   CASE
    WHEN co.order_type = 'First Order' THEN 'First Order'
    WHEN co.order_type in ('Repeat Order', 'Outfittery Club Order') THEN 'Real Repeat Order'
    WHEN co.order_type in ('First Order Follow-on', 'Repeat Order Follow-on') THEN 'Follow on Order'
    ELSE 'Ask BI'
  END as order_type,
  timestampdiff(SQL_TSI_DAY,co.date_shipped,co.date_returned) as days_shipped_returned,
  co.box_type,
  co.arvato_result,
  co.arvato_score,
  cu.club_member,
  sfo.newcardrecommendation,
  sty.stylist,
  cast(f.first_order_date as date) as first_order_date,
  sfa.customer_status,
  sfa.bmi,
  co.articles_sent,
  co.articles_kept,
  CASE WHEN co.articles_sent=0 then 0 else (case when revenue_state='Final' then co.sales_returned end)/co.articles_sent END AS rq_item,
  CASE WHEN co.sales_sent=0 then 0 else (case when revenue_state='Final' then co.sales_returned end)/co.sales_sent END AS rq_value,
  op.gift_box,
  op.gift_retourniert,
  op.gift_box_2009876543503,
  op.gift_box_2009876636489,
  op.gift_box_2009876543527,
  op.gift_box_2009876543534,
  op.gift_box_2009876543510,
  op.gift_box_2009876543497

FROM bi.customer_order co
LEFT JOIN bi.customer cu on cu.customer_id = co.customer_id
LEFT JOIN bi.stylist sty on sty.stylist_id=co.stylist_id
LEFT JOIN raw.customer_order_salesforce sfo on sfo.order_id=co.order_id
LEFT JOIN raw.customer_salesforce sfa on sfa.customer_id = co.customer_id
LEFT JOIN 
(
  SELECT 
    co.customer_id,
    min(co.date_created) as first_order_date
  FROM bi.customer_order co 
  GROUP BY co.customer_id
) f on f.customer_id = cu.customer_id
LEFT JOIN
(
  SELECT 
    a.order_id,
    COUNT(CASE 
      WHEN a.article_ean IN ('2009876543503','2009876543510','2009876543527','2009876636489','2009876543534','2009876543497') then '1' 
      else Null end) as gift_box,
    COUNT(CASE WHEN a.article_ean ='2009876543503' then 1 else Null end) as gift_box_2009876543503, 
    COUNT(CASE WHEN a.article_ean ='2009876636489' then 1 else Null end) as gift_box_2009876636489, 
    COUNT(CASE WHEN a.article_ean ='2009876543527' then 1 else Null end) as gift_box_2009876543527, 
    COUNT(CASE WHEN a.article_ean ='2009876543534' then 1 else Null end) as gift_box_2009876543534, 
    COUNT(CASE WHEN a.article_ean ='2009876543510' then 1 else Null end) as gift_box_2009876543510,
    COUNT(CASE WHEN a.article_ean ='2009876543497' then 1 else Null end) as gift_box_2009876543497,
    COUNT(CASE 
        WHEN a.article_ean IN ('2009876543503','2009876543510','2009876543527','2009876636489','2009876543534','2009876543497')
        AND a.order_article_state_number = 512 then 1 
        else Null end) as gift_retourniert
  FROM
  (
    SELECT
      coa.order_id, 
      COALESCE(a.article_ean,i.ean) as article_ean,
      coa.order_article_state_number
    FROM bi.customer_order_articles coa
    LEFT JOIN bi.article a on a.article_id=coa.article_id 
    LEFT JOIN bi.item i on i.article_id=a.article_id
  )a 
  GROUP BY order_id
)op ON op.order_id=co.order_id


