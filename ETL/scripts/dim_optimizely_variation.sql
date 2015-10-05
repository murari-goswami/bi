SELECT
    	variations.variation_id,
    	variations.variation_name
FROM (
    SELECT DISTINCT
        ROW_NUMBER() OVER (PARTITION BY se_value ORDER BY se_property ASC) AS order_name,
        se_value AS variation_id,
        se_property AS variation_name
    FROM stage.snowplow_events
    WHERE se_value IS NOT NULL
      AND event = 'struct'
      AND se_category = 'optimizely test'
) AS variations
    WHERE variations.order_name = 1
