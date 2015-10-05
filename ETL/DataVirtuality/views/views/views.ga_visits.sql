-- Name: views.ga_visits
-- Created: 2015-04-24 18:18:03
-- Updated: 2015-04-24 18:18:03

CREATE view views.ga_visits
as
select
  vi1.date_created,
  vi1.country,
  vi1.source,
  vi1.medium,
  vi1.devicecategory,
  case
    when vi1.channel= 'affiliate' and vit.cam_bit_1!= 'rem' then 'affiliate'
    when vi1.channel= 'crm' and vit.cam_bit_1!= 'rem' then 'crm'
    when vi1.channel= 'display' and vit.cam_bit_1!= 'rem' then 'display'
    when vi1.channel= 'facebook' and vit.cam_bit_1!= 'rem' then 'facebook'
    when vi1.channel= 'google gdn' and vit.cam_bit_1!= 'rem' then 'google gdn'
    when vi1.channel= 'kooperation' and vit.cam_bit_1!= 'rem' then 'kooperation'
    when vi1.channel= 'praemienprogramm' and vit.cam_bit_1!= 'rem' then 'praemienprogramm'
    when vi1.channel= 'remarketing' and vit.cam_bit_1!= 'rem' then 'remarketing'
    when vi1.channel= 'twitter' and vit.cam_bit_1!= 'rem' then 'twitter'
    when vi1.channel= 'youtube' and vit.cam_bit_1!= 'rem' then 'youtube'
    when vi1.channel= 'google sem' and vit.cam_bit_1!= 'rem' and vit.cam_bit_3!= 'brand' then 'google sem nobrand'
    when vi1.channel= 'google sem' and vit.cam_bit_1!= 'rem' and vit.cam_bit_3= 'brand' then 'google sem brand'
    when vi1.channel= 'direct' and vit.cam_bit_1!= 'rem' then 'direct'
    when vi1.channel= 'organic' and vit.cam_bit_1!= 'rem' then 'organic'
    when vi1.channel= '(not set)' and vit.cam_bit_1!= 'rem' then '(not set)'
    when vit.cam_bit_1= 'rem' then 'remarketing'
    else '(not set)'
  end as "channel",
  vi1."campaign",
  vit.cam_bit_1,
  vit.cam_bit_2,
  vit.cam_bit_3,
  vit.cam_bit_4,
  vit.cam_bit_5,
  vit.cam_bit_6,
  vit.cam_bit_7,
  vit.cam_bit_8,
  vit.cam_bit_9,
  vit.cam_bit_10,
  vit.cam_bit_11,
  vit.cam_bit_12,
  vit.cam_bit_13,
  vit.cam_bit_14,
  vit.cam_bit_15,
  vit.cam_bit_16,
  vit.cam_bit_17,
  vit.cam_bit_18,
  vit.cam_bit_19,
  vit.cam_bit_20,
  vi1.visits
from (
  select
    row_number() over (partition by vi.date_created, vi.country, vi.source, vi.medium, vi.campaign,vi.devicecategory order by vi.visits desc) as "rnum",
    vi.date_created,
    vi.country,
    vi.source,
    vi.medium,
    tsm.channel,
    vi.devicecategory,
    ifnull(vi."campaign",'(not set)') as "campaign",
    ifnull(vi.visits,0) as "visits"
  from dwh.ga_visits vi
  left join views.ga_transactions_source_medium tsm on lower(vi.source)|| ' / ' || lower(vi.medium) = lower(tsm.sourcemedium) ) vi1,
  texttable (lower(vi1.campaign) columns 
              cam_bit_1 string,
              cam_bit_2 string,
              cam_bit_3 string,
              cam_bit_4 string,
              cam_bit_5 string,
              cam_bit_6 string,
              cam_bit_7 string,
              cam_bit_8 string,
              cam_bit_9 string,
              cam_bit_10 string,
              cam_bit_11 string,
              cam_bit_12 string,
              cam_bit_13 string,
              cam_bit_14 string,
              cam_bit_15 string,
              cam_bit_16 string,
              cam_bit_17 string,
              cam_bit_18 string,
              cam_bit_19 string,
              cam_bit_20 string 
              delimiter '_') vit


