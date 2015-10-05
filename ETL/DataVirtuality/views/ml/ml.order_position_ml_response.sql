-- Name: ml.order_position_ml_response
-- Created: 2015-04-24 18:17:43
-- Updated: 2015-04-24 18:17:43

CREATE VIEW ml.order_position_ml_response AS
SELECT
	op.id AS order_position_id,
	aml.ml_response_id
FROM
(SELECT
	tbl.article_id,
	tbl.order_id,
	tbl.ml_response_id
FROM
(SELECT
	at.foreign_id AS article_id,
	at.order_id AS order_id,
	at.ml_response_id AS ml_response_id,
	at.date_created,
	ROW_NUMBER() OVER (PARTITION BY at.order_id, at.foreign_id ORDER BY at.date_created DESC) AS rk
FROM postgres.action_tracking as at
WHERE action = 'ARTICLE_ADD') AS tbl
WHERE tbl.rk = 1) AS aml
INNER JOIN postgres.order_position AS op
	ON op.order_id = aml.order_id and op.article_id = aml.article_id


