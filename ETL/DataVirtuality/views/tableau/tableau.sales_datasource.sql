-- Name: tableau.sales_datasource
-- Created: 2015-04-24 18:22:17
-- Updated: 2015-09-29 12:35:37

CREATE VIEW "tableau.sales_datasource" 
AS

SELECT

  co.order_id,
  co.customer_id,
  co.parent_order_id,
  co.sales_channel,
  co.customer_message_content,
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
  co.date_paid,
  co.date_nps_submitted,
  co.nps_score,
  co.nps_customer_comment,
  co.order_type,
  co.box_type,
  co.order_state,
  co.kept_state,
  co.payment_type,
  co.revenue_state,
  co.is_real_order,
  co.cancellation_reason,
  
  fc.sales_kept_forecast,
  fc.sales_returned_forecast,
  fc.billing_total,
  fc.billing_net_sales,
  fc.billing_received,
  fc.discount_total,
  fc.discount_goodwill,
  fc.discount_marketing,
  fc.newcardrecommendation__c,
  fc.discount_paid_voucher,
  /*Arvato Results*/
  ar.responseCode_1 as arvato_response_code,
  ar.arvatoresult_1 as arvato_result,
  
  /*Customer Fields*/
  cu.phone_number,
  CASE WHEN cu.phone_number is null THEN false ELSE true END as has_phone_number,
  cu.vip_customer,
  cu.customer_age,
  cu.default_domain as default_page,
  cu.age_group_felt as perceived_customer_age,
  COALESCE(cu.age_group_felt,cu.age_group) as perceived_customer_age_2,
  cu.shirt_size,
  cu.trousers_size_width,
  cu.trousers_size_length,
  cu.club_member,
  cu.club_membership_type,
  cu.date_club_activated,
  cu.date_club_cancelled,
  fo.first_order_date,
  fo.first_order_date_completed,

  /*Stylist Information-Information is from salesforce (Will be replaced with postgres or dwh table)*/
  s.stylist as Name,
  s.role as stylist_role,
  s.team as user_role,
  s.stylist_original,
  s.balancer_enabled,
  s.call_group,
  s.stylist_group,
  
  /*Order Position Fields*/
  coa.article_id,
  coa.order_article_state_number as state,
  coa.stock_location_id,
  coa.date_picked,
  coa.date_shipped as op_date_shipped,
  coa.date_returned,
  coa.sales_picked,
  coa.sales_sent,
  coa.sales_kept,
  coa.sales_kept_est,
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
  TIMESTAMPDIFF(SQL_TSI_DAY,cast(fc.last_date_incoming as date), cast(fc.last_date_completed as date)) as days_inc_comp,
  TIMESTAMPDIFF(SQL_TSI_DAY,cast(fc.last_date_incoming as date), cast(fc.last_date_picked as date))  as days_inc_pic,
  TIMESTAMPDIFF(SQL_TSI_DAY,cast(fc.last_date_picked as date), cast(fc.last_date_completed as date))  as days_pic_comp,

    /*Article Information (Zalando article info is missing for many articles)*/
  i.brand,
  i.item_no,
  i.ean,
  i.item_description,
  i.color,
  i.size,
  i.season,
  i.item_status,
  i.category,
  i.product_group,
  
  /*Salesforce Fields (Will be replaced soon to task_manager)*/
  co.not_reached as notReached__c,
  co.wrong_phone_number as Telefonnummer_Falsch__c,
  CASE 
    WHEN co.ops_check='DC' THEN 'Debt Collection'
    WHEN co.ops_check='CX' THEN 'Cancelled'
    WHEN co.ops_check='LD' THEN 'Late Delivery'
    WHEN co.ops_check='AP' THEN 'Advance Payment'
    WHEN co.ops_check='SF' THEN 'Suspended Fraud'
    WHEN co.ops_check IN ('Not Scored','NS') THEN 'Not Scored'
    WHEN co.ops_check='CA' THEN 'Critical Attribute'
    WHEN co.ops_check='BV > MV' THEN 'Basket Value>Maximum Value'
    ELSE co.ops_check 
  END AS ops_check,
  co.date_preview_created,
  co.given_to_debt_collection,
  co.new_phone_appointment,
  co.date_phone_call as date_phone_call_current,
  co.call_cancelled,
  co.inactive_reasons as inactivereason__c,
  
  /*SF Opportunity*/
  co.order_sales_stage,
  cos.dhl_return_next_steps as dhlreturnnextsteps__c,
  cos.refusual_comment as refusals_comment__c,
  cos.date_feedback_call,
  cos.feedback_status,
  cos.feedback_caller_id,
  cos.preview_not_liked,
  cos.date_last_reactivation_call_order,
  cos.nb_of_reactivation_calls_made,
  
  /*SF Account fields(will be replaced with task_manager*/
  cs.last_call_reactivation,
  cs.last_reactivation_result,
  cs.date_last_contacted,
  cs.stylist_lead,
  ta.nb_survey_sent,
  sac.category2, /*Will be replaced soon with ERP article model*/

  CASE
    WHEN co.shipping_country='CH' AND CAST(co.date_invoiced as date) BETWEEN '2014-11-01' AND '2015-03-30' AND art_a.articles_sent=art_a.articles_kept THEN 'Open CH Orders'
    ELSE NULL
  END AS open_ch_order

