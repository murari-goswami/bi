-- Name: ml.project_compl_articles
-- Created: 2015-04-24 18:19:49
-- Updated: 2015-04-24 18:19:49

CREATE VIEW ml.project_compl_articles AS
SELECT
	ai.article_id,
    ai.model AS model_id,
    ai.molor,
    ai.brand_amidala,
    cat.flat_category
FROM ml.article_info AS ai
JOIN ml.article_category_new AS cat
    ON ai.article_id = cat.article_id


