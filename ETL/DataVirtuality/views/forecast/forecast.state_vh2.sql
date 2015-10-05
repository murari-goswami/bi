-- Name: forecast.state_vh2
-- Created: 2015-05-05 16:36:34
-- Updated: 2015-05-05 16:36:34

CREATE VIEW forecast.state_vh2 AS
SELECT
	cofo.customer_id,
	'VH2' AS "state"
FROM forecast.customer__first_order AS cofo
WHERE TIMESTAMPDIFF(SQL_TSI_DAY, cofo.date_shipped, TIMESTAMPCREATE('2015-01-01', '00:00:00')) >= 2 * 30.4
  AND TIMESTAMPDIFF(SQL_TSI_DAY, cofo.date_shipped, TIMESTAMPCREATE('2015-01-01', '00:00:00')) < 6 * 30.4


