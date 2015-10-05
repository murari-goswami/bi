-- Name: forecast.state_vh1
-- Created: 2015-05-05 16:36:19
-- Updated: 2015-05-05 16:36:19

CREATE VIEW forecast.state_vh1 AS
SELECT
	cofo.customer_id,
	'VH1' AS "state"
FROM forecast.customer__first_order AS cofo
WHERE TIMESTAMPDIFF(SQL_TSI_DAY, cofo.date_shipped, TIMESTAMPCREATE('2015-01-01', '00:00:00')) >= 30.4
  AND TIMESTAMPDIFF(SQL_TSI_DAY, cofo.date_shipped, TIMESTAMPCREATE('2015-01-01', '00:00:00')) < 2 * 30.4


