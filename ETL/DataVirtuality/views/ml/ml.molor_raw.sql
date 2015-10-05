-- Name: ml.molor_raw
-- Created: 2015-04-24 18:23:05
-- Updated: 2015-04-24 18:23:05

CREATE VIEW ml.molor_raw AS
SELECT
m.molor_id AS "molor_id",
MAX(m.article_id) AS "article_id_arbitrary"
FROM "ml.article_molor" m
WHERE m.molor_id IS NOT NULL
GROUP BY m.molor_id


