-- Name: views.marketing_order
-- Created: 2015-04-24 18:18:05
-- Updated: 2015-07-08 16:01:32

CREATE view views.marketing_order
as
select
/* --------------------------------------------------- google analytics  --------------------------------------------------------------------------------- */
  case
    when ga.transaction_id is null and tv.order_id is not null then tv.order_id
    when ga.transaction_id is not null and tv.order_id is null then ga.transaction_id
    when ga.transaction_id is not null and tv.order_id is not null then ga.transaction_id
  end as "order_id",
  case
    when ga.transaction_id is null then 'not tracked by google analytics'
    else 'tracked by google analytics'
  end as "tracked_by_google_analytics",
  ga.source as "utm_source",
  ga.medium as "utm_medium",
  ga.source_medium as "utm_source_medium",
  ga.keyword as "utm_keyword",
  ga.campaign as "utm_campaign",
  ga.cam_bit_1 as "utm_campaign_bit_1",
  ga.cam_bit_2 as "utm_campaign_bit_2",
  ga.cam_bit_3 as "utm_campaign_bit_3",
  ga.cam_bit_4 as "utm_campaign_bit_4",
  ga.cam_bit_5 as "utm_campaign_bit_5",
  ga.cam_bit_6 as "utm_campaign_bit_6",
  ga.cam_bit_7 as "utm_campaign_bit_7",
  ga.cam_bit_8 as "utm_campaign_bit_8",
  ga.cam_bit_9 as "utm_campaign_bit_9",
  ga.cam_bit_10 as "utm_campaign_bit_10",
  ga.cam_bit_11 as "utm_campaign_bit_11",
  ga.cam_bit_12 as "utm_campaign_bit_12",
  ga.cam_bit_13 as "utm_campaign_bit_13",
  ga.cam_bit_14 as "utm_campaign_bit_14",
  ga.cam_bit_15 as "utm_campaign_bit_15",
  ga.cam_bit_16 as "utm_campaign_bit_16",
  ga.cam_bit_17 as "utm_campaign_bit_17",
  ga.cam_bit_18 as "utm_campaign_bit_18",
  ga.cam_bit_19 as "utm_campaign_bit_19",
  ga.cam_bit_20 as "utm_campaign_bit_20",
  ga.optimizely_campaign as "optimizely_campaign",
  ga.adcontent as "utm_adcontent",
  ga.referred_by_customer as "referred_by_customer",
  ga.referring_customer_token as "referring_customer_token",
  ga.device_category as "device_category",
  ga.operating_system as "operating_system",
  ga.operating_system_version as "operating_system_version",
  ga.browser as "browser",
  ga.browser_version as "browser_version",
  ga.java_enabled as "java_enabled",
  ga.flash_version as "flash_version",
  ga.mobile_device_branding as "mobile_device_branding",
  ga.mobile_device_model as "mobile_device_model",
  ga.mobile_device_info as "mobile_device_info",
  ga.screen_colors as "screen_colors",
  ga.screen_resolution as "screen_resolution",
  ga.visits_per_transactionid as "visits_per_transaction_id",
/* --------------------------------------------------- rapidape tv information --------------------------------------------------------------------------------- */
  case  
    when tv.order_id is null    then 'not flagged as tv'
    when tv.order_id is not null  then 'flagged as tv'
  end as "flagged_as_tv",
  tv."date_spot_aired" as "tv_spot_date_aired",
  tv."timestamp_spot_aired" as "tv_spot_time_aired",
  tv.tv_station as "tv_spot_station",
  tv.tv_program as "tv_spot_program",
  case
/* --------------------------------------------------- case marketing channel when tv is not flagged by rapidape ----------------------------------------------- */
    when tv.order_id is null and ga.cam_bit_1!= 'rem' and ga.channel= 'affiliate' then 'affiliate'
    when tv.order_id is null and ga.cam_bit_1!= 'rem' and ga.channel= 'crm' then 'crm'
    when tv.order_id is null and ga.cam_bit_1!= 'rem' and ga.channel= 'display'      then 'display'
    when tv.order_id is null and ga.cam_bit_1!= 'rem' and ga.channel= 'facebook'       then 'facebook'
    when tv.order_id is null and ga.cam_bit_1!= 'rem' and ga.channel= 'google gdn'     then 'google gdn'
    when tv.order_id is null and ga.cam_bit_1!= 'rem' and ga.channel= 'kooperation'    then 'kooperation'
    when tv.order_id is null and ga.cam_bit_1!= 'rem' and ga.channel= 'praemienprogramm'   then 'praemienprogramm'
    when tv.order_id is null and ga.cam_bit_1!= 'rem' and ga.channel= 'remarketing'    then 'remarketing'
    when tv.order_id is null and ga.cam_bit_1!= 'rem' and ga.channel= 'twitter'      then 'twitter'
    when tv.order_id is null and ga.cam_bit_1!= 'rem' and ga.channel= 'youtube'      then 'youtube'
    when tv.order_id is null and ga.cam_bit_1!= 'rem' and ga.channel= 'google sem' and ga.cam_bit_3!=  'brand' then 'google sem nobrand'
    when tv.order_id is null and ga.cam_bit_1!= 'rem' and ga.channel= 'google sem' and ga.cam_bit_3= 'brand' then 'google sem brand'
    when tv.order_id is null and ga.cam_bit_1!= 'rem' and ga.channel= 'google sem' and ga.cam_bit_1= 'bing' and ga.cam_bit_1= '1' then 'google sem brand'
    when tv.order_id is null and ga.cam_bit_1!= 'rem' and ga.channel= 'google sem' and ga.cam_bit_1= 'bing' and ga.cam_bit_1= '0' then 'google sem nobrand'
    when tv.order_id is null and ga.channel= 'direct'       then 'direct'
    when tv.order_id is null and ga.cam_bit_1!= 'rem' and ga.channel= 'organic'      then 'organic'
    when tv.order_id is null and ga.cam_bit_1!= 'rem' and ga.channel= '(not set)'      then '(not set)'
    when tv.order_id is null and ga.cam_bit_1= 'rem'                    then 'remarketing'
