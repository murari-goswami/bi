-- Name: tableau.monitoring_dv_failures
-- Created: 2015-04-24 18:17:54
-- Updated: 2015-04-26 11:43:08

CREATE VIEW tableau.monitoring_dv_failures
AS

SELECT
x.job_name, 
x.job_type,
x.start_time,
x.mins,
x.status,
left(x.failure_reason,4000) as failure_reason
FROM
(
	SELECT
	CASE 
		WHEN sjr.jobType = 'recopt' THEN SUBSTRING(SUBSTRING(sjr.sqlCommand, 16), 0, LOCATE('"', SUBSTRING(sjr.sqlCommand, 16))-1)
		ELSE sj.description
	END as job_name,
	CASE 
		WHEN sjr.jobType = 'recopt' THEN 'optimisation'
		ELSE sjr.jobType 
	END as job_type,
	sjr.startTime as start_time,
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
	left(sjr.failureReason,4000) as failure_reason,
	rank() OVER(PARTITION BY 
		CASE 
			WHEN sjr.jobType = 'recopt' THEN SUBSTRING(SUBSTRING(sjr.sqlCommand, 16), 0, LOCATE('"', SUBSTRING(sjr.sqlCommand, 16))-1)
			ELSE sj.description
		END 
		ORDER BY sjr.startTime DESC) as job_recency
	FROM SYSADMIN.ScheduleJobRun sjr 
	LEFT JOIN SYSADMIN.ScheduleJobs sj on sj.id = sjr.jobId
	WHERE TIMESTAMPDIFF(SQL_TSI_HOUR, sjr.startTime, now()) < 25 
) x
WHERE x.job_recency = 1
AND job_type != 'cleanup'
AND status != 'SUCCESS'
AND job_name is not null
AND job_name not like '%sandbox%'
AND LOWER(COALESCE(failure_reason,'')) NOT LIKE '%the request%has been cancelled%'