FROM bi.customer_order co
LEFT JOIN bi.customer cu on cu.customer_id=co.customer_id
LEFT JOIN 
(
	SELECT
	ROW_NUMBER() OVER(PARTITION BY order_id ORDER BY date_created DESC) as r_num,
	a.*
	FROM bi.customer_order_articles a
) coa on coa.order_id=co.order_id
LEFT JOIN bi.stylist s ON co.stylist_id = s.stylist_id
LEFT JOIN bi.item i on coa.article_id = i.article_id
LEFT JOIN bi.customer_order_salesforce cos on cos.order_id=co.order_id
LEFT JOIN raw.customer_salesforce cs on cs.customer_id=co.customer_id
LEFT JOIN views.supplier_article_categories sac ON sac.supplier_article_id = coa.supplier_article_id
LEFT JOIN views.arvatoresults ar on ar.order_id=co.order_id
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
/*Join is on customer_order_articles, it created duplicates for each row*/
LEFT JOIN
(
    SELECT 
        co.order_id,
        CAST('1' AS integer) as row_num,
        min(coa.article_id) as min_article_id,
        avg(co.sales_kept) as sales_kept_forecast,
        avg(co.sales_returned) as sales_returned_forecast,
        avg(co.billing_total) as billing_total,
        avg(co.billing_net_sales) as billing_net_sales,
        max(co.date_incoming) as last_date_incoming, 
        max(co.date_completed) as last_date_completed,
        max(coa.date_picked) as last_date_picked,
        avg(co.billing_received) as billing_received,
        avg(discount_total) as discount_total,
        avg(discount_goodwill) as discount_goodwill,
        avg(discount_marketing) as discount_marketing,
        avg(discount_paid_voucher) as discount_paid_voucher,
        avg(cos_1.newcardrecommendation) as newcardrecommendation__c
    FROM bi.customer_order co 
    LEFT JOIN bi.customer_order_articles coa on coa.order_id=co.order_id
    LEFT JOIN raw.customer_order_salesforce cos_1 on cos_1.order_id=co.order_id
    GROUP BY 1
)fc on fc.order_id=co.order_id and fc.row_num=coa.r_num
/*Number of feedback mails sent*/
LEFT JOIN
(
    SELECT 
        opportunity_id,
        count(distinct opportunity_id) as nb_survey_sent
    FROM views.salesforce_task
    GROUP BY 1
) ta on ta.opportunity_id=cos.salesforce_order_id


