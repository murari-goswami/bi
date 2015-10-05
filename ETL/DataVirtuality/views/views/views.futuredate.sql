-- Name: views.futuredate
-- Created: 2015-04-24 18:17:16
-- Updated: 2015-04-24 18:17:16

CREATE view views.futuredate
as
SELECT 
  date_created,
  year(date_created) as "year",
  quarter(date_created) as "quarter",
  month(date_created) as "month",
  monthname(date_created) as "monthname",
  week(date_created) as "week",
  dayname(date_created) as "dayname",
  dayofmonth(date_created) as "dayofmonth",
  dayofyear(date_created) as "dayofyear",
  case 
    when dayname(date_created) in ('Saturday','Sunday') then 1 
    else 0
  end as weekend,
  case 
    when dayname(date_created)='Saturday' then timestampadd(SQL_TSI_DAY,2,date_created) 
    when dayname(date_created)='Sunday' then timestampadd(SQL_TSI_DAY,1,date_created)
    else date_created 
  end as date_created_exl_weekends,
  case 
    when 
    date_created in
    ( 
      '2013-01-01','2013-03-29','2013-04-01','2013-05-01','2013-05-09','2013-05-20','2013-10-03','2013-12-25','2013-12-26', 
      '2014-01-01','2014-04-18','2014-04-21','2014-05-01','2014-05-29','2014-06-09','2014-10-03','2014-12-25','2014-12-26',
      '2015-01-01','2015-04-03','2015-04-06','2015-05-01','2015-05-14','2015-05-25','2015-10-03','2015-12-25','2015-12-26',
      '2016-01-01','2016-03-25','2016-03-28','2016-05-01','2016-05-05','2016-05-16','2016-10-03','2016-12-25','2016-12-26'
    )then 1 
    else 0 
  end as holiday
FROM dwh.futuredate


