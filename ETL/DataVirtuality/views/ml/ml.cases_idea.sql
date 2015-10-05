-- Name: ml.cases_idea
-- Created: 2015-08-18 12:20:10
-- Updated: 2015-08-18 12:40:24

CREATE VIEW ml.cases_idea AS

WITH

level_0 AS (
SELECT
  co0.order_id,
  co0.order_id "origin_order_id",
  0 "level"
FROM "raw.dim_customer_order" co0
WHERE co0.parent_order_id IS NULL
),

level_1 AS (
SELECT
  co1.order_id,
  parent.origin_order_id,
  1 "level"
FROM "raw.dim_customer_order" co1
INNER JOIN level_0 parent ON parent.order_id = co1.parent_order_id ),

level_2 AS (
SELECT
  co1.order_id,
  parent.origin_order_id,
  2 "level"
FROM "raw.dim_customer_order" co1
INNER JOIN level_1 parent ON parent.order_id = co1.parent_order_id ),

level_3 AS (
SELECT
  co1.order_id,
  parent.origin_order_id,
  3 "level"
FROM "raw.dim_customer_order" co1
INNER JOIN level_2 parent ON parent.order_id = co1.parent_order_id ),

level_4 AS (
SELECT
  co1.order_id,
  parent.origin_order_id,
  4 "level"
FROM "raw.dim_customer_order" co1
INNER JOIN level_3 parent ON parent.order_id = co1.parent_order_id ),

level_5 AS (
SELECT
  co1.order_id,
  parent.origin_order_id,
  5 "level"
FROM "raw.dim_customer_order" co1
INNER JOIN level_4 parent ON parent.order_id = co1.parent_order_id ),

level_6 AS (
SELECT
  co1.order_id,
  parent.origin_order_id,
  6 "level"
FROM "raw.dim_customer_order" co1
INNER JOIN level_5 parent ON parent.order_id = co1.parent_order_id ),

level_7 AS (
SELECT
  co1.order_id,
  parent.origin_order_id,
  7 "level"
FROM "raw.dim_customer_order" co1
INNER JOIN level_6 parent ON parent.order_id = co1.parent_order_id ),

all_levels AS (
	SELECT * FROM level_0
	UNION
	SELECT * FROM level_1
	UNION
	SELECT * FROM level_2
	UNION
	SELECT * FROM level_3
	UNION
	SELECT * FROM level_4
	UNION
	SELECT * FROM level_5
	UNION
	SELECT * FROM level_6
	UNION
	SELECT * FROM level_7
),

cases AS (
SELECT
co77.customer_id,
co77.order_id "case_id",
RANK() OVER(PARTITION BY co77.customer_id ORDER BY co77.date_created ASC) "case_no"
FROM level_0
LEFT JOIN "raw.dim_customer_order" co77 ON co77.order_id = level_0.origin_order_id
)

SELECT
co88.order_id,
cases.case_id,
cases.case_no,
all_levels.level "level"
FROM "raw.dim_customer_order" co88
LEFT JOIN all_levels ON all_levels.order_id = co88.order_id
LEFT JOIN cases ON cases.case_id = all_levels.origin_order_id


