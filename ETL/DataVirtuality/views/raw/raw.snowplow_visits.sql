-- Name: raw.snowplow_visits
-- Created: 2015-05-26 13:51:22
-- Updated: 2015-09-04 17:18:25

CREATE view raw.snowplow_visits
AS


SELECT
  DISTINCT
  sp.visitor_id,
  sp.visitor_session_id,
  id.user_id,
  sp.date_created,
  sp.device_type,
  sp.br_family,
  sp.br_type,
  sp.os_name,
  sp.os_family,
  sp.geo_country,
  CASE
    WHEN sp.url_host like '%.de%' THEN 'DE'
    WHEN sp.url_host like '%.at%' THEN 'AT'
    WHEN sp.url_host like '%.ch%' THEN 'CH'
    WHEN sp.url_host like '%.nl%' THEN 'NL'
    WHEN sp.url_host like '%.be%' THEN 'BE'
    WHEN sp.url_host like '%.lu%' THEN 'LU'
    WHEN sp.url_host like '%.dk%' THEN 'DK'
    WHEN sp.url_host like '%.no%' THEN 'NO'
    WHEN sp.url_host like '%.se%' THEN 'SE'
    WHEN sp.url_host like '%.com%' THEN 'COM'
  END AS domain,
  sp.marketing_channel,
  sp.marketing_subchannel,
  sp.source,
  sp.medium,
  sp.campaign,
  sp.term,
  sp.session_count,
  pv.pageviews,
  pv.session_length,
  sp.url_path as landing_page_url_path,
  qu.funnel_questionnaire_visit,  
  cc.funnel_customer_create_visit,
  pe.funnel_profile_edit_visit,
  oc.funnel_orders_create_visit,
  pc.funnel_pick_call_visit,
  sx.funnel_successpage_visit,
  sxn.funnel_success_nc_visit
FROM raw.snowplow_pageviews sp
LEFT JOIN
  (
  SELECT 
    visitor_id,
    session_count,
    max(pageview_count) as pageviews,
    TIMESTAMPDIFF(SQL_TSI_SECOND, min(date_created), max(date_created)) as session_length
  FROM raw.snowplow_pageviews 
  GROUP BY 1,2  
  ) pv ON pv.visitor_id = sp.visitor_id AND pv.session_count = sp.session_count
LEFT JOIN
(
  SELECT
  DISTINCT 
  visitor_session_id ,
  1 as funnel_questionnaire_visit 
  FROM "raw.snowplow_pageviews"
  WHERE url_path like '%survey%'  
) qu ON qu.visitor_session_id = sp.visitor_session_id
LEFT JOIN
(
  SELECT 
    DISTINCT
    visitor_session_id,
    1 as funnel_customer_create_visit 
  FROM "raw.snowplow_pageviews"
  WHERE url_path like '%/customers/create%' 
) cc ON cc.visitor_session_id = sp.visitor_session_id
LEFT JOIN
(
  SELECT 
    DISTINCT
    visitor_session_id, 
    1 as funnel_profile_edit_visit 
  FROM "raw.snowplow_pageviews"
  WHERE url_path like '%/profile/edit%'
) pe ON pe.visitor_session_id = sp.visitor_session_id
LEFT JOIN
(
  SELECT 
    DISTINCT
    visitor_session_id,
    session_count, 
    1 as funnel_orders_create_visit 
  FROM "raw.snowplow_pageviews"
  WHERE url_path like '%/orders/create%'  
) oc ON oc.visitor_session_id = sp.visitor_session_id
LEFT JOIN
(
  SELECT 
    DISTINCT
    visitor_session_id, 
    1 as funnel_pick_call_visit 
  FROM "raw.snowplow_pageviews"
  WHERE url_path like '%/pickCallAppointment%'
) pc ON pc.visitor_session_id = sp.visitor_session_id
LEFT JOIN
(
  SELECT 
    DISTINCT
    visitor_session_id,  
    1 as funnel_success_nc_visit 
  FROM "raw.snowplow_pageviews"
  WHERE url_path like '%/successScreenFt%'
) sxn ON sxn.visitor_session_id = sp.visitor_session_id
LEFT JOIN
(
  SELECT 
    DISTINCT
    visitor_session_id,  
    1 as funnel_successpage_visit 
  FROM "raw.snowplow_pageviews"
  WHERE url_path like '%/successScreen%'
) sx ON sx.visitor_session_id = sp.visitor_session_id
LEFT JOIN 
(
   SELECT
      visitor_session_id,
      user_id
   FROM
   (
      SELECT
         distinct
         visitor_session_id,
         user_id
      FROM
      (
         SELECT
            visitor_session_id, 
            user_id,
            RANK() OVER(PARTITION by visitor_session_id ORDER BY MAX(date_created) desc, RAND() desc)  as login_desc
         FROM raw.snowplow_pageviews
         WHERE user_id is not null
         GROUP BY 1,2
      ) uid
      WHERE login_desc = 1
   ) ab
GROUP BY 1,2
) id ON id.visitor_session_id = sp.visitor_session_id
WHERE sp.pageview_count = 1 
AND sp.visitor_id is not null


