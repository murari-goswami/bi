-- Name: tableau.dv_queries_last_3hours
-- Created: 2015-09-15 13:13:40
-- Updated: 2015-09-15 13:13:40

CREATE VIEW tableau.dv_queries_last_3hours
AS

SELECT 
	id,
	startTime,
	endTime,
	state,
	issuer
FROM "SYSADMIN.Queries" 
WHERE startTime>=timestampadd(sql_tsi_hour,-3,now())


