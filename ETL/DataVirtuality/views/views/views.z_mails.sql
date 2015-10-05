-- Name: views.z_mails
-- Created: 2015-04-24 18:17:41
-- Updated: 2015-04-24 18:17:41

CREATE view views.z_mails 
AS 
SELECT
	best.best_supplierorderid,
	best.kundennummer,
	best.received_date_confirmed,
	best.nb_of_articles_confirmed,
	best.zwischensumme_de,
	best.zwischensumme_chf,
	best.rabatt_de,
	best.rabatt_chf,
	best.gesamtsumme_de,
	best.gesamtsumme_chf,
	gut.gutschrift,
	gut.nb_of_articles_returned,
	gu.retoure_received_date_time,
	dhl.dhlnumber,
	dhl.shipped_recieveddate,
	dhl.subject,
	CASE 
		when dhl.subject LIKE '%Versandbestätigung%' THEN 'yes'
		ELSE 'no'
	END AS "shipping_confirmation"
FROM 
/*Customer Order Box*/
(
	SELECT 
		CAST(kundennummer AS long) kundennummer,
		CAST(supplierorderid AS long) best_supplierorderid,
		parseTimestamp( received_date, 'yyyy-MM-dd HH:mm:ss.S' ) AS received_date_confirmed,
		COUNT(article_nr) AS nb_of_articles_confirmed,
		MIN(CAST(replace(zwischensumme_de, ',', '.') AS double)) AS zwischensumme_de,
		MIN(CAST(replace(rabatt_de, ',', '.') AS double)) AS rabatt_de,
		MIN(CAST(zwischensumme_chf AS double)) AS zwischensumme_chf,
		MIN(CAST(rabatt_chf AS double)) AS rabatt_chf,
		MIN(CAST(replace(gesamtsumme_de, ',', '.') AS double)) AS gesamtsumme_de,
		MIN(CAST(gesamtsumme_chf AS double)) AS gesamtsumme_chf
	FROM dwh.customerorderbox 
	GROUP BY 1,2,3
) best
/*All Retoure Mails*/
LEFT JOIN
(
	SELECT 
		supplierorderid,
		parseTimestamp(received_date_time, 'yyyy-MM-dd HH:mm:ss.S') AS retoure_received_date_time,
		MIN(CAST(gutschrift AS double)) AS gutschrift_de,
		MIN(CAST(gutschrift_chf AS double)) AS gutschrift_chf 
	FROM dwh.retouremails 
	GROUP BY 1,2
) gu ON gu.supplierorderid=best.best_supplierorderid
/*DHL Package Status*/
LEFT JOIN
(
	SELECT 
		distinct orderid,
		parseTimestamp( recieveddate, 'yyyy-MM-dd HH:mm:ss.S' ) AS shipped_recieveddate,
		dhlnumber,
		subject 
	FROM dwh.dhl_package_status
) dhl ON dhl.orderid=best.best_supplierorderid
/*All Retour Mails*/
LEFT JOIN
(
	SELECT
	supplierorderid,
	sum(gutschrift) gutschrift,
	sum(nb_of_articles_returned) nb_of_articles_returned 
	FROM
	(
		SELECT
			received_date_time,
			supplierorderid,
			max(CASE when CAST(gutschrift AS double) IS NULL then CAST(gutschrift_chf AS double) 
			else CAST(gutschrift AS double)end) gutschrift,
			COUNT(distinct CASE when artikel_description='Artikel' then artikel_grosse else artikel_description end) nb_of_articles_returned 
		FROM "dwh"."retouremails"
		GROUP BY 1,2
	)gutschrift GROUP BY 1
) gut ON gut.supplierorderid=best.best_supplierorderid


