-- Name: ml.article_molor
-- Created: 2015-04-24 18:19:58
-- Updated: 2015-04-24 18:19:58

CREATE VIEW ml.article_molor AS
SELECT
	ar.article_id,
	CASE WHEN ar.article_model_id IS NOT NULL
	  	  AND ar.article_color IS NOT NULL
	      AND ar.article_color != 'UNKNOWN'
	      AND ar.article_model_id != 0
	     THEN ar.article_model_id || '_' || ar.article_color ELSE ar.article_id END AS molor_id
FROM bi.article AS ar
ORDER BY ar.article_id ASC


