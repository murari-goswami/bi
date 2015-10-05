-- Name: views.marketingconstruct
-- Created: 2015-04-24 18:18:02
-- Updated: 2015-06-24 15:09:55

CREATE view views.marketingconstruct
as
select
	fd.date_created as "datecreated",
	mco.country as "country",
	mch.channel as "channel"
from views.futuredate fd
cross join dwh.marketingcountries mco
cross join 
(
SELECT channel 
FROM dwh.marketingchannels
UNION
SELECT 'offline promotions' as channel
UNION 
SELECT 'inserts' as channel
UNION
SELECT 'social media' as channel
) 	
mch
option $allow_cartesian always


