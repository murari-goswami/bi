-- Name: tableau.ops_logistics_overview_last_updated
-- Created: 2015-04-24 18:17:49
-- Updated: 2015-04-24 18:17:49

CREATE view tableau.ops_logistics_overview_last_updated
AS
SELECT 
	max(endTime) as last_updated_at
FROM SYSADMIN.ScheduleJobRun where sqlCommand like '%views.logistics_overview%'
and status='finished'


