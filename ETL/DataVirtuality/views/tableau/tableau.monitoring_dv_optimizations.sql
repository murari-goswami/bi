-- Name: tableau.monitoring_dv_optimizations
-- Created: 2015-04-24 18:17:54
-- Updated: 2015-09-18 21:52:31

CREATE VIEW tableau.monitoring_dv_optimizations
AS

SELECT
CASE 
	WHEN sjr.jobType = 'recopt' THEN 'optimisation'
	ELSE sjr.jobType 
END as job_type,
jobId as job_id,
CASE WHEN sj.id is not null THEN SUBSTRING(cast(sjr.startTime as string) , 12, 2) ELSE null END as job_run_time, 
CASE 
	WHEN sjr.jobType = 'recopt' THEN SUBSTRING(SUBSTRING(sjr.sqlCommand, 16), 0, LOCATE('"', SUBSTRING(sjr.sqlCommand, 16))-1)
	ELSE sj.description
END as job_name,
ds.data_source,
sjr.startTime as start_time,
CASE WHEN sjr.status = 'RUNNING' THEN now() ELSE sjr.endTime END as end_time,
CASE 
	WHEN sjr.status = 'RUNNING' THEN ROUND(cast(cast(TIMESTAMPDIFF(SQL_TSI_SECOND, sjr.startTime, now()) as double)/cast(60 as double) as decimal), 2)
	ELSE ROUND(cast(cast(TIMESTAMPDIFF(SQL_TSI_SECOND, sjr.startTime, sjr.endTime) as double)/cast(60 as double) as decimal), 2)
END as mins,
CASE 
	WHEN sjr.status = 'SUCCESS' THEN 'SUCCESS'
	WHEN sjr.status = 'FAILED' THEN 'FAILED'
	WHEN sjr.status = 'RUNNING' THEN 'RUNNING'
	ELSE 'INTERRUPTED'
END as status,
sjr.failureReason as failure_reason
FROM SYSADMIN.ScheduleJobRun sjr 
LEFT JOIN SYSADMIN.ScheduleJobs sj on sj.id = sjr.jobId
LEFT JOIN dwh.dv_job_data_sources ds on ds.job_name = 
(
CASE 
	WHEN sjr.jobType = 'recopt' THEN SUBSTRING(SUBSTRING(sjr.sqlCommand, 16), 0, LOCATE('"', SUBSTRING(sjr.sqlCommand, 16))-1)
	ELSE sj.description
END
)
WHERE 
NOT (sjr.status = 'RUNNING' 
AND TIMESTAMPDIFF(SQL_TSI_SECOND, sjr.startTime, now())/60 > 1500)
AND NOT TIMESTAMPDIFF(SQL_TSI_SECOND, sjr.startTime, sjr.endTime)/60 > 1500


