-- Name: raw.company_cost
-- Created: 2015-04-24 18:22:21
-- Updated: 2015-04-28 14:50:57

CREATE VIEW raw.company_cost
AS

WITH c_order AS
(
  SELECT
    c.year_month,
    co.shipping_country as country,
    SUM(co.billing_net_sales) as billing_net_sales
  FROM bi.customer_order co
  JOIN dwh.calendar c on c.date = CAST(co.date_invoiced as date)
  WHERE co.is_real_order = 'Real Order'
  AND co.date_invoiced is not null
  AND co.date_invoiced > '2014'
  AND co.order_state_number >= 16 
  AND co.order_state_number < 2048
  GROUP BY 1,2
),
c_cost as
(
  SELECT 
    * 
  FROM dwh.company_costs_direct_monthly
)

SELECT
  c1.year_month,
  c1.country_code,
  c1.cost_type,
  case 
      when c1.year_month>='2015-03' and c1.cost_type='payment' then -(co1.billing_net_sales*c1.cost)
      else c1.cost
  end as cost
FROM c_cost c1 
LEFT JOIN c_order co1 on c1.year_month = co1.year_month AND co1.country = c1.country_code

/*Future payment costs should be calculated based on the billing net sales*/

UNION ALL
SELECT
  co2.year_month,
  co2.country as country_code,
  a2.cost_type,
  -(co2.billing_net_sales*a2.cost) as cost
FROM c_order co2
LEFT JOIN
(
  /*This join gets the last payment cost percentage*/
  SELECT
    cp.year_month,
    cp.country_code,
    cp.cost_type,
    cp.cost
  FROM c_cost cp
  WHERE cp.year_month=(SELECT max(year_month) FROM dwh.company_costs_direct_monthly)
  and cp.cost_type='payment'
)a2 on a2.country_code=co2.country
WHERE co2.year_month=(SELECT max(year_month) FROM c_order)


