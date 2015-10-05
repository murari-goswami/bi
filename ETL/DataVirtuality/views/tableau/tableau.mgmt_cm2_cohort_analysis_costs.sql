-- Name: tableau.mgmt_cm2_cohort_analysis_costs
-- Created: 2015-05-21 11:52:31
-- Updated: 2015-07-31 09:45:41

CREATE VIEW tableau.mgmt_cm2_cohort_analysis_costs
AS

SELECT
  con.order_id,
  con.customer_id,
  con.order_state,
  con.revenue_state,
  con.payment_state,
  con.shipping_country,
  con.order_type,
  con.sales_sent,
  con.sales_kept,
  con.discount_total,
  con.billing_total,
  con.billing_net_sales,
  con.sales_kept * cogs.percentage_cost cost_kept_calc,
  con.cost_kept,
  co.first_box_type,
  co.first_saleschannel_completed,
  mc.first_channel as first_marketing_channel,
  c.first_order_date_completed as date_created_first_order,
  cu.customer_age,
  con.date_invoiced,
  con.date_shipped,
  con.date_created,
  con.order_state_number,
  TIMESTAMPDIFF(SQL_TSI_DAY, c.first_order_date_completed, con.date_created)/30 as months_since_first_order,
  dirc.payment_cost_per_order,
  dirc.service_cost_per_order,
  dirc.logistics_cost_per_order
FROM bi.customer_order con
JOIN views.customer c on c.customer_id = con.customer_id
JOIN views.customer_order co on co.id = con.order_id
LEFT JOIN views.marketing_customer mc on mc.customer_id = co.customer_id
LEFT JOIN bi.customer cu on cu.customer_id = co.customer_id
LEFT JOIN 
(
SELECT
  ccd.year_month,
  ccd.country_code,
  SUM(CASE WHEN ccd.cost_type='payment' then ccd.cost ELSE NULL END) AS payment_cost_per_order,
  SUM(CASE WHEN ccd.cost_type='service' then ccd.cost ELSE NULL END) AS service_cost_per_order,
  SUM(CASE WHEN ccd.cost_type='logistics' then ccd.cost ELSE NULL END) AS logistics_cost_per_order
FROM dwh.company_cost_cohort ccd
GROUP BY 1,2
)dirc on dirc.country_code=co.shipping_country and dirc.year_month=left(c.first_order_date_completed,7)
JOIN /* Take COGs % from last 31 days. We will apply this to all orders, so that we are not biased against old cohorts due to high partner stock usage */
(
  SELECT
  shipping_country,
  sum(cost_kept)/sum(sales_kept) as percentage_cost
  FROM bi.customer_order co
  WHERE co.date_invoiced > TIMESTAMPADD(SQL_TSI_DAY, -31, CURDATE())
  GROUP BY 1
) cogs on cogs.shipping_country = co.shipping_country
WHERE con.order_state_number >= 128 
AND con.order_state_number < 2048
AND con.is_real_order = 'Real Order'

/* This UNION SELECT adds in dummy data so that we can draw nice cohorts charts for old cohorts that have very sparse data */
UNION SELECT
  null as order_id,
  null as customer_id,
  'Completed' as order_state,
  'Final' as revenue_state,
  null as payment_state,
  shipping_country,
  null as order_type,
  null as sales_sent,
  null as sales_kept,
  null as discount_total,
  null as billing_total,
  null as billing_net_sales,
  null as cost_kept_calc,
  null as cost_kept,
  first_box_type,
  null as first_saleschannel_completed,
  first_marketing_channel,
  fo.date as date_created_first_order,
  null as customer_age,
  null as date_invoiced,
  null as date_shipped,
  o.date as date_created,
  null as order_state_number,
  TIMESTAMPDIFF(SQL_TSI_DAY, fo.date, curdate())/30 as months_since_first_order,
  null as payment_cost_per_order,
  null as service_cost_per_order,
  null as logistics_cost_per_order
FROM dwh.calendar fo
JOIN dwh.calendar o on o.date > fo.date AND o.date < curdate()
CROSS JOIN (SELECT 'Call Box' as first_box_type UNION SELECT 'No Call Box' as first_box_type) x
CROSS JOIN (SELECT distinct shipping_country FROM bi.customer_order) y
CROSS JOIN (SELECT distinct first_channel as first_marketing_channel FROM views.marketing_customer) z
WHERE fo.date > '2012-02' and fo.date < curdate()
AND fo.day_of_month = 1
AND o.day_of_month = 1


