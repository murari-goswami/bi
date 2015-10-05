-- Name: views.work_hours_between
-- Created: 2015-04-24 18:17:53

CREATE VIRTUAL PROCEDURE views.work_hours_between(IN startdate timestamp,IN enddate timestamp) returns (xdate integer)
as
BEGIN

                                                   
EXECUTE IMMEDIATE
'select CAST(CAST(TIMESTAMPDIFF(SQL_TSI_MINUTE, ' || startdate ||   ', '|| enddate || ') AS DECIMAL) / 60 - CASE WHEN MIN(c.working_days) = 0 THEN 24*2 ELSE 0 END AS INTEGER) hours
FROM dwh.calendar c 
WHERE CAST(LEFT(' || startdate || ',10) AS DATE) <= c.date and c.date <= CAST(LEFT(' || enddate || ',10) AS DATE)'
;


END


