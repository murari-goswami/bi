-- Name: bi.po_received_dates
-- Created: 2015-06-12 15:03:16
-- Updated: 2015-06-15 09:53:54

CREATE VIEW bi.po_received_dates AS

/* This query takes the min/max dates at the item_no + color_code level, then assigns it back to the article_ids */

SELECT
	item.article_id,
	dates.date_po_received_min,
	dates.date_po_received_max
FROM
	(
	SELECT
		item.item_no,
		item.color_code,
		MIN(book.stock_booking_date) AS date_po_received_min,
		MAX(book.stock_booking_date) AS date_po_received_max
	FROM
		bi.stock_booked AS book
		LEFT JOIN
		bi.item
			ON book.article_id = item.article_id
	WHERE
			book.po_bookings IS NOT NULL
		AND item.item_no IS NOT NULL
	GROUP BY 1,2
	) AS dates
	LEFT JOIN
	bi.item
		 ON dates.item_no 		= item.item_no
		AND dates.color_code 	= item.color_code


