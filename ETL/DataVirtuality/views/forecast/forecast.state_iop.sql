-- Name: forecast.state_iop
-- Created: 2015-05-05 16:35:28
-- Updated: 2015-05-05 16:35:28

CREATE VIEW forecast.state_iop AS
SELECT
	cofo.customer_id,
	'IOP' AS "state"
FROM forecast.customer__first_order AS cofo
WHERE TIMESTAMPDIFF(SQL_TSI_DAY, cofo.date_shipped, TIMESTAMPCREATE('2015-01-01', '00:00:00')) >= 0
  AND TIMESTAMPDIFF(SQL_TSI_DAY, cofo.date_shipped, TIMESTAMPCREATE('2015-01-01', '00:00:00')) < 30.4


