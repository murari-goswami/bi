-- Name: ml.article_image
-- Created: 2015-04-24 18:17:44
-- Updated: 2015-04-24 18:17:44

/* Arbitrary image for each OWN STOCK article */
CREATE VIEW ml.article_image AS
SELECT
a.id,
ssa.image_url
FROM
"postgres.article" a
JOIN 
(
	SELECT
		article_id,
		max(id) as supplier_article_id
	FROM postgres.supplier_article s
	WHERE supplier_id = 15
	GROUP BY 1
) sa on sa.article_id = a.id 
JOIN
postgres.supplier_article ssa ON sa.supplier_article_id = ssa.id


