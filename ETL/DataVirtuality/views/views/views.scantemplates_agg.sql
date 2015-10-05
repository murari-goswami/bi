-- Name: views.scantemplates_agg
-- Created: 2015-04-24 18:18:01
-- Updated: 2015-04-24 18:18:01

CREATE view views.scantemplates_agg as
select
po,
ean,
count(*) as count_scans,
count(case when ean_unknown = 'JA' then 1 else null end) as count_ean_unknown,
count(case when photo_article = 'JA' then 1 else null end) as count_photo_article,
count(case when article_overdelivered = 'JA' then 1 else null end) as count_overdelivered,
count(case when hanging = 'JA' then 1 else null end) as count_hanging,
max(date_uploaded) as max_date_uploaded,
min(date_uploaded) as min_date_uploaded,
max(date_scanned) as max_date_scanned,
min(date_scanned) as min_date_scanned,
max(date_given_to_serviceprovi) as max_date_given_to_serviceprovider,
min(date_given_to_serviceprovi) as min_date_given_to_serviceprovider,
max(date_delivered) as max_date_delivered,
min(date_delivered) as min_date_delivered
from views.scantemplates
group by 1,2
order by 1


