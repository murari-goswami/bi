-- Name: tableau.ops_stock_reconciliation_last_updated
-- Created: 2015-04-24 18:17:50
-- Updated: 2015-04-24 18:17:50

CREATE view tableau.ops_stock_reconciliation_last_updated
AS
SELECT 
cal."date",
dd.doc_data_last_updated_at,
os.stock_entry_last_updated_at,
sr.report_last_updated_at
FROM 
dwh.calendar cal
LEFT JOIN
(SELECT 
	max(endTime) as doc_data_last_updated_at
	FROM SYSADMIN.ScheduleJobRun 
	WHERE sqlCommand like '%dwh.stock_entry_history_dd%'
	AND status='finished'
) dd on cast(dd.doc_data_last_updated_at as date) = cal."date"
LEFT JOIN
(SELECT
	max(endTime) as stock_entry_last_updated_at
	FROM SYSADMIN.ScheduleJobRun 
	WHERE sqlCommand like '%dwh.stock_entry_history%'
	AND status='finished'
	AND cast(endTime as date) = curdate()
	AND extract(hour from endTime)<=7 and extract(minute from endTime)<=50
)os on cast(os.stock_entry_last_updated_at as date) = cal."date"
LEFT JOIN
(SELECT
	max(endTime) as report_last_updated_at
	FROM SYSADMIN.ScheduleJobRun 
	WHERE sqlCommand like '%bi.stock_reconciliation%'
	AND status='finished'
) sr ON cast(sr.report_last_updated_at as date) = cal."date"
WHERE cal."date" = curdate()


