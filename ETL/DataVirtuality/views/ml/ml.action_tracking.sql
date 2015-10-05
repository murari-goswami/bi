-- Name: ml.action_tracking
-- Created: 2015-04-24 18:19:19
-- Updated: 2015-04-24 18:19:19

create VIEW ml.action_tracking 
AS
SELECT
    a.id AS action_tracking_id,
    a.order_id,
    a.stylist_id,
    a.article_id,
    a.ml_response_id,
    op.order_position_id,
    a.date,
    a.action
FROM ( SELECT
           id,
           order_id,
           stylist_id,
           date_created "date",
           action,
           CASE WHEN origin = 'ARTICLE_ID' THEN CAST(foreign_id AS INTEGER) ELSE NULL END AS article_id,
           CASE WHEN action = 'SEARCH' THEN foreign_id ELSE at.ml_response_id END AS ml_response_id
       FROM "postgres.action_tracking" at ) a
LEFT JOIN "raw.customer_order_articles" op ON op.order_id = a.order_id AND op.article_id = a.article_id