/* --------------------------------------------------- case marketing channel when tv is flagged by rapidape --------------------------------------------------- */
    when tv.order_id is not null and ga.cam_bit_1!= 'rem' and ga.channel= 'affiliate'      then 'affiliate'
    when tv.order_id is not null and ga.cam_bit_1!= 'rem' and ga.channel= 'crm'        then 'crm'
    when tv.order_id is not null and ga.cam_bit_1!= 'rem' and ga.channel= 'display'      then 'display'
    when tv.order_id is not null and ga.cam_bit_1!= 'rem' and ga.channel= 'facebook'       then 'facebook'
    when tv.order_id is not null and ga.cam_bit_1!= 'rem' and ga.channel= 'google gdn'     then 'google gdn'
    when tv.order_id is not null and ga.cam_bit_1!= 'rem' and ga.channel= 'kooperation'    then 'kooperation'
    when tv.order_id is not null and ga.cam_bit_1!= 'rem' and ga.channel= 'praemienprogramm'   then 'praemienprogramm'
    when tv.order_id is not null and ga.cam_bit_1!= 'rem' and ga.channel= 'remarketing'    then 'remarketing'
    when tv.order_id is not null and ga.cam_bit_1!= 'rem' and ga.channel= 'twitter'      then 'twitter'
    when tv.order_id is not null and ga.cam_bit_1!= 'rem' and ga.channel= 'youtube'      then 'youtube'
    when tv.order_id is not null and ga.cam_bit_1!= 'rem' and ga.channel= 'google sem' and ga.cam_bit_3!=  'brand' then 'google sem nobrand'
    when tv.order_id is not null and ga.cam_bit_1!= 'rem' and ga.channel= 'google sem' and ga.cam_bit_3= 'brand' then 'tv'
    when tv.order_id is not null and ga.cam_bit_1!= 'rem' and ga.channel= 'google sem' and ga.cam_bit_1= 'bing' and ga.cam_bit_1= '0' then 'google sem nobrand'
    when tv.order_id is not null and ga.cam_bit_1!= 'rem' and ga.channel= 'google sem' and ga.cam_bit_1= 'bing' and ga.cam_bit_1= '1' then 'tv'
    when tv.order_id is not null and ga.channel= 'direct'       then 'tv'
    when tv.order_id is not null and ga.cam_bit_1!= 'rem' and ga.channel= 'organic'      then 'tv'
    when tv.order_id is not null and ga.cam_bit_1!= 'rem' and ga.channel= '(not set)'      then 'tv'
    when tv.order_id is not null and ga.cam_bit_1= 'rem'                    then 'remarketing'
    else '(not set)'
  end as "marketing_channel",
/* --------------------------------------------------- case marketing channel excluding tv (used for order distribution check - tv share) ---------------------- */ 
  case
    when ga.cam_bit_1!= 'rem' and ga.channel= 'affiliate'      then 'affiliate'
    when ga.cam_bit_1!= 'rem' and ga.channel= 'crm'        then 'crm'
    when ga.cam_bit_1!= 'rem' and ga.channel= 'display'      then 'display'
    when ga.cam_bit_1!= 'rem' and ga.channel= 'facebook'     then 'facebook'
    when ga.cam_bit_1!= 'rem' and ga.channel= 'google gdn'     then 'google gdn'
    when ga.cam_bit_1!= 'rem' and ga.channel= 'kooperation'    then 'kooperation'
    when ga.cam_bit_1!= 'rem' and ga.channel= 'praemienprogramm' then 'praemienprogramm'
    when ga.cam_bit_1!= 'rem' and ga.channel= 'remarketing'    then 'remarketing'
    when ga.cam_bit_1!= 'rem' and ga.channel= 'twitter'      then 'twitter'
    when ga.cam_bit_1!= 'rem' and ga.channel= 'youtube'      then 'youtube'
    when ga.cam_bit_1!= 'rem' and ga.channel= 'google sem' and ga.cam_bit_3!= 'brand'  then 'google sem nobrand'
    when ga.cam_bit_1!= 'rem' and ga.channel= 'google sem' and ga.cam_bit_3= 'brand' then 'google sem brand'
    when ga.cam_bit_1!= 'rem' and ga.channel= 'google sem' and ga.cam_bit_1= 'bing' and ga.cam_bit_1= '1' then 'google sem brand'
    when ga.cam_bit_1!= 'rem' and ga.channel= 'google sem' and ga.cam_bit_1= 'bing' and ga.cam_bit_1= '0' then 'google sem nobrand'
    when ga.cam_bit_1!= 'rem' then 'direct'
    when ga.cam_bit_1!= 'rem' and ga.channel= 'organic'      then 'organic'
    when ga.cam_bit_1!= 'rem' and ga.channel= '(not set)'      then '(not set)'
    when ga.cam_bit_1= 'rem'                    then 'remarketing'
    else '(not set)'
  end as "marketing_channel_excluding_tv"
from views.ga_information ga
full join views.marketingtv tv on ga.transaction_id = tv.order_id


