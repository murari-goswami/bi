-- Name: tableau.ops_stock_movement_details
-- Created: 2015-04-24 18:19:39
-- Updated: 2015-04-24 18:19:39

CREATE VIEW tableau.ops_stock_movement_details AS

SELECT
	'booked' AS source,
    date_stock_booked AS date_created,
	article_id,
	purchase_order_id,
    supplier_id,
	NULL AS order_id,
	SUM(stock_booked) AS articles
FROM 
	bi.stock_booked
WHERE
	date_stock_booked >= TIMESTAMPADD(SQL_TSI_DAY, -28, CURDATE())
/* AND article_id = 39041817 */
GROUP BY 2,3,4,5

UNION

SELECT
	'packed' AS source,
	date_stock_packed,                                   	                         	
	article_id,
	NULL AS purchase_order_id,
	NULL AS supplier_id,
	order_id,	
	-stock_packed AS stock_packed
FROM
	raw.stock_packed
WHERE
	date_stock_packed >= TIMESTAMPADD(SQL_TSI_DAY, -28, CURDATE())
/* AND CAST(outfittery_article_number AS LONG) = 39041817 */

UNION
	
SELECT
	'inventory' AS transaction,
	seh.date_created,
	CAST(seh.sku AS LONG) AS article_id,
	NULL AS purchase_order_id,
	NULL AS supplier_id,
	NULL AS order_id,
	CAST(seh.quantity AS INTEGER) AS stock
FROM
	dwh.stock_entry_history seh
	JOIN
	(
		SELECT
			sku
		FROM
			dwh.stock_entry_history
		WHERE
			date_created >= TIMESTAMPADD(SQL_TSI_DAY, -28, CURDATE())
		GROUP BY 1
		HAVING
			SUM(CAST(quantity AS INTEGER)) > 0
	) z
		ON seh.sku = z.sku
WHERE
	seh.date_created >= TIMESTAMPADD(SQL_TSI_DAY, -28, CURDATE())
/* AND CAST(sku AS LONG) = 39041817 */

UNION

SELECT
	'inventory doc data' AS transaction,
	sehdd.date_created,
	CAST(sehdd.sku AS LONG) AS article_id,
	NULL AS purchase_order_id,
	NULL AS supplier_id,
	CAST(NULL AS LONG) AS order_id,
	CAST(sehdd.docdata_quantity AS INTEGER) AS stock
FROM
	dwh.stock_entry_history_dd sehdd
	JOIN
	(
		SELECT
			sku
		FROM
			dwh.stock_entry_history_dd
		WHERE
			date_created >= TIMESTAMPADD(SQL_TSI_DAY, -28, CURDATE())
		GROUP BY 1
		HAVING
			SUM(CAST(docdata_quantity AS INTEGER)) > 0
	) q
		ON sehdd.sku = q.sku
WHERE
	date_created >= TIMESTAMPADD(SQL_TSI_DAY, -28, CURDATE())
/* AND CAST(sku AS LONG) = 39041817 */


