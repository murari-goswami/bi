-- Name: tableau.finance_conversion_rate
-- Created: 2015-09-21 17:12:04
-- Updated: 2015-09-21 17:37:36

CREATE VIEW tableau.finance_conversion_rate
AS

SELECT 
	a.date,
	a.country,
	COALESCE(b.visits,0) AS visits,
	COALESCE(c.orders_incoming,0) AS orders_incoming,
	COALESCE(c.orders_invoiced,0) orders_invoiced
FROM 
(
  SELECT
    c.date,
    x.country
  FROM dwh.calendar c 
  CROSS JOIN (SELECT distinct shipping_country as country FROM bi.customer_order where shipping_country is not null) x
  WHERE c.date > '2014'
  AND c.date < CURDATE()
) a
LEFT JOIN
(
  SELECT 
    date_created  as "date",
    domain as country,
    sum(visits) as visits 
  FROM "bi.marketing_funnel_by_date_domain_channel_device"
  group by 1,2
)b on a."date"=b."date" and a.country=b.country
LEFT JOIN
(

  SELECT  
    CAST(co.date_incoming as date) as "date", 
    co.shipping_country as country, 
    COUNT(DISTINCT order_id) AS orders_incoming,
    COUNT(CASE WHEN co.date_invoiced is not null then order_id END) as orders_invoiced
  FROM bi.customer_order co 
  WHERE co.is_real_order = 'Real Order' 
  AND co.date_created > '2014'
  GROUP BY 1,2
)c  on c."date"=b."date" and c.country=b.country


