-- Name: tableau.sales_datasource_orginal_stylist_ds
-- Created: 2015-04-28 10:32:03
-- Updated: 2015-05-11 11:17:51

CREATE VIEW tableau.sales_datasource_orginal_stylist_ds
AS

SELECT

  co.order_id,
  co.customer_id,
  co.parent_order_id,
  co.sales_channel,
  co.sales_channel_special as saleschannel_special__c,
  co.order_state_number as customer_order_state,
  co.shipping_first_name,
  co.shipping_last_name,
  co.shipping_city,
  co.shipping_country,
  co.currency_code,
  co.date_created,
  co.date_incoming,
  co.date_phone_call as phone_date,
  co.date_invoiced,
  co.date_completed,
  co.order_type,
  co.revenue_state,
  
  /*Forecast Revenue*/
  fc.sales_kept_forecast,
  fc.sales_returned_forecast,
  fc.billing_total,
  fc.billing_net_sales,
  
  /*Customer Fields*/
  cu.customer_age,
  cu.default_domain as default_page,
  cu.age_group_felt as perceived_customer_age,
  COALESCE(cu.age_group_felt,cu.age_group) as perceived_customer_age_2,
  fo.first_order_date,
  fo.first_order_date_completed,

  /*Stylist Information-Information is from salesforce (Will be replaced with postgres or dwh table)*/
  s.team as user_role,
  s.stylist,
  s.stylist_original as Name,
  s.balancer_enabled,
  s.call_group,
  
  /*Order Position Fields*/
  coa.article_id,
  coa.order_article_state_number as state,
  coa.stock_location_id,
  coa.date_picked,
  coa.date_returned,
  coa.sales_picked,
  coa.sales_sent,
  coa.sales_kept,
  coa.sales_returned,
  coa.sales_lost,
  coa.articles_picked,
  coa.articles_sent,
  coa.articles_kept,
  coa.articles_returned,
  coa.articles_lost,
  /*Feedback reasons based on warehouse or customer_feedback when returned online*/
  coa.feedback_dont_like_the_colour,
  coa.feedback_dont_like_the_brand,
  coa.feedback_dont_like_the_pattern,
  coa.feedback_too_outrageous,
  coa.feedback_too_simple,
  coa.feedback_not_needed,
  coa.feedback_too_tight,
  coa.feedback_too_big,
  coa.feedback_too_small,
  coa.feedback_too_short,
  coa.feedback_too_long,
  coa.feedback_too_wide,
  coa.feedback_too_expensive,
  coa.feedback_too_cheap,
  coa.feedback_too_low_quality,
  coa.feedback_comment as comment, /*this comment is from doc data returns files*/

  /*Article Information (Zalando article info is missing for many articles)*/
  art.article_brand,
  art.article_title,
  art.article_name,
  art.article_color,
  art.article_color1 as color1,
  art.article_commodity_group2 as commodity_group2,
  art.article_commodity_group3 as commodity_group3,
  art.article_commodity_group4 as commodity_group4,
  art.article_push_stock AS push,
  
  /*Salesforce Fields (Will be replaced soon to dwh tables)*/
  cos.newcardrecommendation as newcardrecommendation__c,
  cos.dhl_return_next_steps as dhlreturnnextsteps__c,
  cos.inactive_reasons as inactivereason__c,
  cos.refusual_comment as refusals_comment__c,
  cos.not_reached as notReached__c,
  cos.wrong_phone_number as Telefonnummer_Falsch__c,
  
  sac.category2, /*Will be replaced soon with ERP article model*/

  CASE
    WHEN co.shipping_country='CH' AND CAST(co.date_invoiced as date) BETWEEN '2014-11-01' AND '2015-03-30' AND art_a.articles_sent=art_a.articles_kept THEN 'Open CH Orders'
    ELSE NULL
  END AS open_ch_order

FROM bi.customer_order co
LEFT JOIN bi.customer cu on cu.customer_id=co.customer_id
LEFT JOIN bi.customer_order_articles coa on coa.order_id=co.order_id
LEFT JOIN bi.stylist s ON co.stylist_id = s.stylist_id
LEFT JOIN bi.article art on coa.article_id = art.article_id
LEFT JOIN bi.customer_order_salesforce cos on cos.order_id=co.order_id
LEFT JOIN views.supplier_article_categories sac ON sac.supplier_article_id = coa.supplier_article_id
LEFT JOIN
(
  SELECT 
    co.customer_id,
    min(co.date_created) as first_order_date,
    min(CASE WHEN co.order_state = 'Completed' THEN co.date_created ELSE null END) as first_order_date_completed
  FROM bi.customer_order co 
  GROUP BY co.customer_id
)fo on fo.customer_id = co.customer_id
LEFT JOIN
(
  SELECT 
    order_id,
    SUM(articles_sent) as articles_sent,
    SUM(articles_kept) as articles_kept
  FROM bi.customer_order_articles
  GROUP BY 1
)art_a on art_a.order_id=co.order_id
/*Forcast KPI's*/
LEFT JOIN
(
	SELECT 
		co.order_id,
		min(coa.article_id) as min_article_id,
		avg(co.sales_kept) as sales_kept_forecast,
		avg(co.sales_returned) as sales_returned_forecast,
		avg(co.billing_total) as billing_total,
		avg(co.billing_net_sales) as billing_net_sales
	FROM bi.customer_order co 
	LEFT JOIN bi.customer_order_articles coa on coa.order_id=co.order_id
	GROUP BY 1
)fc on fc.order_id=co.order_id and fc.min_article_id=coa.article_id


