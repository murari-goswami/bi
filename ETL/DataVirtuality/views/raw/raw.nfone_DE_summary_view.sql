-- Name: raw.nfone_DE_summary_view
-- Created: 2015-09-17 17:08:43
-- Updated: 2015-09-22 09:55:55

CREATE view raw.nfone_DE_summary_view
as
WITH answered_call as (
						select cast(date_called as date) as date_called, count(*) as answered_call_vol
 	 					from "dwh.nfone_data"
	 					where call_queue is not null
	 					and call_queue like '%DE%'
	 					and call_duration <> 0
	 					and cast(date_called as date) >= '2015-01-01'
	 					group by  cast(date_called as date)
	 					order by cast(date_called as date) asc
	 					),
	unanswered_call as (
						select cast(date_called as date) as date_called, count(*) as unanswered_call_vol
 	 					from "dwh.nfone_data"
	 					where call_duration = 0
	 					and call_queue like '%DE%'
	 					and cast(date_called as date) >= '2015-01-01'
	 					group by cast(date_called as date)
	 					order by cast(date_called as date) asc												
						),
	total_call as (
						select cast(date_called as date) as date_called, count(*) as total_call_vol
 	 					from "dwh.nfone_data"
	 					where call_queue like '%DE%'
	 					and cast(date_called as date) >= '2015-01-01'
	 					group by  cast(date_called as date)
	 					order by cast(date_called as date) asc	
				)	 														
select answered_call.date_called, 
	   total_call_vol as "eingehende_Calls", 
	   answered_call_vol as "beantwortete", 
	   unanswered_call_vol as "unbeantwortet"	   
from answered_call, unanswered_call, total_call
where answered_call.date_called = unanswered_call.date_called
and unanswered_call.date_called = total_call.date_called
order by date_called desc;


