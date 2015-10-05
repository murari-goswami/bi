-- Name: views.convert_mssql_tstamp
-- Created: 2015-04-30 16:10:39

CREATE VIRTUAL PROCEDURE views.convert_mssql_tstamp(IN tstamp varbinary) RETURNS (itstamp biginteger) AS
BEGIN
SELECT x.itstamp FROM OBJECTTABLE(LANGUAGE 'javascript' 'new java.math.BigInteger(tstamp,16)' PASSING tstamp AS tstamp COLUMNS itstamp biginteger 'dv_row') AS x;
END


