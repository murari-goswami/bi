-- Name: tableau.management_order_type
-- Created: 2015-04-24 18:22:15
-- Updated: 2015-04-27 12:44:30

CREATE view "tableau.management_order_type" 
AS

SELECT
  co.order_id,
  CASE WHEN length(pr.preview_name)>2 THEN pr.preview_name ELSE null END as preview_name,
  CASE
      WHEN co.customer_preview_id is not null AND co.preview_id is null THEN 'Customer Preview'
      ELSE pr.preview_type
  END as preview_type,
  co.order_state_number as state,
  CASE 
    WHEN co.date_invoiced is not null then 1
    ELSE 0
  END AS invoiced_order,
  co.box_type,
  co.order_type,
  co.sales_channel,
  co.shipping_country,
  co.sales_channel_special,
  co.revenue_state,
  cast(co.date_invoiced as date) as date_invoiced,
  cast(co.date_created as date) as date_created,
  cast(co.date_incoming as date) as date_incoming,
  co.articles_sent as total_articles,
  co.sales_sent as total_gross_retail_basket_in_eur,
  rq.returned_gross_retail_basket_in_eur,
  rq.kept_gross_retail_basket_in_eur,
  case 
  	when co.sales_sent=0 then null
  	when rq.returned_gross_retail_basket_in_eur=0 then null
  	else rq.returned_gross_retail_basket_in_eur/co.sales_sent
  end as return_rate,
  co.billing_net_sales as total_net_sales_in_eur,
  lim_look.limited_look,
  vi.visits
FROM bi.customer_order co
LEFT JOIN
(
	SELECT
		order_id,
		  case when co.revenue_state='Final' then co.sales_returned else 0 end as returned_gross_retail_basket_in_eur,
		  case when co.revenue_state='Final' then co.sales_kept else 0 end as kept_gross_retail_basket_in_eur
	FROM "bi.customer_order"  co
)rq on rq.order_id=co.order_id
LEFT JOIN raw.previews pr on pr.preview_id = co.preview_id
/*this join is to get if the customer came from facebook campaign, order is created based on ready outfit (limited-look=look[1-8])*/
LEFT JOIN
(
    SELECT 
      c.customer_id,
      c.additional_info as limited_look
    FROM raw.customer c
    WHERE c.additional_info like '{limited-look%'
)lim_look on lim_look.customer_id=co.customer_id
/*Number of Visits*/
LEFT JOIN
(
  SELECT
    co.order_type, 
    visits, 
    min(co.order_id) min_order_id
  FROM bi.customer_order co
  left join 
  (
    SELECT 
      date_created  as "date",
      sum(visits) as visits
    FROM bi.marketing_funnel_by_date_domain_channel_device
    GROUP by 1
  )at on at."date"=cast(co.date_created as date)
  GROUP BY 1,2
)vi on vi.min_order_id=co.order_id


