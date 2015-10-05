-- Name: views.ga_transactions_firstc
-- Created: 2015-04-24 18:18:04
-- Updated: 2015-04-24 18:18:04

create view views.ga_transactions_firstc
as
select
 tr.transaction_id as "transactionid",
 tr.date_created as "datecreated",
 tr.hour_created as "hourcreated",
 tr.source,
 tr.medium,
 tr.source || ' / ' || tr.medium as "sourcemedium",
 lower(tr.campaign) as "campaign",
 trc.cam1,
 trc.cam2,
 trc.cam3,
 trc.cam4,
 trc.cam5,
 trc.cam6,
 trc.cam7,
 trc.cam8,
 trc.cam9,
 trc.cam10,
 trc.cam11,
 trc.cam12,
 trc.cam13,
 trc.cam14,
 trc.cam15,
 tr.keyword,
 tr.transactions
 from
  (select 
    row_number() over (partition by transaction_id order by date_created asc) as "rnum",
    transaction_id,
    date_created,
    hour_created,
    source,
    medium,
    campaign,
    keyword,
    cast('1' as integer) as transactions 
   from views.ga_information
   ) tr,
   texttable (lower(tr.campaign) columns "cam1" string, "cam2" string, "cam3" string, "cam4" string, "cam5" string, 
                                         "cam6" string, "cam7" string, "cam8" string, "cam9" string, "cam10" string, 
                                         "cam11" string, "cam12" string, "cam13" string, "cam14" string, "cam15" string delimiter '_') trc   
where tr.rnum= '1'


