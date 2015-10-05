-- Name: ml.article_brand
-- Created: 2015-04-24 18:17:42
-- Updated: 2015-04-24 18:17:42

/*
Article -> Brand from Amidala
There is at most one Brand per Article by breaking ties
on favoring the brand with the shorter name.
This makes sense in most cases, since usually one brand
is a "sub-brand" of the other, e.g. "Strellson Sportswear" and "Strellson"
*/

CREATE VIEW ml.article_brand AS

/* Brand length lookup table */
WITH brand_att AS
     ( SELECT
           att.id,
           att.name,
           att.last_updated,
           LENGTH(att.name) length
       FROM postgres.attribute att
       WHERE att.property_id = 3409 )
   SELECT
    ab.article_id,
    ab.attribute_id,
    ab.attribute_name
FROM
    ( SELECT
        a.id AS article_id,
        brand_att.id AS attribute_id,
        brand_att.name AS attribute_name,
        brand_att.length AS attribute_name_length,
        ROW_NUMBER() OVER ( PARTITION BY a.id ORDER BY brand_att.length ASC,
                                                       brand_att.last_updated DESC ) AS rank
    FROM
        postgres.article AS a
               JOIN
        postgres.article_attribute AS aa
        ON aa.article_attributes_id = a.id
               JOIN
        brand_att
        ON aa.attribute_id = brand_att.id
    ) as ab
WHERE
ab.rank = 1


