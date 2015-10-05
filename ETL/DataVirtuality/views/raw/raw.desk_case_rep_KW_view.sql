-- Name: raw.desk_case_rep_KW_view
-- Created: 2015-09-10 16:48:40
-- Updated: 2015-09-11 15:01:40

CREATE view raw.desk_case_rep_KW_view
as
select  
		week(ndate) Week_no,	
		sum(a.finance) as Finance,
		sum(a.datenschutz) as datenschutz, 
		sum(a.Lieferung_Ruckversand) as Lieferung_Ruckversand,
		sum(a.Reklamation) as Reklamation,
		sum(a.Service) as Service,
		sum(a.Storno_Adresanderung) as Storno_Adresanderung,
		sum(a.Emarsys) as Emarsys,
		sum(a.new_cases) as new_cases,
		sum(a.reopened_case) as reopened_case,
		sum(a.closed_case) as closed_case
from "dwh.desk_case_report" a
group by week(ndate);


