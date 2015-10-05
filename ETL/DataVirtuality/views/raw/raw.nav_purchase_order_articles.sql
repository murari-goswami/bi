-- Name: raw.nav_purchase_order_articles
-- Created: 2015-06-18 16:27:45
-- Updated: 2015-06-18 16:27:45

CREATE VIEW raw.nav_purchase_order_articles AS
/* 	"nav_test.Outfittery GmbH$Purch_ Rcpt_ Header" h; for active POs */

WITH initial AS
(
SELECT
	l."document type",
	l."document no_",
	l."doc_ no_ occurrence",
	l."line no_",
	l.no_ AS item_no,
	l."Variant Code",
	l."Order Date",
	l."Expected Receipt Date",
	l."Requested Receipt Date", 
	l."Promised Receipt Date", 
	l."Planned Receipt Date",
	l.quantity AS quantity_initial,
	l."Direct Unit Cost" AS direct_unit_cost

FROM
	/* active purchase order */
	/* document type 0 = quote; 1 = order; 2 = manual invoice; 3 = credit note; 4 = blanket order; 5 = return po */
	"nav_test.Outfittery GmbH$Purchase Line Archive" l
WHERE l."version no_" = 1
),

revised AS
(
SELECT
/* document no_ = purchase_order_id */
	max_version."document type", max_version."document no_", max_version."doc_ no_ occurrence", max_version."version no_", l."line no_", l.quantity AS quantity_revised,
	l."Expected Receipt Date", l."Requested Receipt Date", l."Promised Receipt Date", l."Planned Receipt Date", l.Description, l."Outstanding Quantity"
FROM
	/* active purchase order */
	/* document type 0 = quote; 1 = order; 2 = manual invoice; 3 = credit note; 4 = blanket order; 5 = return po */
	(SELECT
		"document type", "document no_", "doc_ no_ occurrence", MAX("version no_") "version no_"
	FROM
		"nav_test.Outfittery GmbH$Purchase Line Archive" l
	GROUP BY 1,2,3
	) max_version
	JOIN
	"nav_test.Outfittery GmbH$Purchase Line Archive" l
		 ON max_version."document type" 		= l."document type"
		AND max_version."document no_" 			= l."document no_"
		AND	max_version."doc_ no_ occurrence" 	= l."doc_ no_ occurrence"
		AND max_version."version no_" 			= l."version no_"
),

received AS
(
SELECT
/* "order no_" = purchase_order_id */
	l."document no_",
	l."line no_",
	MIN(l."posting date") date_received_min,
	MAX(l."posting date") date_received_max,
	SUM(l.quantity) quantity_received
FROM
	"nav_test.Outfittery GmbH$Purch_ Rcpt_ Line" l
GROUP BY 1,2
),

invoiced AS
(
SELECT
/* "order no_" = purchase_order_id */
	l."document no_",
	l."line no_",
	/* l."unit cost (lcy)", */
	MIN(l."posting date") date_invoiced_min,
	MAX(l."posting date") date_invoiced_max,
	SUM(l.quantity) quantity_invoiced
FROM
	"nav_test.Outfittery GmbH$Purch_ Inv_ Line" l
GROUP BY 1,2
),

returned AS
(
SELECT
	/* h."return order no_", */
	l."document no_",
	l."line no_",
	MIN(l."posting date") date_returned_min,
	MAX(l."posting date") date_returned_max,
	SUM(l.quantity) quantity_returned
FROM
	"nav_test.Outfittery GmbH$return shipment Line" l
GROUP BY 1,2
),

credit AS
(
SELECT
	/* h."return order no_", */
	l."document no_",
	l."line no_",
	MIN(l."posting date") date_credit_min,
	MAX(l."posting date") date_credit_max,
	SUM(l.quantity) quantity_credit
FROM
	"nav_test.Outfittery GmbH$Purch_ cr_ memo Line" l
GROUP BY 1,2
)




/* MAIN BODY */

SELECT
	initial."document no_" AS order_no,
	initial."line no_" AS line_no,
	initial.item_no,
	initial."Variant Code" AS variant_code,
	initial."Order Date" AS order_date,	
	initial.direct_unit_cost,
	initial."Expected Receipt Date",
	initial."Requested Receipt Date", 
	initial."Promised Receipt Date", 
	initial."Planned Receipt Date",
	received.date_received_min,
	received.date_received_max,
	invoiced.date_invoiced_min,
	invoiced.date_invoiced_max,
	returned.date_returned_min,
	returned.date_returned_max,
	credit.date_credit_min,
	credit.date_credit_max,
	CAST(initial.quantity_initial AS SHORT) AS quantity_initial,
	CAST(revised.quantity_revised AS SHORT) AS quantity_revised,
	CAST(received.quantity_received AS SHORT) AS quantity_received,	
	CAST(invoiced.quantity_invoiced AS SHORT) AS quantity_invoiced,
	CAST(returned.quantity_returned AS SHORT) AS quantity_returned,
	CAST(credit.quantity_credit AS SHORT) AS quantity_credit	
FROM
	initial
	LEFT JOIN
	revised
		 ON initial."document type" 		= revised."document type"
		AND initial."document no_"			= revised."document no_"
		AND initial."doc_ no_ occurrence" 	= revised."doc_ no_ occurrence"
		AND initial."line no_"				= revised."line no_"
	LEFT JOIN
	received
		 ON initial."document no_"			= received."document no_"
		AND initial."line no_"				= received."line no_"
	LEFT JOIN
	invoiced
		 ON initial."document no_"			= invoiced."document no_"
		AND initial."line no_"				= invoiced."line no_"
	LEFT JOIN
	returned
		 ON initial."document no_"			= returned."document no_"
		AND initial."line no_"				= returned."line no_"
	LEFT JOIN
	credit
		 ON initial."document no_"			= credit."document no_"
		AND initial."line no_"				= credit."line no_"
		
		
		
/*
SELECT
	"document type" , "no_"
FROM
	active purchase order
	"nav_test.Outfittery GmbH$Purchase Header" h

just link the two above to the archive header

*/


