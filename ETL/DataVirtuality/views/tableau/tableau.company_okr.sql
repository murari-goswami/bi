-- Name: tableau.company_okr
-- Created: 2015-09-30 09:41:57
-- Updated: 2015-09-30 09:41:57

CREATE VIEW tableau.company_okr
AS

with okr as
(
   SELECT   
    o.year_quarter,  
    o.new_customer_target,  
    o.repeat_customer_target,  
    o.cart_value_target as avg_basket_target,  
    o.revenue_per_stylist_target, 
    o.cac,
    SUM(c.working_days) as working_days_quarter,  
    SUM(CASE WHEN c.date < CURDATE() THEN c.working_days ELSE 0 END) as working_days_gone,  
    SUM(CASE WHEN c.date >= CURDATE() THEN c.working_days ELSE 0 END) as working_days_left  
   FROM dwh.company_okrs_quarterly o  
   JOIN dwh.calendar c on c.year_quarter = o.year_quarter AND c.year_quarter='2015-Q3'
   GROUP BY 1,2,3,4,5,6
),
c_order as
(
  SELECT
      c.year_quarter,
      COUNT(CASE WHEN order_type = 'First Order' THEN order_id ELSE null END) as new_customers,  
      COUNT(CASE WHEN order_type in ('Repeat Order', 'Outfittery Club Order') THEN order_id ELSE null END) as repeat_customers,  
      AVG(sales_kept) as avg_basket
  FROM bi.customer_order co   
  JOIN dwh.calendar c on c.date = CAST(co.date_invoiced as date)  
  WHERE co.is_real_order = 'Real Order'  
  AND co.order_state_number BETWEEN 16 and 1024  
  AND co.date_invoiced < CURDATE()  
  AND c.year_quarter='2015-Q3' 
  GROUP BY 1
),
nps AS 
( 
  SELECT 
    SUM
    (
      CASE 
      WHEN nps_score>=0 and nps_score<=6 then 1 
      else 0 
      end 
    ) as nb_of_detractors, 
    SUM 
    ( 
      CASE 
      WHEN nps_score>=9 and nps_score<=10 then 1 
      else 0 
    end 
    ) as nb_of_promoters, 
    COUNT(DISTINCT order_id) as nb_of_answers 
  FROM bi.customer_order co 
  WHERE CAST(co.date_nps_submitted as date) BETWEEN '2015-07-01' AND '2015-09-30' 
)

SELECT 
  cast('New Customers' as string) as key_results,
  o1.new_customer_target AS  target,
  co.new_customers AS actual
FROM okr o1
JOIN c_order co on co.year_quarter=o1.year_quarter
GROUP BY 1,2,3

UNION 
SELECT 
  cast('Repeat Customers' as string) as key_results,
  o2.repeat_customer_target AS  target,
  co.repeat_customers AS actual
FROM okr o2
JOIN c_order co on co.year_quarter=o2.year_quarter
GROUP BY 1,2,3

UNION 
SELECT 
  cast('Average Cart Value' as string) as key_results,
  o3.avg_basket_target AS  target,
  co.avg_basket AS actual
FROM okr o3 
JOIN c_order co on co.year_quarter=o3.year_quarter
GROUP BY 1,2,3

UNION
SELECT  
CAST('NPS Score' as string) as key_results,
65 as target,
(cast(nb_of_promoters as double)/cast(nb_of_answers as double)-cast(nb_of_detractors as double)/cast(nb_of_answers as double))*100 as actual
FROM nps

UNION
SELECT 
  cast('CAC' as string) as key_results,
  56 AS  target,
  cos.cost/co_4.new_customers AS actual
FROM okr o4
JOIN
(
	SELECT  
    	year_quarter,  
    	sum(cost) AS cost 
  	FROM raw.marketing_costs co    
  	JOIN dwh.calendar c on c.date = CAST(co.date_created as date)   
  	WHERE co.date_created < CURDATE() 
  	AND c.year_quarter='2015-Q3'
  	GROUP BY 1
)cos on o4.year_quarter=cos.year_quarter
JOIN c_order co_4 on cos.year_quarter=co_4.year_quarter

UNION
SELECT
	cast('Club Customers' as string) as key_results,
	14000 as target,
	count(*) as actual
FROM "raw.customer_salesforce" club
JOIN c_order co_4 on '2015-Q3'=co_4.year_quarter
WHERE club_member=1


