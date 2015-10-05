-- Name: raw.desk_case_rep_view
-- Created: 2015-09-10 09:59:58
-- Updated: 2015-09-22 10:17:27

CREATE view raw.desk_case_rep_view
as
select  a.ndate,
		a.finance,
		a.datenschutz, 
		a.Lieferung_Ruckversand,
		a.Reklamation,
		a.Service,
		a.Storno_Adresanderung,
		a.Emarsys,
		a.new_cases,
		a.reopened_case,
		a.closed_case,
		formatDouble(cast(a.reopened_case as float)/cast (a.closed_case as float),'#,##0.00;(#,##0.00)') ||'%'
					 as	quote_reopened_closed_cases,
		t1_response,
		t1_resolve
from "dwh.desk_case_report" a;


