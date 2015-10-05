SELECT
    session_date.domain_userid,
    session_date.domain_sessionidx,
    session_date.date_start,
    session_date.date_end,
    session_opportunity.opportunity_id::int8,
    session_first_customer_logged_in.first_customer_id_logged_in::int8
FROM (
    SELECT
        domain_userid,
        domain_sessionidx,
        MIN(collector_tstamp) AS date_start,
        MAX(collector_tstamp) AS date_end
    FROM stage.snowplow_events
    GROUP BY 1, 2
    HAVING COUNT(DISTINCT se_value) = 1
) AS session_date
LEFT JOIN (
    SELECT
    	domain_userid,
    	domain_sessionidx,
    	opportunity_id,
    	date_converted
    FROM (
        SELECT
        	domain_userid,
            domain_sessionidx,
            ROW_NUMBER() OVER (PARTITION BY domain_userid, domain_sessionidx ORDER BY collector_tstamp ASC) AS order_number,
            tr_orderid AS opportunity_id,
            collector_tstamp AS date_converted
        FROM stage.snowplow_events
        WHERE tr_orderid IS NOT NULL
    ) AS domain_oppurtunity_all
    WHERE order_number = 1
) AS session_opportunity
    ON session_date.domain_userid = session_opportunity.domain_userid
    AND session_date.domain_sessionidx = session_opportunity.domain_sessionidx
LEFT JOIN (
    SELECT
        domain_userid,
        domain_sessionidx,
        user_id AS first_customer_id_logged_in
    FROM (
        SELECT
            domain_userid,
            domain_sessionidx,
            user_id,
            ROW_NUMBER() OVER (PARTITION BY domain_userid, domain_sessionidx ORDER BY collector_tstamp ASC) order_appearance
        FROM stage.snowplow_events
        WHERE user_id IS NOT NULL
    ) AS session_users
    WHERE order_appearance = 1
) AS session_first_customer_logged_in
    ON session_date.domain_userid = session_first_customer_logged_in.domain_userid
    AND session_date.domain_sessionidx = session_first_customer_logged_in.domain_sessionidx
