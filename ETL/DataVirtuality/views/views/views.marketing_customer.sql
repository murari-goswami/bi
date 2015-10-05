-- Name: views.marketing_customer
-- Created: 2015-04-24 18:22:44
-- Updated: 2015-08-07 11:06:50

CREATE view views.marketing_customer
as

WITH ga_channel AS
(
  SELECT
    fc.customer_id as "customer_id",
    fc.rnum,

    case
    /* --------------------------------------------------- case first marketing channel when tv is not flagged by rapidape ----------------------*/
      when fc.order_id is null  and fc.channel= 'affiliate' and fc.cam_bit_1!= 'rem' then 'affiliate'
      when fc.order_id is null  and fc.channel= 'crm' and fc.cam_bit_1!= 'rem' then 'crm'
      when fc.order_id is null  and fc.channel= 'display' and fc.cam_bit_1!= 'rem' then 'display'
      when fc.order_id is null  and fc.channel= 'facebook' and fc.cam_bit_1!= 'rem' then 'facebook'
      when fc.order_id is null  and fc.channel= 'google gdn' and fc.cam_bit_1!= 'rem' then 'google gdn'
      when fc.order_id is null  and fc.channel= 'kooperation' and fc.cam_bit_1!= 'rem' then 'kooperation'
      when fc.order_id is null  and fc.channel= 'praemienprogramm' and fc.cam_bit_1!= 'rem' then 'praemienprogramm'
      when fc.order_id is null  and fc.channel= 'remarketing' and fc.cam_bit_1!= 'rem' then 'remarketing'
      when fc.order_id is null  and fc.channel= 'twitter' and fc.cam_bit_1!= 'rem' then 'twitter'
      when fc.order_id is null  and fc.channel= 'youtube' and fc.cam_bit_1!= 'rem' then 'youtube'
      when fc.order_id is null  and fc.channel= 'google sem' and fc.cam_bit_1!= 'rem' and fc.cam_bit_3!= 'brand' then 'google sem nobrand'
      when fc.order_id is null  and fc.channel= 'google sem' and fc.cam_bit_1!= 'rem' and fc.cam_bit_3= 'brand' then 'google sem brand'
      when fc.order_id is null  and fc.channel= 'direct' then 'direct'
      when fc.order_id is null  and fc.channel= 'organic' and fc.cam_bit_1!= 'rem' then 'organic'
      when fc.order_id is null  and fc.channel= '(not set)' and fc.cam_bit_1!= 'rem' then '(not set)'
      when fc.order_id is null  and fc.cam_bit_1= 'rem' then 'remarketing'
    /* --------------------------------------------------- case first marketing channel when tv is flagged by rapidape ---------------------------*/
      when fc.order_id is not null  and fc.channel= 'affiliate' and fc.cam_bit_1!= 'rem' then 'affiliate'
      when fc.order_id is not null  and fc.channel= 'crm' and fc.cam_bit_1!= 'rem' then 'crm'
      when fc.order_id is not null  and fc.channel= 'display' and fc.cam_bit_1!= 'rem' then 'display'
      when fc.order_id is not null  and fc.channel= 'facebook' and fc.cam_bit_1!= 'rem' then 'facebook'
      when fc.order_id is not null  and fc.channel= 'google gdn' and fc.cam_bit_1!= 'rem' then 'google gdn'
      when fc.order_id is not null  and fc.channel= 'kooperation' and fc.cam_bit_1!= 'rem' then 'kooperation'
      when fc.order_id is not null  and fc.channel= 'praemienprogramm' and fc.cam_bit_1!= 'rem' then 'praemienprogramm'
      when fc.order_id is not null  and fc.channel= 'remarketing' and fc.cam_bit_1!= 'rem' then 'remarketing'
      when fc.order_id is not null  and fc.channel= 'twitter' and fc.cam_bit_1!= 'rem' then 'twitter'
      when fc.order_id is not null  and fc.channel= 'youtube' and fc.cam_bit_1!= 'rem'  then 'youtube'
      when fc.order_id is not null  and fc.channel= 'google sem' and fc.cam_bit_1!= 'rem' and fc.cam_bit_3!= 'brand' then 'google sem nobrand'
      when fc.order_id is not null  and fc.channel= 'google sem' and fc.cam_bit_1!= 'rem' and fc.cam_bit_3= 'brand' then 'tv'
      when fc.order_id is not null  and fc.channel= 'direct' then 'tv'
      when fc.order_id is not null  and fc.channel= 'organic' and fc.cam_bit_1!= 'rem' then 'tv'
      when fc.order_id is not null  and fc.channel= '(not set)' and fc.cam_bit_1!= 'rem' then 'tv'
      when fc.order_id is not null  and fc.cam_bit_1= 'rem' then 'remarketing'
      else '(not set)'
    end as "first_channel",

    /*--------------------------------------case first marketing channel excluding tv --------------------------*/
    case
      when fc.cam_bit_1!= 'rem' and fc.channel= 'affiliate'                                then 'affiliate'
      when fc.cam_bit_1!= 'rem' and fc.channel= 'crm'                                     then 'crm'
      when fc.cam_bit_1!= 'rem' and fc.channel= 'display'                                 then 'display'
      when fc.cam_bit_1!= 'rem' and fc.channel= 'facebook'                                then 'facebook'
      when fc.cam_bit_1!= 'rem' and fc.channel= 'google gdn'                              then 'google gdn'
      when fc.cam_bit_1!= 'rem' and fc.channel= 'kooperation'                             then 'kooperation'
      when fc.cam_bit_1!= 'rem' and fc.channel= 'praemienprogramm'                        then 'praemienprogramm'
      when fc.cam_bit_1!= 'rem' and fc.channel= 'remarketing'                             then 'remarketing'
      when fc.cam_bit_1!= 'rem' and fc.channel= 'twitter'                                 then 'twitter'
      when fc.cam_bit_1!= 'rem' and fc.channel= 'youtube'                                 then 'youtube'
      when fc.cam_bit_1!= 'rem' and fc.channel= 'google sem' and fc.cam_bit_3!= 'brand'   then 'google sem nobrand'
      when fc.cam_bit_1!= 'rem' and fc.channel= 'google sem' and fc.cam_bit_3= 'brand'    then 'google sem brand'
      when fc.cam_bit_1!= 'rem' and fc.channel= 'direct'                                  then 'direct'
      when fc.cam_bit_1!= 'rem' and fc.channel= 'organic'                                 then 'organic'
      when fc.cam_bit_1!= 'rem' and fc.channel= '(not set)'                               then '(not set)'
      when fc.cam_bit_1= 'rem'                                                            then 'remarketing'
      else '(not set)'
    end as "first_channel_excl_tv"

  FROM 
  (
    SELECT
      row_number() over (partition by co.customer_id order by co.date_created asc) as "rnum",
      co.customer_id,
      co.id,
      tv1.order_id,
      tsm1.channel,
      ga.cam_bit_1,
      ga.cam_bit_3
    FROM views.customer_order co
    LEFT JOIN views.ga_information ga on co.id = ga.transaction_id
    LEFT JOIN views.ga_transactions_source_medium tsm1 on lower(ga.source_medium) = lower(tsm1.sourcemedium)
    LEFT JOIN views.marketingtv tv1 on co.id = tv1.order_id
  )fc
),

