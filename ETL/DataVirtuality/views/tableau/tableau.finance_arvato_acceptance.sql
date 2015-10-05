-- Name: tableau.finance_arvato_acceptance
-- Created: 2015-08-10 19:36:37
-- Updated: 2015-08-24 16:07:57

CREATE VIEW tableau.finance_arvato_acceptance
AS

SELECT
  cal."date",
  cal.country,
  cal.order_type,
  COALESCE(co_1.nb_orders,0) AS nb_orders,
  COALESCE(co_1.nb_orders_green_dark,0) AS nb_orders_green_dark,
  COALESCE(co_1.nb_orders_address_issues,0) AS nb_orders_address_issues,
  COALESCE(co_1.nb_orders_green_dark_2,0) AS nb_orders_green_dark_2,
  COALESCE(arv_1.nb_orders_red_dark,0) AS nb_orders_red_dark
FROM
(
  SELECT 
    "date",
    a.default_domain as country,
    b.order_type 
  FROM "dwh.calendar" 
  CROSS JOIN (SELECT DISTINCT default_domain FROM bi.customer)a
  CROSS JOIN (SELECT DISTINCT order_type FROM bi.customer_order)b
)cal
LEFT JOIN
(
  SELECT
    CAST(co.date_created AS DATE) AS date_created,
    co.shipping_country,
    co.order_type,
       COUNT(DISTINCT CASE WHEN arv.arvatoresult_1 IS NOT NULL THEN co.order_id ELSE NULL END) as nb_orders,
    COUNT(DISTINCT CASE WHEN arv.arvatoresult_1 IS NOT NULL AND arv.arvatoresult_1='GREEN_DARK' THEN co.order_id ELSE NULL END) as nb_orders_green_dark,
    COUNT(DISTINCT CASE WHEN arv.arvatoresult_1 IS NOT NULL AND arv.arvatoresult_1<>'GREEN_DARK' AND arv.arvatoresult_2='GREEN_DARK' THEN co.order_id ELSE NULL END) as nb_orders_green_dark_2,
    COUNT(DISTINCT CASE WHEN arv.responseCode_1 IN ('AVD100','AVD101','AVD998','AVD999') THEN co.order_id ELSE NULL END) as nb_orders_address_issues
  FROM bi.customer_order co
  LEFT JOIN "raw.arvato_first_address_risk_check" arv on arv.order_id=co.order_id
  GROUP BY 1,2,3
)co_1 on co_1.date_created=cal."date" and co_1.shipping_country=cal.country and co_1.order_type=cal.order_type
/*Orders with RED DARK*/
LEFT JOIN
(
  SELECT
    cast(a1.arv_date_created as date) as date_created,
    a1.default_domain as country,
    a1.order_type,
    COUNT(DISTINCT order_id) as nb_orders_red_dark
  FROM raw.arvato_first_address_risk_check a1
  WHERE arvatoresult_1='RED_DARK'
  GROUP BY 1,2,3
)arv_1 on arv_1.date_created=cal."date" and arv_1.country=cal.country and arv_1.order_type=cal.order_type
WHERE "date"<=TIMESTAMPADD(SQL_TSI_DAY,-1,curdate())


