-- Name: forecast.state_ac
-- Created: 2015-05-05 17:00:52
-- Updated: 2015-05-05 17:50:43

CREATE VIEW forecast.state_ac AS
SELECT
    cofo.customer_id,
	ac.count
FROM forecast.customer__first_order AS cofo
LEFT JOIN (SELECT
               co.customer_id,
               count(*) AS count
            FROM bi.customer_order AS co
            WHERE co.order_type IN ('Repeat Order', 'Outfittery Club Order')
            AND TIMESTAMPADD(SQL_TSI_MONTH, -6, TIMESTAMPCREATE('2015-01-01', '00:00:00')) <= co.date_shipped
            AND co.date_shipped < TIMESTAMPCREATE('2015-01-01', '00:00:00')
            GROUP BY co.customer_id) AS ac
        ON ac.customer_id = cofo.customer_id
WHERE TIMESTAMPDIFF(SQL_TSI_MONTH, cofo.date_shipped, TIMESTAMPCREATE('2015-01-01', '00:00:00')) >= 6
AND ac.count IS NOT NULL