ga_channel_completed AS
(
  SELECT
    fc.customer_id as "customer_id",
    fc.rnum,

    case
    /* --------------------------------------------------- case first marketing channel when tv is not flagged by rapidape ----------------------*/
      when fc.order_id is null  and fc.channel= 'affiliate' and fc.cam_bit_1!= 'rem' then 'affiliate'
      when fc.order_id is null  and fc.channel= 'crm' and fc.cam_bit_1!= 'rem' then 'crm'
      when fc.order_id is null  and fc.channel= 'display' and fc.cam_bit_1!= 'rem' then 'display'
      when fc.order_id is null  and fc.channel= 'facebook' and fc.cam_bit_1!= 'rem' then 'facebook'
      when fc.order_id is null  and fc.channel= 'google gdn' and fc.cam_bit_1!= 'rem' then 'google gdn'
      when fc.order_id is null  and fc.channel= 'kooperation' and fc.cam_bit_1!= 'rem' then 'kooperation'
      when fc.order_id is null  and fc.channel= 'praemienprogramm' and fc.cam_bit_1!= 'rem' then 'praemienprogramm'
      when fc.order_id is null  and fc.channel= 'remarketing' and fc.cam_bit_1!= 'rem' then 'remarketing'
      when fc.order_id is null  and fc.channel= 'twitter' and fc.cam_bit_1!= 'rem' then 'twitter'
      when fc.order_id is null  and fc.channel= 'youtube' and fc.cam_bit_1!= 'rem' then 'youtube'
      when fc.order_id is null  and fc.channel= 'google sem' and fc.cam_bit_1!= 'rem' and fc.cam_bit_3!= 'brand' then 'google sem nobrand'
      when fc.order_id is null  and fc.channel= 'google sem' and fc.cam_bit_1!= 'rem' and fc.cam_bit_3= 'brand' then 'google sem brand'
      when fc.order_id is null  and fc.channel= 'direct' then 'direct'
      when fc.order_id is null  and fc.channel= 'organic' and fc.cam_bit_1!= 'rem' then 'organic'
      when fc.order_id is null  and fc.channel= '(not set)' and fc.cam_bit_1!= 'rem' then '(not set)'
      when fc.order_id is null  and fc.cam_bit_1= 'rem' then 'remarketing'
    /* --------------------------------------------------- case first marketing channel when tv is flagged by rapidape ---------------------------*/
      when fc.order_id is not null  and fc.channel= 'affiliate' and fc.cam_bit_1!= 'rem' then 'affiliate'
      when fc.order_id is not null  and fc.channel= 'crm' and fc.cam_bit_1!= 'rem' then 'crm'
      when fc.order_id is not null  and fc.channel= 'display' and fc.cam_bit_1!= 'rem' then 'display'
      when fc.order_id is not null  and fc.channel= 'facebook' and fc.cam_bit_1!= 'rem' then 'facebook'
      when fc.order_id is not null  and fc.channel= 'google gdn' and fc.cam_bit_1!= 'rem' then 'google gdn'
      when fc.order_id is not null  and fc.channel= 'kooperation' and fc.cam_bit_1!= 'rem' then 'kooperation'
      when fc.order_id is not null  and fc.channel= 'praemienprogramm' and fc.cam_bit_1!= 'rem' then 'praemienprogramm'
      when fc.order_id is not null  and fc.channel= 'remarketing' and fc.cam_bit_1!= 'rem' then 'remarketing'
      when fc.order_id is not null  and fc.channel= 'twitter' and fc.cam_bit_1!= 'rem' then 'twitter'
      when fc.order_id is not null  and fc.channel= 'youtube' and fc.cam_bit_1!= 'rem'  then 'youtube'
      when fc.order_id is not null  and fc.channel= 'google sem' and fc.cam_bit_1!= 'rem' and fc.cam_bit_3!= 'brand' then 'google sem nobrand'
      when fc.order_id is not null  and fc.channel= 'google sem' and fc.cam_bit_1!= 'rem' and fc.cam_bit_3= 'brand' then 'tv'
      when fc.order_id is not null  and fc.channel= 'direct' then 'tv'
      when fc.order_id is not null  and fc.channel= 'organic' and fc.cam_bit_1!= 'rem' then 'tv'
      when fc.order_id is not null  and fc.channel= '(not set)' and fc.cam_bit_1!= 'rem' then 'tv'
      when fc.order_id is not null  and fc.cam_bit_1= 'rem' then 'remarketing'
      else '(not set)'
    end as "first_channel",

    /*--------------------------------------case first marketing channel excluding tv --------------------------*/
    case
      when fc.cam_bit_1!= 'rem' and fc.channel= 'affiliate'                               then 'affiliate'
      when fc.cam_bit_1!= 'rem' and fc.channel= 'crm'                                     then 'crm'
      when fc.cam_bit_1!= 'rem' and fc.channel= 'display'                                 then 'display'
      when fc.cam_bit_1!= 'rem' and fc.channel= 'facebook'                                then 'facebook'
      when fc.cam_bit_1!= 'rem' and fc.channel= 'google gdn'                              then 'google gdn'
      when fc.cam_bit_1!= 'rem' and fc.channel= 'kooperation'                             then 'kooperation'
      when fc.cam_bit_1!= 'rem' and fc.channel= 'praemienprogramm'                        then 'praemienprogramm'
      when fc.cam_bit_1!= 'rem' and fc.channel= 'remarketing'                             then 'remarketing'
      when fc.cam_bit_1!= 'rem' and fc.channel= 'twitter'                                 then 'twitter'
      when fc.cam_bit_1!= 'rem' and fc.channel= 'youtube'                                 then 'youtube'
      when fc.cam_bit_1!= 'rem' and fc.channel= 'google sem' and fc.cam_bit_3!= 'brand'   then 'google sem nobrand'
      when fc.cam_bit_1!= 'rem' and fc.channel= 'google sem' and fc.cam_bit_3= 'brand'    then 'google sem brand'
      when fc.cam_bit_1!= 'rem' and fc.channel= 'direct'                                  then 'direct'
      when fc.cam_bit_1!= 'rem' and fc.channel= 'organic'                                 then 'organic'
      when fc.cam_bit_1!= 'rem' and fc.channel= '(not set)'                               then '(not set)'
      when fc.cam_bit_1= 'rem'                                                            then 'remarketing'
      else '(not set)'
    end as "first_channel_excl_tv"

  FROM 
  (
    SELECT
      row_number() over (partition by co.customer_id order by co.date_created asc) as "rnum",
      co.customer_id,
      co.id,
      tv1.order_id,
      tsm1.channel,
      ga.cam_bit_1,
      ga.cam_bit_3
    FROM views.customer_order co
    LEFT JOIN views.ga_information ga on co.id = ga.transaction_id
    LEFT JOIN views.ga_transactions_source_medium tsm1 on lower(ga.source_medium) = lower(tsm1.sourcemedium)
    LEFT JOIN views.marketingtv tv1 on co.id = tv1.order_id
    WHERE co.state= '1024'
  )fc
)

