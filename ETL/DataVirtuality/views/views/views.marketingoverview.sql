-- Name: views.marketingoverview
-- Created: 2015-04-24 18:22:46
-- Updated: 2015-07-02 17:24:40

CREATE view views.marketingoverview
as
select
      cast(mc.datecreated as date) as "datecreated",
      mc.channel as "channel",
      mc.country as "country",
      ifnull(mco.costs,0) as "costs",
      ifnull(vi.visits,0) as "visits",
      o1.all_orders_in_database,
      o1.prepayment_orders_in_database,
      o1.all_first_orders,
      o1.all_repeat_orders,
      o1.all_followon_orders,
      o1.processed_first_orders,
      o1.processed_repeat_orders,
      o1.processed_followon_orders,
      o1.sent_first_orders,
      o1.sent_repeat_orders,
      o1.sent_followon_orders,
      o1.completed_first_orders,
      o1.completed_repeat_orders,
      o1.completed_followon_orders,
      o1.cancelled_first_orders,
      o1.cancelled_repeat_orders,
      o1.cancelled_followon_orders,
      o1.incoming_first_orders,
      o1.incoming_repeat_orders,
      o1.incoming_followon_orders,
      o1.totalbasket,
      o1.totalbilled,
      o1.incoming_first_orders_basket,
      o1.incoming_repeat_orders_basket,
      o1.incoming_followon_orders_basket
from views.marketingconstruct mc
left join (
      select
            mc.date_created as datecreated,
            CASE
                  WHEN mc.channel = 'LinkedIn' THEN 'social media'
                  WHEN mc.channel = 'Xing'  THEN 'social media'
                  WHEN mc.channel = 'Offline_Promotions' THEN 'offline promotions'
                  WHEN mc.channel = 'Insert' THEN 'inserts'
                  ELSE mc.channel 
            END AS channel,
            mc.country,
            SUM(mc.cost) as costs
      from raw.marketing_costs mc
      group by 1,2,3) mco
