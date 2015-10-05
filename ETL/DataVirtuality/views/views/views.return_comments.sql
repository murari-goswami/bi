-- Name: views.return_comments
-- Created: 2015-05-14 21:55:25
-- Updated: 2015-05-14 21:55:25

create view views.return_comments
as
/*Return Comments for Articles*/
select
original_orderid,
outfittery_article_number,
comment,
max(date_created) as "max_date_created",
min(date_created) as "min_date_created"
from postgres.doc_data_return
where comment<>''
group by 1,2,3


