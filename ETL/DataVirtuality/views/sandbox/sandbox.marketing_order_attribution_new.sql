-- Name: sandbox.marketing_order_attribution_new
-- Created: 2015-04-29 16:20:45
-- Updated: 2015-05-28 12:39:33

CREATE VIEW sandbox.marketing_order_attribution_new
AS
SELECT
  at.date_incoming,
  'date_incoming' as reporting_type,
  at.default_domain as domain,
  at.order_type,
  at.marketing_channel,
  at.incoming_orders,
  at.invoiced_orders,
  ROUND(COALESCE(SUM(ab.incoming_orders_untracked)/SUM(ab.incoming_orders_total),0),2) as share_untracked,
  CASE 
    WHEN SUM(ab.incoming_orders_total) is null OR SUM(ab.incoming_orders_total - ab.incoming_orders_untracked) = 0 THEN 0
    WHEN SUM(ab.incoming_orders_untracked) is null THEN SUM(at.incoming_orders)
    ELSE ROUND(SUM(at.incoming_orders) / SUM(ab.incoming_orders_total - ab.incoming_orders_untracked) * SUM(ab.incoming_orders_total),2)
  END AS incoming_orders_adjusted,
  CASE
    WHEN SUM(ab.invoiced_orders_total) is null OR SUM(ab.invoiced_orders_total - ab.invoiced_orders_untracked) = 0 THEN 0
    WHEN SUM(ab.invoiced_orders_untracked) is null THEN SUM(at.invoiced_orders)
    ELSE ROUND(SUM(at.invoiced_orders) / SUM(ab.invoiced_orders_total - ab.invoiced_orders_untracked) * SUM(ab.invoiced_orders_total),2)
  END AS invoiced_orders_adjusted
FROM
(
SELECT 
      cast(co.date_incoming as date) as date_incoming,
      cu.default_domain,
      order_type,
      marketing_channel,
      SUM(ROUND(oa.contact_weight,2)) as incoming_orders,
      SUM(CASE WHEN co.date_invoiced is not null AND co.order_state_number >= 16 THEN ROUND(oa.contact_weight,2) ELSE 0 END) as invoiced_orders
    FROM bi.customer_order co
    LEFT JOIN bi.marketing_order_attribution oa ON oa.order_id = co.order_id
    LEFT JOIN "bi.customer" cu ON cu.customer_id = co.customer_id
    WHERE co.date_incoming >= '2014-01-01'
    AND co.is_real_order = 'Real Order'
    AND marketing_channel != 'Untracked'
    GROUP BY 1,2,3,4
) at
LEFT JOIN
(
  SELECT 
      cast(co.date_incoming as date) as date_incoming,
      cu.default_domain,
      order_type,
      SUM(ROUND(oa.contact_weight,2)) as incoming_orders_total,
      SUM(CASE WHEN co.date_invoiced is not null AND co.order_state_number >= 16 THEN ROUND(oa.contact_weight,2) ELSE 0 END) as invoiced_orders_total,
      SUM(CASE WHEN mi.marketing_channel_group = 'Untracked' THEN (ROUND(oa.contact_weight,2)) else 0 END) as incoming_orders_untracked,
      SUM(CASE WHEN mi.marketing_channel_group = 'Untracked' AND co.date_invoiced is not null AND co.order_state_number >= 16 THEN ROUND(oa.contact_weight,2) ELSE 0 END) as invoiced_orders_untracked          
    FROM bi.customer_order co
    LEFT JOIN bi.marketing_order_attribution oa ON oa.order_id = co.order_id
    LEFT JOIN "bi.customer" cu ON cu.customer_id = co.customer_id
    LEFT JOIN dwh.marketing_investor_reporting_brand_factors mi ON  mi.marketing_channel = oa.marketing_channel AND mi.domain = cu.default_domain
    WHERE co.date_incoming >= '2014-01-01'
    AND co.is_real_order = 'Real Order'
    GROUP BY 1,2,3
) ab ON ab.date_incoming = at.date_incoming AND ab.default_domain = at.default_domain AND ab.order_type = at.order_type
GROUP BY 1,2,3,4,5,6,7
UNION ALL
SELECT
  at.date_incoming,
  'date_invoiced' as reporting_type,
  at.default_domain as domain,
  at.order_type,
  at.marketing_channel,
  null as incoming_orders,
  at.invoiced_orders,
  ROUND(COALESCE(SUM(ab.invoiced_orders_untracked)/SUM(ab.invoiced_orders_total),0),2) as share_untracked,
  null as incoming_orders_adjusted,
  CASE
    WHEN SUM(ab.invoiced_orders_total) is null OR SUM(ab.invoiced_orders_total - ab.invoiced_orders_untracked) = 0 THEN 0
    WHEN SUM(ab.invoiced_orders_untracked) is null THEN SUM(at.invoiced_orders)
    ELSE ROUND(SUM(at.invoiced_orders) / SUM(ab.invoiced_orders_total - ab.invoiced_orders_untracked) * SUM(ab.invoiced_orders_total),2)
  END AS invoiced_orders_adjusted
FROM
(
SELECT 
      cast(co.date_invoiced as date) as date_incoming,
      cu.default_domain,
      order_type,
      marketing_channel,
      SUM(CASE WHEN co.date_invoiced is not null AND co.order_state_number >= 16 THEN ROUND(oa.contact_weight,2) ELSE 0 END) as invoiced_orders
    FROM bi.customer_order co
    LEFT JOIN bi.marketing_order_attribution oa ON oa.order_id = co.order_id
    LEFT JOIN "bi.customer" cu ON cu.customer_id = co.customer_id
    WHERE co.date_incoming >= '2014-01-01'
    AND co.is_real_order = 'Real Order'
    AND marketing_channel != 'Untracked'
    GROUP BY 1,2,3,4
) at
LEFT JOIN
(
  SELECT 
      cast(co.date_invoiced as date) as date_incoming,
      cu.default_domain,
      order_type,
      SUM(CASE WHEN co.date_invoiced is not null AND co.order_state_number >= 16 THEN ROUND(oa.contact_weight,2) ELSE 0 END) as invoiced_orders_total,
      SUM(CASE WHEN mi.marketing_channel_group = 'Untracked' AND co.date_invoiced is not null AND co.order_state_number >= 16 THEN ROUND(oa.contact_weight,2) ELSE 0 END) as invoiced_orders_untracked          
    FROM bi.customer_order co
    LEFT JOIN bi.marketing_order_attribution oa ON oa.order_id = co.order_id
    LEFT JOIN "bi.customer" cu ON cu.customer_id = co.customer_id
    LEFT JOIN dwh.marketing_investor_reporting_brand_factors mi ON  mi.marketing_channel = oa.marketing_channel AND mi.domain = cu.default_domain
    WHERE co.date_incoming >= '2014-01-01'
    AND co.is_real_order = 'Real Order'
    GROUP BY 1,2,3
) ab ON ab.date_incoming = at.date_incoming AND ab.default_domain = at.default_domain AND ab.order_type = at.order_type
GROUP BY 1,2,3,4,5,6,7


