-- Name: views.marketingcosts
-- Created: 2015-04-24 18:17:18
-- Updated: 2015-06-18 14:42:30

CREATE view views.marketingcosts
as
select
  cast(mco.datecreated as date) as "datecreated",
  mco.country as "country",
  case
    when mco.channel= 'gdn' then 'google gdn'
    when mco.channel= 'sem' then 'google sem'
    when mco.channel= 'display' then 'display'
    when mco.channel= 'facebook' then 'facebook'
    when mco.channel= 'affiliate' then 'affiliate'
    when mco.channel= 'crm' then 'crm'
    when mco.channel= 'kooperationen' then 'kooperation'
    when mco.channel= 'referral' then 'praemienprogramm'
    when mco.channel= 'remarketing' then 'remarketing'
    when mco.channel= 'seo/direct' then 'seo/direct'
    when mco.channel= 'tv' then 'tv'
    when mco.channel= 'twitter' then 'twitter' 
    when mco.channel= 'youtube' then 'youtube'
    when mco.channel= 'sem_brand' then 'google sem brand'
    when mco.channel= 'sem_nobrand' then 'google sem nobrand'
    when mco.channel= 'appdownload' then 'app download campaign'
    WHEN mco.channel= 'offline_promotions' THEN 'Offline_Promotions'
    WHEN mco.channel= 'linkedin' THEN 'LinkedIn'
    WHEN mco.channel= 'xing' THEN 'Xing'
    WHEN mco.channel= 'insert' THEN 'Insert'
  end as "channel",
  cast(mco.costs as double) as "costs",
  mco.currency as "currency"
from (
  select
    row_number() over (partition by "datecreated" || "country" || "channel" || "costs" || "currency" order by "datecreated" desc) as "rnum",
    replace(cast(datecreated as date),' ','') as "datecreated",
    replace(country,' ','') as "country",
    lower(replace(channel,' ','')) as "channel",
    replace(cast(costs as double),' ','') as "costs",
    replace(currency,' ','') as "currency"
from dwh.marketingcost ) mco
where mco.rnum= '1'


