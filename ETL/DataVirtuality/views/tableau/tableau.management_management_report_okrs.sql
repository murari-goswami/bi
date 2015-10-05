-- Name: tableau.management_management_report_okrs
-- Created: 2015-04-24 18:20:05
-- Updated: 2015-04-24 18:20:05

create VIEW tableau.management_management_report_okrs  
AS  
SELECT  
 okr.year_quarter,  
 co.new_customers,  
 co.new_customers + (co.new_customers / okr.working_days_gone * okr.working_days_left) as new_customer_forecast,  
 okr.new_customer_target,  
 co.repeat_customers,   
 co.repeat_customers + (co.repeat_customers / okr.working_days_gone * okr.working_days_left) as repeat_customer_forecast,  
 okr.repeat_customer_target,  
 co.avg_basket,  
 okr.avg_basket_target,  
 okr.revenue_per_stylist_target,  
 (co.billing_total + (co.billing_total / okr.working_days_gone * okr.working_days_left)) / s.stylists / 3 revenue_per_stylist  
FROM   
(  
 SELECT   
  o.year_quarter,  
  o.new_customer_target,  
  o.repeat_customer_target,  
  o.cart_value_target as avg_basket_target,  
  o.revenue_per_stylist_target,  
  SUM(c.working_days) as working_days_quarter,  
  SUM(CASE WHEN c.date < CURDATE() THEN c.working_days ELSE 0 END) as working_days_gone,  
  SUM(CASE WHEN c.date >= CURDATE() THEN c.working_days ELSE 0 END) as working_days_left  
 FROM dwh.company_okrs_quarterly o  
 JOIN dwh.calendar c on c.year_quarter = o.year_quarter  
 GROUP BY 1,2,3,4,5  
) okr  
JOIN   
(  
 SELECT  
  c.year_quarter,  
  COUNT(CASE WHEN order_type = 'First Order' THEN order_id ELSE null END) as new_customers,  
  COUNT(CASE WHEN order_type in ('Repeat Order', 'Outfittery Club Order') THEN order_id ELSE null END) as repeat_customers,  
  AVG(sales_kept) as avg_basket,  
  SUM(billing_total) as billing_total,  
  SUM(billing_net_sales) as net_sales  
 FROM bi.customer_order co   
 JOIN dwh.calendar c on c.date = CAST(co.date_invoiced as date)  
 WHERE co.is_real_order = 'Real Order'  
 AND co.order_state_number BETWEEN 16 and 1024  
 AND co.date_invoiced < CURDATE()  
 GROUP BY c.year_quarter  
) co on co.year_quarter = okr.year_quarter  
JOIN  
(  
 SELECT  
  c.year_quarter,  
  SUM(s.stylist_weighted_activity)/COUNT(DISTINCT s.date_invoiced) as stylists  
 FROM bi.stylist_weighted_activity s  
 JOIN dwh.calendar c on c.date = s.date_invoiced  
 WHERE c.working_days = 1  
 AND c.date >= '2014-10-01'  
 GROUP by 1  
) s on s.year_quarter = okr.year_quarter