SELECT 
  g1.customer_id,
  
  case
  	when g1.first_channel is null then '(not set)'
    else g1.first_channel
  end as first_channel,
  
  case
  	when g2.first_channel is null then '(not set)'
    else g2.first_channel
  end as first_channel_completed,
  
  case
    when g3.first_channel_excl_tv is null then '(not set)'
  	else g3.first_channel_excl_tv
  end as first_channel_excl_tv,
  
  case
  	when g4.first_channel_excl_tv is null then '(not set)'
    else g4.first_channel_excl_tv
  end as first_channel_completed_excl_tv
  
FROM
(
  SELECT 
    g.customer_id,
    g.first_channel
  FROM ga_channel g
  WHERE g.rnum=1
)g1

LEFT JOIN
(
  SELECT 
    g.customer_id,
    g.first_channel
  FROM ga_channel_completed g
  WHERE g.rnum=1
)g2 on g2.customer_id=g1.customer_id


LEFT JOIN
(
  SELECT 
    g.customer_id,
    g.first_channel_excl_tv
  FROM ga_channel g
  WHERE g.rnum=1
)g3 on g3.customer_id=g1.customer_id


LEFT JOIN
(
  SELECT 
    g.customer_id,
    g.first_channel_excl_tv
  FROM ga_channel_completed g
  WHERE g.rnum=1
)g4 on g4.customer_id=g1.customer_id


