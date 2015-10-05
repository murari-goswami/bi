-- Name: ml.article_category_new
-- Created: 2015-04-24 18:19:24
-- Updated: 2015-04-24 18:19:24

/*
    Article -> Amidala Category Mapping

    Each article has at most one category by breaking ties favoring
    categories that don't have 'sale' or 'premium' in the category
    and having bigger depth
*/
CREATE VIEW ml.article_category_new AS
SELECT
    article_id,
    attribute_id,
    identifier,
    flat_category,
    sale_or_premium,
    c0,
    c1,
    c2,
    c3,
    c4,
    c5
FROM
    ( SELECT
        a.article_id,
        category.attribute_id,
        category.identifier,
        category.flat_category,
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
        ml.article a
    /**/
        JOIN
        ml.article_attribute aa
        ON a.article_id = aa.article_id
    /**/
        JOIN
        ml.category_new category
        ON aa.attribute_id = category.attribute_id
    ORDER BY a.article_id, category.sale_or_premium ASC, category.depth DESC )
    AS ac
WHERE ac.rank = 1


