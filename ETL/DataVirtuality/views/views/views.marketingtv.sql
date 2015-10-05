-- Name: views.marketingtv
-- Created: 2015-04-24 18:17:18
-- Updated: 2015-04-24 18:17:18

CREATE view "views.marketingtv"
as
SELECT
	cast(order_id as string) as order_id,
	tv_spot_date_utc,
	utc_gmt as tv_spot_date,
	SUBSTRING(utc_gmt,0,11) AS "date_spot_aired",
	left(SUBSTRING(utc_gmt,12,19),8) AS "timestamp_spot_aired",
	tv_station,
	tv_program
FROM 
(	 SELECT 
		tv.order_id,
		tv.program_after,
		tv.program_before as tv_program,
		tv.spotname as tv_spotname,
		tv.spotstation as tv_station,
		tv.airingtime as tv_spot_date_utc,
		tv.nb_of_visits,
		/*this case statement converts time from utc to gmt*/
		case 
		when tv.airingtime between parsetimestamp('2014-03-30 02:00:00.000','yyyy-MM-dd HH:mm:ss.S') and parsetimestamp('2014-10-26 03:00:00.000','yyyy-MM-dd HH:mm:ss.S') 
			then timestampadd(SQL_TSI_HOUR,+2,tv.airingtime)
		when tv.airingtime between parsetimestamp('2014-10-26 03:00:00.000','yyyy-MM-dd HH:mm:ss.S') and parsetimestamp('2015-03-29 02:00:00.000','yyyy-MM-dd HH:mm:ss.S') 
			then timestampadd(SQL_TSI_HOUR,+1,tv.airingtime)
		when tv.airingtime between parsetimestamp('2015-03-29 02:00:00.000','yyyy-MM-dd HH:mm:ss.S') and parsetimestamp('2015-10-25 03:00:00.000','yyyy-MM-dd HH:mm:ss.S') 
			then timestampadd(SQL_TSI_HOUR,+2,tv.airingtime)
		when tv.airingtime between parsetimestamp('2015-10-25 03:00:00.000','yyyy-MM-dd HH:mm:ss.S') and parsetimestamp('2016-03-27 02:00:00.000','yyyy-MM-dd HH:mm:ss.S') 
			then timestampadd(SQL_TSI_HOUR,+1,tv.airingtime)
		when tv.airingtime between parsetimestamp('2015-03-29 02:00:00.000','yyyy-MM-dd HH:mm:ss.S') and parsetimestamp('2015-10-25 03:00:00.000','yyyy-MM-dd HH:mm:ss.S') 
			then timestampadd(SQL_TSI_HOUR,+2,tv.airingtime)
		when tv.airingtime between parsetimestamp('2015-10-25 03:00:00.000','yyyy-MM-dd HH:mm:ss.S') and parsetimestamp('2016-03-27 02:00:00.000','yyyy-MM-dd HH:mm:ss.S') 
			then timestampadd(SQL_TSI_HOUR,+1,tv.airingtime)
		when tv.airingtime between parsetimestamp('2016-03-27 02:00:00.000','yyyy-MM-dd HH:mm:ss.S') and parsetimestamp('2016-10-30 03:00:00.000','yyyy-MM-dd HH:mm:ss.S') 
			then timestampadd(SQL_TSI_HOUR,+2,tv.airingtime)
		when tv.airingtime between parsetimestamp('2016-10-30 03:00:00.000','yyyy-MM-dd HH:mm:ss.S') and parsetimestamp('2017-03-26 02:00:00.000','yyyy-MM-dd HH:mm:ss.S') 
			then timestampadd(SQL_TSI_HOUR,+1,tv.airingtime)
		else tv.airingtime
		end as utc_gmt
	FROM "dwh"."marketing_tv" tv
)a


