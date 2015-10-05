-- Name: views.ga_system_firstc
-- Created: 2015-04-24 18:18:04
-- Updated: 2015-04-24 18:18:04

CREATE view views.ga_system_firstc
as
select
 sy.transaction_id as "transactionid",
 sy.date_created as "datecreated",
 sy.hour_created as "hour_created",
 sy.device_category as "devicecategory",
 sy.operating_system as "operatingsystem",
 sy.browser,
 sy.transactions 
 from
  (select 
    row_number() over (partition by transaction_id order by date_created asc) as "rnum",
    transaction_id,
    date_created,
    hour_created,
    device_category,
    operating_system,
    browser,
    cast('1' as integer) as transactions 
   from views.ga_information
   ) sy
where sy.rnum= '1'


