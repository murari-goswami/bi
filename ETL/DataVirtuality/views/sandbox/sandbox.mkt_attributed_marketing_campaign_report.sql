-- Name: sandbox.mkt_attributed_marketing_campaign_report
-- Created: 2015-08-27 15:03:54
-- Updated: 2015-09-01 11:59:52

CREATE VIEW sandbox.mkt_attributed_marketing_campaign_report
AS

SELECT
   ab.date_incoming,
   ab.domain,
   ab.marketing_channel,
   ab.source,
   ab.medium,
   ab.term,
   at.incoming_first_orders,
   at.invoiced_first_orders,
   at.sales_sent,
   at.sales_kept,
   at.billing_net_sales,
   vi.visits 
FROM
(
   SELECT
      c.date as date_incoming,
      ca.domain,
      ca.marketing_channel,
      CASE 
         WHEN ca.source is null THEN 'Not set'
         ELSE ca.source
      END AS source,
      CASE 
         WHEN ca.medium is null THEN 'Not set'
         ELSE ca.medium
      END AS medium,
      CASE 
         WHEN ca.term is null THEN 'Not set'
         ELSE ca.term
      END AS term
   FROM dwh.calendar c 
   CROSS JOIN 
   (
      SELECT
         domain,
         marketing_channel,
         source,
         medium,
         term            
      FROM
      (   
         SELECT
            domain,
            marketing_channel,
            CASE 
               WHEN source is null THEN 'Not set'
               ELSE source
            END AS source,
            CASE 
               WHEN medium is null THEN 'Not set'
               ELSE medium
            END AS medium,
            CASE 
               WHEN term is null THEN 'Not set'
               ELSE term
            END AS term 
         FROM "bi.marketing_order_attribution_aggregated"
         GROUP BY 1,2,3,4,5
         UNION
         SELECT
            domain,
            marketing_channel,
            CASE 
               WHEN source is null THEN 'Not set'
               ELSE source
            END AS source,
            CASE 
               WHEN medium is null THEN 'Not set'
               ELSE medium
            END AS medium,
            CASE 
               WHEN term is null THEN 'Not set'
               ELSE term
            END AS term 
         FROM raw.daily_visits
         GROUP BY 1,2,3,4,5
      ) ab
      GROUP BY 1,2,3,4,5
   ) ca
WHERE c.date >= '2014-01-01'
AND c.date < CURDATE()
) ab
LEFT JOIN
(
  SELECT
      "date" as date_incoming,
      domain,
      marketing_channel,
      CASE 
        WHEN source is null THEN 'Not set'
        ELSE source
      END AS source,
      CASE 
         WHEN medium is null THEN 'Not set'
        ELSE medium
      END AS medium,
      CASE 
        WHEN term is null THEN 'Not set'
        ELSE term
      END AS term,
      SUM(incoming_first_orders) as incoming_first_orders,
      SUM(invoiced_first_orders) as invoiced_first_orders,
      SUM(sales_sent) as sales_sent,
      SUM(sales_kept) as sales_kept,
      SUM(billing_net_sales) as billing_net_sales
   FROM bi.marketing_order_attribution_aggregated
   WHERE reporting_type = 'date_incoming'
   GROUP BY 1,2,3,4,5,6
) at ON  at.date_incoming = ab.date_incoming AND
         at.domain = ab.domain AND
         at.marketing_channel = ab.marketing_channel AND
         at.source =  ab.source AND
         at.medium = ab.medium AND
         at.term = ab.term
LEFT JOIN
(
   SELECT
      date_created,
      domain,
      marketing_channel,
      source,
      medium,
      term,
      visits
   FROM
   (
   SELECT 
      date_created,
      domain,
      marketing_channel,
      CASE
        WHEN source is null THEN 'Not set'
        ELSE LOWER(source)
      END as source,
      CASE
        WHEN medium is null THEN 'Not set'
        ELSE LOWER(medium)
      END as medium,
      CASE
        WHEN term is null THEN 'Not set'
        ELSE LOWER(term)
      END as term,
      SUM(visits) as visits
   FROM raw.daily_visits
   GROUP BY 1,2,3,4,5,6
   ) vs
) vi ON  vi.date_created = ab.date_incoming AND
         vi.domain = ab.domain AND
         vi.marketing_channel = ab.marketing_channel AND
         vi.source =  ab.source AND
         vi.medium = ab.medium AND
         vi.term = ab.term
WHERE vi.visits is not null OR at.incoming_first_orders is not null


