-- Name: ml.category_new
-- Created: 2015-04-24 18:17:44
-- Updated: 2015-04-24 18:17:44

CREATE VIEW ml.category_new AS
WITH leaves AS
(
   SELECT
   a0.id AS id_0,
   a0.last_updated,
         (CAST ((a0.id IS NOT NULL) AS INTEGER)) +
   (CAST ((a1.id IS NOT NULL) AS INTEGER)) +
   (CAST ((a2.id IS NOT NULL) AS INTEGER)) +
   (CAST ((a3.id IS NOT NULL) AS INTEGER)) +
   (CAST ((a4.id IS NOT NULL) AS INTEGER)) +
   (CAST ((a5.id IS NOT NULL) AS INTEGER)) AS depth,
         COALESCE( ('sale' = a0.identifier), FALSE ) OR
   COALESCE( ('sale' = a1.identifier), FALSE ) OR
   COALESCE( ('sale' = a2.identifier), FALSE ) OR
   COALESCE( ('sale' = a3.identifier), FALSE ) OR
   COALESCE( ('sale' = a4.identifier), FALSE ) OR
   COALESCE( ('sale' = a5.identifier), FALSE ) OR
   COALESCE( ('premium' = a0.identifier), FALSE ) OR
   COALESCE( ('premium' = a1.identifier), FALSE ) OR
   COALESCE( ('premium' = a2.identifier), FALSE ) OR
   COALESCE( ('premium' = a3.identifier), FALSE ) OR
   COALESCE( ('premium' = a4.identifier), FALSE ) OR
   COALESCE( ('premium' = a5.identifier), FALSE ) AS sale_or_premium,
         a0.identifier AS identifier_0,
   a1.identifier AS identifier_1,
   a2.identifier AS identifier_2,
   a3.identifier AS identifier_3,
   a4.identifier AS identifier_4,
   a5.identifier AS identifier_5
   from postgres.attribute a0
   LEFT JOIN postgres.attribute a1 ON (a0.parent_id = a1.id)
   LEFT JOIN postgres.attribute a2 ON a1.parent_id = a2.id
   LEFT JOIN postgres.attribute a3 ON a2.parent_id = a3.id
   LEFT JOIN postgres.attribute a4 ON a3.parent_id = a4.id
   LEFT JOIN postgres.attribute a5 ON a4.parent_id = a5.id
   LEFT JOIN postgres.attribute att_child ON att_child.parent_id = a0.id
   WHERE a0.property_id = 280118
   AND att_child.id IS NULL
),
fc AS (
	SELECT "csv_table".* FROM
   (call "file".getFiles('ml_flat_categories.csv')) f,
	TEXTTABLE(to_chars(f.file,'UTF-8')
		COLUMNS
		"category_identifier" STRING ,
		"flat_category" STRING
		DELIMITER ','
		QUOTE ''''
		HEADER 1
	)
"csv_table"
)
SELECT
    l.id_0 AS attribute_id,
    l.identifier_0 AS identifier,
    l.depth,
    l.sale_or_premium,
    l.last_updated,
    fc.flat_category,
/**/
    CASE
    WHEN l.depth = 6 THEN identifier_5
    WHEN l.depth = 5 THEN identifier_4
    WHEN l.depth = 4 THEN identifier_3
    WHEN l.depth = 3 THEN identifier_2
    WHEN l.depth = 2 THEN identifier_1
    WHEN l.depth = 1 THEN identifier_0
    END AS c0,
/**/
    CASE
    WHEN l.depth = 5+1 THEN identifier_4
    WHEN l.depth = 4+1 THEN identifier_3
    WHEN l.depth = 3+1 THEN identifier_2
    WHEN l.depth = 2+1 THEN identifier_1
    WHEN l.depth = 1+1 THEN identifier_0
    END AS c1,
/**/
    CASE
    WHEN l.depth = 4+2 THEN identifier_3
    WHEN l.depth = 3+2 THEN identifier_2
    WHEN l.depth = 2+2 THEN identifier_1
    WHEN l.depth = 1+2 THEN identifier_0
    END AS c2,
/**/
    CASE
    WHEN l.depth = 3+3 THEN identifier_2
    WHEN l.depth = 2+3 THEN identifier_1
    WHEN l.depth = 1+3 THEN identifier_0
    END AS c3,
/**/
    CASE
    WHEN l.depth = 2+4 THEN identifier_1
    WHEN l.depth = 1+4 THEN identifier_0
    END AS c4,
/**/
    CASE
    WHEN l.depth = 1+5 THEN identifier_0
    END AS c5
FROM leaves AS l
LEFT JOIN fc ON l.identifier_0 = fc.category_identifier


