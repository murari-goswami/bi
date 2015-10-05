-- Name: forecast.union
-- Created: 2015-05-05 18:30:46
-- Updated: 2015-05-05 18:47:58

CREATE VIEW forecast.union AS
SELECT
        cofo.customer_id,
        'IOP' AS "state"
    FROM forecast.customer__first_order AS cofo
    WHERE TIMESTAMPDIFF(SQL_TSI_MONTH, cofo.date_shipped, TIMESTAMPCREATE('2015-05-05', '18:42:29')) >= 0
          AND TIMESTAMPDIFF(SQL_TSI_MONTH, cofo.date_shipped, TIMESTAMPCREATE('2015-05-05', '18:42:29')) < 1
    
UNION
SELECT
        cofo.customer_id,
        'vh1' AS "state"
    FROM forecast.customer__first_order AS cofo
    WHERE TIMESTAMPDIFF(SQL_TSI_MONTH, cofo.date_shipped, TIMESTAMPCREATE('2015-05-05', '18:42:29')) >= 1
      AND TIMESTAMPDIFF(SQL_TSI_MONTH, cofo.date_shipped, TIMESTAMPCREATE('2015-05-05', '18:42:29')) < 2
    
UNION
SELECT
        cofo.customer_id,
        'vh2' AS "state"
    FROM forecast.customer__first_order AS cofo
    WHERE TIMESTAMPDIFF(SQL_TSI_MONTH, cofo.date_shipped, TIMESTAMPCREATE('2015-05-05', '18:42:29')) >= 2
      AND TIMESTAMPDIFF(SQL_TSI_MONTH, cofo.date_shipped, TIMESTAMPCREATE('2015-05-05', '18:42:29')) < 6
    
UNION
SELECT
        cofo.customer_id,
        'AC' AS state
    FROM forecast.customer__first_order AS cofo
    LEFT JOIN ( SELECT
        co.customer_id,
        count(*) AS "count"
    FROM bi.customer_order AS co
    WHERE co.order_type IN ('Repeat Order', 'Outfittery Club Order')
          AND TIMESTAMPCREATE('2014-11-04', '09:06:29') <= co.date_shipped
          AND co.date_shipped < TIMESTAMPCREATE('2015-05-05', '18:42:29')
    GROUP BY co.customer_id ) AS "ac" ON ac.customer_id = cofo.customer_id
    WHERE TIMESTAMPDIFF(SQL_TSI_MONTH, cofo.date_shipped, TIMESTAMPCREATE('2015-05-05', '18:42:29')) >= 6
    AND ac.count IS NOT NULL
UNION
SELECT
        cofo.customer_id,
        'P6' AS state
    FROM forecast.customer__first_order AS cofo
    LEFT JOIN (SELECT
        co.customer_id,
        count(*) AS "count"
    FROM bi.customer_order AS co
    WHERE co.order_type IN ('Repeat Order', 'Outfittery Club Order')
          AND TIMESTAMPCREATE('2014-11-04', '09:06:29') <= co.date_shipped
          AND co.date_shipped < TIMESTAMPCREATE('2015-05-05', '18:42:29')
    GROUP BY co.customer_id) AS r6 ON r6.customer_id = cofo.customer_id
    LEFT JOIN (SELECT
        co.customer_id,
        count(*) AS "count"
    FROM bi.customer_order AS co
    WHERE co.order_type IN ('Repeat Order', 'Outfittery Club Order')
          AND TIMESTAMPCREATE('2014-05-05', '23:30:29') <= co.date_shipped
          AND co.date_shipped < TIMESTAMPCREATE('2014-11-04', '09:06:29')
    GROUP BY co.customer_id) AS r12 ON r12.customer_id = cofo.customer_id
    WHERE TIMESTAMPDIFF(SQL_TSI_MONTH, cofo.date_shipped, TIMESTAMPCREATE('2015-05-05', '18:42:29')) >= 6
          AND r6.count IS NULL
          AND r12.count IS NOT NULL
    
UNION
SELECT
        cofo.customer_id,
        'P12' AS state
    FROM forecast.customer__first_order AS cofo
    LEFT JOIN (SELECT
        co.customer_id,
        count(*) AS "count"
    FROM bi.customer_order AS co
    WHERE co.order_type IN ('Repeat Order', 'Outfittery Club Order')
          AND TIMESTAMPCREATE('2014-11-04', '09:06:29') <= co.date_shipped
          AND co.date_shipped < TIMESTAMPCREATE('2015-05-05', '18:42:29')
    GROUP BY co.customer_id) AS r6 ON r6.customer_id = cofo.customer_id
    LEFT JOIN (SELECT
        co.customer_id,
        count(*) AS "count"
    FROM bi.customer_order AS co
    WHERE co.order_type IN ('Repeat Order', 'Outfittery Club Order')
          AND TIMESTAMPCREATE('2014-05-05', '23:30:29') <= co.date_shipped
          AND co.date_shipped < TIMESTAMPCREATE('2014-11-04', '09:06:29')
    GROUP BY co.customer_id) AS r12 ON r12.customer_id = cofo.customer_id
    WHERE TIMESTAMPDIFF(SQL_TSI_MONTH, cofo.date_shipped, TIMESTAMPCREATE('2015-05-05', '18:42:29')) >= 6
          AND r6.count IS NULL
          AND r12.count IS NULL


