-- Name: tableau.doc_data_transmission
-- Created: 2015-04-29 18:58:13
-- Updated: 2015-04-29 18:58:13

CREATE VIEW tableau.doc_data_transmission
AS

SELECT
	a.orderid,
	a.date_of_trasmission
FROM
(
	SELECT 
		sl.orderid,
		sl.date_created as date_of_trasmission,
		row_number() over (partition by sl.orderid order by sl.date_created) as rnum
	FROM postgres.doc_data_sales_order_line sl
)a
WHERE a.rnum=1


