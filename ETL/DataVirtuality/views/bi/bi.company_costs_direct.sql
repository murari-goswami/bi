-- Name: bi.company_costs_direct
-- Created: 2015-04-28 15:30:54
-- Updated: 2015-04-28 16:25:32

CREATE VIEW bi.company_costs_direct
AS

/* Past costs from the finance team are entered into dwh.company_costs_direct_monthly,
are converted into a cost per order for the current number of real orders in each month */

WITH orders_invoiced AS
(
  SELECT 
    cal1.year_month,
    co1.shipping_country,
    COUNT(*) as num_orders
    FROM bi.customer_order co1
    JOIN dwh.calendar cal1 on cal1.date = CAST(co1.date_invoiced as date)
    WHERE co1.is_real_order = 'Real Order'
    AND co1.order_state_number >= 16
    AND co1.order_state_number < 2048
    GROUP BY 1,2
)

/* Join monthly costs to calendar to get daily cost per order */
SELECT
    cal.date as date_invoiced,
    x.country,
    x.cost_type,
    x.cost_per_order
FROM dwh.calendar cal
JOIN 
(
    /* First join real costs to orders to get cost per order for past months */
    SELECT
        od1.year_month,
        cos1.country_code as country,
        cos1.cost_type,
        CAST(cos1.cost as bigdecimal) as cost,
        cos1.cost/od1.num_orders as cost_per_order
    FROM orders_invoiced od1
    LEFT JOIN raw.company_cost cos1 on cos1.year_month = od1.year_month AND od1.shipping_country = cos1.country_code

    /* Now do a UNION to use the latest known month's costs for all future months */
    UNION
    SELECT
        b.year_month,
        a.country,
        a.cost_type,
        CAST(a.cost as bigdecimal) as cost,
        a.cost_per_order
    FROM
    (
        SELECT
        cos2.cost_type,
        cos2.country_code as country,
        cos2.cost,
        cos2.cost/od2.num_orders as cost_per_order
        FROM orders_invoiced od2
        JOIN raw.company_cost cos2 on cos2.year_month = od2.year_month AND od2.shipping_country = cos2.country_code
        WHERE cos2.cost_type<>'payment' AND cos2.year_month = (SELECT MAX(year_month) FROM raw.company_cost WHERE cost_type<>'payment')  /* Select the last month with known costs */
    ) a
    /* Cross join the costs with all months that have no cost data */
    CROSS JOIN
    (
    SELECT
      od3.year_month
    FROM 
    (
      SELECT 
        DISTINCT ca1.year_month
      FROM bi.customer_order co3
      JOIN dwh.calendar ca1 on ca1.date = CAST(co3.date_invoiced as date)
      WHERE co3.is_real_order = 'Real Order'
      AND co3.order_state_number >= 16
      AND co3.order_state_number < 2048
    ) od3
    LEFT JOIN (select * from raw.company_cost where cost_type<>'payment') cos3 on cos3.year_month = od3.year_month
    WHERE cos3.year_month is null
    AND od3.year_month > '2014'
    ) b
) x on x.year_month = cal.year_month


