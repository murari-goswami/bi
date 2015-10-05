-- Name: forecast.state_p12
-- Created: 2015-05-05 18:00:51
-- Updated: 2015-05-05 18:00:51

CREATE VIEW forecast.state_p12 AS
SELECT
	xx.customer_id,
    'P12' AS state
FROM
(SELECT
	cofo.customer_id,
	ac.count
FROM forecast.customer__first_order AS cofo
LEFT JOIN
(SELECT
	co.customer_id,
	count(*) AS count
FROM bi.customer_order AS co
WHERE co.order_type IN ('Repeat Order', 'Outfittery Club Order')
  AND NOT (TIMESTAMPADD(SQL_TSI_MONTH, -6, TIMESTAMPCREATE('2015-01-01', '00:00:00')) <= co.date_shipped
  AND co.date_shipped < TIMESTAMPCREATE('2015-01-01', '00:00:00'))
GROUP BY co.customer_id) AS ac
    ON ac.customer_id = cofo.customer_id
WHERE TIMESTAMPDIFF(SQL_TSI_MONTH, cofo.date_shipped, TIMESTAMPCREATE('2015-01-01', '00:00:00')) >= 6
  AND ac.count IS NULL) AS xx
LEFT JOIN
(SELECT
    co2.customer_id
FROM bi.customer_order AS co2
WHERE co2.order_type IN ('Repeat Order', 'Outfittery Club Order')
  AND TIMESTAMPADD(SQL_TSI_MONTH, -12, TIMESTAMPCREATE('2015-01-01', '00:00:00')) <= co2.date_shipped
  AND co2.date_shipped < TIMESTAMPCREATE('2015-01-01', '00:00:00')) AS p
	ON p.customer_id = xx.customer_id
WHERE p.customer_id IS NULL


