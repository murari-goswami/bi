-- Name: ml.optimizely1
-- Created: 2015-07-21 16:03:55
-- Updated: 2015-07-21 16:03:55

CREATE VIEW ml.optimizely1 AS
SELECT
*
FROM "tableau.product_optimizely_performance" opti
WHERE optimizely_test_name = 'Optimizely_DE_PICK_CALL_NOCALL_Call_Nocall_Control_Short_Nocall_Funnel_12.06. (3026870441)'
AND order_incoming = '1'


