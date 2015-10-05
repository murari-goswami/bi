-- Name: ml.article
-- Created: 2015-04-24 18:17:42
-- Updated: 2015-04-24 18:17:42

CREATE VIEW ml.article AS
SELECT
a.id AS article_id,
a.model_id as model,
a.color as color,
a.active
FROM
"postgres.article" a


