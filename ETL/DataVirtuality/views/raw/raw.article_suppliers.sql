-- Name: raw.article_suppliers
-- Created: 2015-04-24 18:17:43
-- Updated: 2015-04-24 18:17:43

CREATE VIEW raw.article_suppliers
AS
SELECT 
x.article_id,
x.supplier_id
FROM
(
SELECT
	pop.article_id,
	po.supplier_id,
	row_number() over (partition by pop.article_id order by pop.date_created desc) as "rnum"
FROM postgres.purchase_order po
JOIN postgres.purchase_order_position pop on pop.purchase_order_id = po.id
WHERE po.stock_location_id = 2
) x 
WHERE x.rnum = 1


