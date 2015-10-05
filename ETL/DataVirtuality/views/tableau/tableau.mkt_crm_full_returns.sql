-- Name: tableau.mkt_crm_full_returns
-- Created: 2015-09-10 16:57:45
-- Updated: 2015-09-16 13:30:08

CREATE VIEW tableau.mkt_crm_full_returns
AS

WITH c_order AS
(
  SELECT 
    rank() OVER(PARTITION BY customer_id ORDER BY date_created desc) as rank_cust,
    order_id,
    customer_id,
    order_state_number,
    order_type,
    kept_state,
    sales_channel,
    case when revenue_state='Final' then sales_kept end as sales_kept,
    case when revenue_state='Final' then articles_kept end as items_kept
  FROM bi.customer_order
  WHERE order_state_number=1024
  AND date_given_to_debt_collection IS NULL
)

SELECT
  c.customer_id,
  cu.email,
  CASE WHEN cu.gender = 'Male' THEN 'Herr' ELSE 'Frau' END as anrede,
  case
  when cu.gender= 'Male' THEN 'Lieber'
  when cu.gender= 'Female' THEN 'Liebe'
  end AS "begruessung",
  cu.formal as du_sie,
  cu.first_name,
  cu.last_name,
  cu.phone_number,
  cu.customer_age,
  cu.default_domain as default_page,
  cu.subscribe_status,
  cu.subscribed_to_sms,
  cu.subscribed_to_stylist_emails,
  cu.date_of_birth,
  st.first_name as stylist_firstname,
  st.last_name as stylist_lastname,
  st.stylist,
  cu.token,
  c.order_id,
  c.sales_sent,
  c.articles_sent,
  c.feedback_dont_like_the_colour,
  c.feedback_dont_like_the_brand,
  c.feedback_dont_like_the_pattern,
  c.feedback_too_outrageous,
  c.feedback_too_simple,
  c.feedback_not_needed,
  c.feedback_too_tight,
  c.feedback_too_big,
  c.feedback_too_small,
  c.feedback_too_short,
  c.feedback_too_long,
  c.feedback_too_wide,
  c.feedback_too_expensive,
  c.feedback_too_cheap,
  c.feedback_too_low_quality,
  cd.last_order_date,
  cd.completed_orders,
  cd.avg_billing_total,
  cd.articles_kept
FROM
(
  SELECT
  a.customer_id,
  b.*
  FROM(SELECT * FROM c_order WHERE rank_cust=1)a
  LEFT JOIN 
  (
    SELECT 
      op.order_id,
      SUM(articles_sent) as articles_sent,
      SUM(articles_returned) as articles_returned,
      SUM(sales_sent) as sales_sent,
      SUM(op.feedback_dont_like_the_colour) as feedback_dont_like_the_colour,
      SUM(op.feedback_dont_like_the_brand) as feedback_dont_like_the_brand,
      SUM(op.feedback_dont_like_the_pattern) as feedback_dont_like_the_pattern,
      SUM(op.feedback_too_outrageous) as feedback_too_outrageous,
      SUM(op.feedback_too_simple) as feedback_too_simple,
      SUM(op.feedback_not_needed) as feedback_not_needed,
      SUM(op.feedback_too_tight) as feedback_too_tight,
      SUM(op.feedback_too_big) as feedback_too_big,
      SUM(op.feedback_too_small) as feedback_too_small,
      SUM(op.feedback_too_short) as feedback_too_short,
      SUM(op.feedback_too_long) as feedback_too_long,
      SUM(op.feedback_too_wide) as feedback_too_wide,
      SUM(op.feedback_too_expensive) as feedback_too_expensive,
      SUM(op.feedback_too_cheap) as feedback_too_cheap,
      SUM(op.feedback_too_low_quality) as feedback_too_low_quality
    FROM bi.customer_order_articles op
    GROUP BY 1
  )b ON a.order_id=b.order_id
  WHERE 
  a.sales_channel<>'manual'
  AND a.order_type NOT LIKE '%Follow%'
  AND kept_state='All Returned'
  AND articles_returned is not null
)c
JOIN bi.customer cu on cu.customer_id=c.customer_id  AND cu.email not like '%invalid%' and cu.club_member='false'
LEFT JOIN bi.stylist st on st.stylist_id=cu.new_stylist_id
LEFT JOIN
(
  SELECT
    customer_id,
    MAX(date_created) as last_order_date,
    SUM(DISTINCT CASE WHEN order_state= 'Completed' THEN articles_kept ELSE NULL END) articles_kept,
    COUNT(DISTINCT CASE WHEN order_state= 'Completed' THEN order_id ELSE NULL END) as completed_orders,
    SUM(CASE WHEN order_state= 'Completed' THEN billing_total ELSE NULL END) /COUNT(DISTINCT CASE WHEN order_state= 'Completed' THEN order_id ELSE NULL END) as avg_billing_total
  FROM bi.customer_order
  GROUP BY 1
)cd on c.customer_id=cd.customer_id


