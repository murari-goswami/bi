-- Name: raw.dfc_calls
-- Created: 2015-09-28 18:08:44
-- Updated: 2015-09-29 09:54:05

CREATE VIEW raw.dfc_calls
AS

WITH dfc AS
(
SELECT 
  ROW_NUMBER() over(PARTITION BY order_id ORDER BY date_create DESC) AS rank,
  order_id,
  date_create as date_created,
  comment 
FROM "postgres.order_comment" 
WHERE lower(comment) like '%dfc%'
)
SELECT 
  a.order_id,
  a.date_created as date_last_contacted,
  a.comment,
  b.nb_of_tries,
  CASE WHEN LOWER(comment) like '%dfc erreicht%' THEN 1 ELSE 0 END AS reached
FROM 
(
  SELECT 
  * 
  FROM dfc a 
  WHERE rank=1 
) a
LEFT JOIN
(
  SELECT
    order_id,
    COUNT(*) as nb_of_tries
  FROM dfc
  GROUP BY 1
)b ON b.order_id=a.order_id