on mc.datecreated = mco.datecreated and lower(replace(mc.channel,' ','')) = lower(replace(mco.channel,' ','')) and lower(mc.country) = lower(mco.country) 
left join (
            select
            cast(co.date_created as date) as "datecreated",
            case
                  when mo.marketing_channel is null then '(not set)'
                  else mo.marketing_channel
            end as "channel",
            co.shipping_country as "country",
            /* COUNTS ALL ORDERS IN DATABASE */
            count(distinct(co.id)) as "all_orders_in_database",
            /* COUNTS ALL PREPAYMENT ORDERS IN DATABASE */
            count(distinct(case when co.payment_method= '4' then co.id else null end)) as "prepayment_orders_in_database",
            /* COUNTS ALL ORDERS GROUPED BY ORDER TYPE */
            count(distinct(case when co.order_type= 'first order' and co.state!= '2048' and sfo.StageName!= 'Datum vorschlagen' 
                  and sfo.StageName!= 'Termin ausmachen' and sfo.StageName!= 'Inaktiv' then co.id else null end)) as "all_first_orders",
            count(distinct(case when co.order_type= 'real repeat order' and co.state!= '2048' and sfo.StageName!= 'Datum vorschlagen' 
                  and sfo.StageName!= 'Termin ausmachen' and sfo.StageName!= 'Inaktiv' then co.id else null end)) as "all_repeat_orders",
            count(distinct(case when co.order_type= 'follow on order' and co.state!= '2048' and sfo.StageName!= 'Datum vorschlagen' 
                  and sfo.StageName!= 'Termin ausmachen' and sfo.StageName!= 'Inaktiv' then co.id else null end)) as "all_followon_orders",
            /* COUNTS ALL ORDERS THAT ARE BEING PROCESSED GROUPED BY ORDER TYPE */
            count(distinct(case when ifnull(date_picked,0)!= '0' and co.state>= '16' and co.state!= '2048' and co.order_type= 'first order' then co.id else null end)) as "processed_first_orders",
            count(distinct(case when ifnull(date_picked,0)!= '0' and co.state>= '16' and co.state!= '2048' and co.order_type= 'real repeat order' then co.id else null end)) as "processed_repeat_orders",
            count(distinct(case when ifnull(date_picked,0)!= '0' and co.state>= '16' and co.state!= '2048' and co.order_type= 'follow on order' then co.id else null end)) as "processed_followon_orders",
            /* COUNTS ALL ORDERS THAT HAVE BEEN SENT GROUPED BY ORDER TYPE */
            count(distinct(case when co.state>= '128' and co.state!= '2048' and co.order_type= 'first order' then co.id else null end)) as "sent_first_orders",
            count(distinct(case when co.state>= '128' and co.state!= '2048' and co.order_type= 'real repeat order' then co.id else null end)) as "sent_repeat_orders",
            count(distinct(case when co.state>= '128' and co.state!= '2048' and co.order_type= 'follow on order' then co.id else null end)) as "sent_followon_orders",
            /* COUNTS ALL ORDERS THAT HAVE BEEN COMPLETED GROUPED BY ORDER TYPE */
            count(distinct(case when co.state= '1024' and co.order_type= 'first order' then co.id else null end)) as "completed_first_orders",
            count(distinct(case when co.state= '1024' and co.order_type= 'real repeat order' then co.id else null end)) as "completed_repeat_orders",
            count(distinct(case when co.state= '1024' and co.order_type= 'follow on order' then co.id else null end)) as "completed_followon_orders",
            /* COUNTS ALL ORDERS THAT HAVE BEEN CANCELLED GROUPED BY ORDER TYPE */
            count(distinct(case when co.state= '2048' and co.order_type= 'first order' then co.id else null end)) as "cancelled_first_orders",
            count(distinct(case when co.state= '2048' and co.order_type= 'real repeat order' then co.id else null end)) as "cancelled_repeat_orders",
            count(distinct(case when co.state= '2048' and co.order_type= 'follow on order' then co.id else null end)) as "cancelled_followon_orders",
            /* COUNTS ALL INCOMING ORDERS GROUPED BY ORDER TYPE */
            count(distinct(case when co.order_type= 'first order' and (co.sales_channel like '%WithDate' or co.sales_channel like '%WithoutDate') and co.payment_method!= '4' then co.id else null end))
            as "incoming_first_orders",
            count(distinct(case when co.order_type= 'real repeat order' and (co.sales_channel like '%WithDate' or co.sales_channel like '%WithoutDate') and co.payment_method!= '4' then co.id else null end))
            as "incoming_repeat_orders",
            count(distinct(case when co.order_type= 'follow on order' and (co.sales_channel like '%WithDate' or co.sales_channel like '%WithoutDate') and co.payment_method!= '4' then co.id else null end))
            as "incoming_followon_orders",
            sum(opk.order_value_incl_ret_re) as totalbasket,
            sum(opk.order_value_kept_re) as totalbilled,
            /* BASKET VALUE ALL INCOMING ORDERS GROUPED BY ORDER TYPE */
            sum(distinct(case when co.order_type= 'first order' and (co.sales_channel like '%WithDate' or co.sales_channel like '%WithoutDate') and co.payment_method!= '4' then opk.order_value_kept_re else 0 end))
            as "incoming_first_orders_basket",
            sum(distinct(case when co.order_type= 'real repeat order' and (co.sales_channel like '%WithDate' or co.sales_channel like '%WithoutDate') and co.payment_method!= '4' then opk.order_value_kept_re else 0 end))
            as "incoming_repeat_orders_basket",
            sum(distinct(case when co.order_type= 'follow on order' and (co.sales_channel like '%WithDate' or co.sales_channel like '%WithoutDate') and co.payment_method!= '4' then opk.order_value_kept_re else 0 end))
            as "incoming_followon_orders_basket"
      from views.customer_order co
      left join views.marketing_order mo on co.id = mo.order_id
      left join views.order_position_kpis opk on opk.order_id=co.id
      left join views.salesforce_opportunity sfo on co.id = sfo.ExternalOrderId__c
      where co.customer_id not in ('179899816','179886634','11804631','31281783','143553094','834667')
      group by 1,2,3) o1
on o1.datecreated = mc.datecreated and lower(o1.channel) = lower(mc.channel) and lower(o1.country) = lower(mc.country)
left join (
      select
            date_created,
            domain as country,
            channel,
            sum(ifnull(visits,0)) as visits
      from raw.daily_visits
      group by 1,2,3) vi
on mc.datecreated = vi.date_created and lower(mc.country) = lower(vi.country) and lower(mc.channel) = lower(vi.channel)
where mc.datecreated>= '2014-01-27'
and mc.datecreated<= curdate()
order by mc.datecreated desc


