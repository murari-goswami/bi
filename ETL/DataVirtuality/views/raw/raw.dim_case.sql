-- Name: raw.dim_case
-- Created: 2015-09-17 11:57:00
-- Updated: 2015-09-17 11:57:00

/*******************************************************************
-- Author       Hemanth
-- Created      2015-07-01
-- Purpose      This view assigns the parent order id if the order id has 
                parent_order_id column filled (ONLY for follown Orders) and
                assigns number of followons created for parent order
--Tables        raw.dim_customer_order
-------------------------------------------------------------------------------
-- Modification History
--Date          Author      Description
--2015-09-16    Hemanth     Added Header to query
*******************************************************************/

CREATE VIEW raw.dim_case 
AS

WITH level_0 AS 
(
  SELECT
    co0.order_id,
    co0.order_id "origin_order_id",
    co0.date_created as "orgin_date_created",
    0 "level"
  FROM "raw.dim_customer_order" co0
  WHERE co0.parent_order_id IS NULL
),

level_1 AS 
(
  SELECT
    co1.order_id,
    parent.origin_order_id,
    parent.orgin_date_created,
    1 "level"
  FROM "raw.dim_customer_order" co1
  INNER JOIN level_0 parent ON parent.order_id = co1.parent_order_id 
),

level_2 AS 
(
  SELECT
    co1.order_id,
    parent.origin_order_id,
    parent.orgin_date_created,
    2 "level"
  FROM "raw.dim_customer_order" co1
  INNER JOIN level_1 parent ON parent.order_id = co1.parent_order_id 
),

level_3 AS 
(
  SELECT
    co1.order_id,
    parent.origin_order_id,
    parent.orgin_date_created,
    3 "level"
  FROM "raw.dim_customer_order" co1
  INNER JOIN level_2 parent ON parent.order_id = co1.parent_order_id
),

level_4 AS 
(
  SELECT
    co1.order_id,
    parent.origin_order_id,
    parent.orgin_date_created,
    4 "level"
  FROM "raw.dim_customer_order" co1
  INNER JOIN level_3 parent ON parent.order_id = co1.parent_order_id 
),

level_5 AS 
(
  SELECT
    co1.order_id,
    parent.origin_order_id,
    parent.orgin_date_created,
    5 "level"
  FROM "raw.dim_customer_order" co1
  INNER JOIN level_4 parent ON parent.order_id = co1.parent_order_id 
),

level_6 AS 
(
  SELECT
    co1.order_id,
    parent.origin_order_id,
    parent.orgin_date_created,
    6 "level"
  FROM "raw.dim_customer_order" co1
  INNER JOIN level_5 parent ON parent.order_id = co1.parent_order_id 
),

level_7 AS (
SELECT
  co1.order_id,
  parent.origin_order_id,
  parent.orgin_date_created,
  7 "level"
FROM "raw.dim_customer_order" co1
INNER JOIN level_6 parent ON parent.order_id = co1.parent_order_id ),

all_levels AS 
(
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

cases AS 
(
  SELECT
    co77.customer_id,
    co77.order_id "case_id",
    co77.date_created "case_date_created",
    RANK() OVER(PARTITION BY co77.customer_id ORDER BY co77.date_created ASC) "case_no"
  FROM level_0
  LEFT JOIN "raw.dim_customer_order" co77 ON co77.order_id = level_0.origin_order_id
)

SELECT
  co88.order_id,
  cases.case_id,
  cases.case_date_created,
  cases.case_no,
  all_levels.level "level"
FROM "raw.dim_customer_order" co88
LEFT JOIN all_levels ON all_levels.order_id = co88.order_id
LEFT JOIN cases ON cases.case_id = all_levels.origin_order_id


