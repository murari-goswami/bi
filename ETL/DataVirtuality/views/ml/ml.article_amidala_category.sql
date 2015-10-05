-- Name: ml.article_amidala_category
-- Created: 2015-04-24 18:19:21
-- Updated: 2015-04-24 18:19:21

CREATE VIEW ml.article_amidala_category AS
SELECT
    article_id,
    attribute_id
FROM
    ( SELECT
        a.article_id,
        category.attribute_id,
        category.identifier,
        category.sale_or_premium,
        category.c0,
        category.c1,
        category.c2,
        category.c3,
        category.c4,
        category.c5,
        ROW_NUMBER() OVER ( PARTITION BY a.article_id ORDER BY a.article_id,
                                                               category.sale_or_premium ASC,
                                                               category.depth DESC )
        AS rank
    FROM
        raw.article a
    /**/
        JOIN
        ml.article_attribute aa
        ON a.article_id = aa.article_id
    /**/
        JOIN
        ml.amidala_category_leaves category
        ON aa.attribute_id = category.attribute_id
    ORDER BY a.article_id, category.sale_or_premium ASC, category.depth DESC )
    AS ac
WHERE ac.rank = 1


