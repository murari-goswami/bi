SELECT
    domain_userid,
    se_label::int8 AS experiment_id,
    MIN(se_value)::int8 AS variation_id,
    MIN(collector_tstamp) AS date_assigned
FROM stage.snowplow_events
WHERE event = 'struct'
  AND se_category = 'optimizely test'
GROUP BY 1, 2
HAVING COUNT(DISTINCT se_value) = 1
