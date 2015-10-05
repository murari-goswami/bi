-- Name: raw.nfone_NL_summary_view
-- Created: 2015-09-17 16:25:52
-- Updated: 2015-09-22 10:06:07

CREATE view raw.nfone_NL_summary_view
as
WITH answered_call as (
						select cast(date_called as date) as date_called, count(*) as answered_call_vol
 	 					from "dwh.nfone_data"
	 					where call_queue is not null
	 					and call_queue like '%NL%'
	 					and call_duration <> 0
	 					and cast(date_called as date) >= '2015-01-01'
	 					group by  cast(date_called as date)
	 					),
	unanswered_call as (
						select cast(date_called as date) as date_called, count(*) as unanswered_call_vol
 	 					from "dwh.nfone_data"
	 					where call_duration = 0
	 					and call_queue like '%NL%'
	 					and cast(date_called as date) >= '2015-01-01'
	 					group by cast(date_called as date)											
						),
	total_call as (
						select cast(date_called as date) as date_called, count(*) as total_call_vol
 	 					from "dwh.nfone_data"
	 					where call_queue like '%NL%'
	 					and cast(date_called as date) >= '2015-01-01'
	 					group by cast(date_called as date)	
				)	 														
select answered_call.date_called, 
	   total_call_vol as "eingehende_Calls", 
	   answered_call_vol as "beantwortete", 
	   unanswered_call_vol as "unbeantwortet"	   
from answered_call, unanswered_call, total_call
where answered_call.date_called = unanswered_call.date_called
and unanswered_call.date_called = total_call.date_called
order by date_called desc;


