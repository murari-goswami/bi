-- Name: ml.project_tinder
-- Created: 2015-04-24 18:19:49
-- Updated: 2015-04-24 18:19:49

CREATE VIEW ml.project_tinder AS
SELECT
foo.molor,
foo.kept,
foo.returned,
foo.date_picked_latest,
ai.image_url,
ac.flat_category,
ainfo.model,
ab.attribute_name brand
FROM (
    SELECT
        molor,
        SUM(returned) returned,
        SUM(kept) kept,
        MIN(article_id) article_id,
        MAX(date_picked) date_picked_latest
    FROM
        (
        SELECT
        a.article_id,
        ai.molor,
        CASE WHEN coa.state = 'Returned' THEN 1 ELSE 0 END returned,
        CASE WHEN coa.state = 'Kept' THEN 1 ELSE 0 END kept,
        coa.date_picked
        FROM
        "raw.customer_order_articles" coa
        JOIN "raw.article" a ON coa.article_id = a.article_id
        JOIN ml.article_info ai ON ai.article_id = a.article_id
        WHERE coa.state in ( 'Returned', 'Kept' )
        ) x
GROUP BY molor
) foo
JOIN ml.article_image ai ON ai.id = foo.article_id
JOIN ml.article_info ainfo ON ainfo.article_id = foo.article_id
JOIN ml.article_brand ab ON ab.article_id = foo.article_id
LEFT JOIN ml.article_category_new ac ON ac.article_id = foo.article_id
WHERE ac.flat_category IS NOT NULL
AND ac.flat_category NOT IN ( 'other', 'shoulder_bag', 'socks', 'sport_socks', 't_shirt_basic', 'underpants', 'undershirt' )
AND ai.image_url LIKE_REGEX 'http://pim.*'


