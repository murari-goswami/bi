-- Name: views.marketingcheck
-- Created: 2015-04-24 18:25:31
-- Updated: 2015-07-02 17:46:30

CREATE view views.marketingcheck
as
select 
 mc.datecreated as "datecreated", 
 mc.country as "country", 
 vi.visits as "visits",
 avg(mco.costs) as "costs", 
 count(distinct(md.co_id)) as "all_orders", 
 count(distinct(case when md.co_saleschannel in ('websiteWithDate','websiteWithoutDate') and md.co_paymentmethod!= '4' and md.co_newrepeatfollow= 'first order' then md.co_id else null end)) as "incoming_orders", 
 count(distinct(ga.transaction_id)) as "transaction_ids"
from views.marketingconstruct mc 
left join views.marketingdata md on md.co_datecreated = mc.datecreated and md.addr_country = mc.country 
left join views.ga_information ga on md.co_id = ga.transaction_id
left join ( 
 select 
  datecreated, 
  country, 
  sum(case 
      when currency= 'chf' then costs*0.8
      else costs 
     end) as "costs" 
 from views.marketingcosts 
 group by 1,2) mco 
on mco.datecreated = mc.datecreated and mco.country = mc.country 
left join (
  select
    date_created,
    domain as country,
    sum(ifnull(visits,0)) as visits
  from raw.daily_visits
  group by 1,2) vi
on mc.datecreated = vi.date_created and lower(mc.country) = lower(vi.country)
where mc.datecreated>= '2014-01-27'
and mc.datecreated<= curdate()
group by 1,2,3


