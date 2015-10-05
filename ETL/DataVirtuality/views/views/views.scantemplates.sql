-- Name: views.scantemplates
-- Created: 2015-04-24 18:17:13
-- Updated: 2015-04-24 18:17:13

CREATE view views.scantemplates 
AS
SELECT
	scan.po,
	scan.ean,
	scan.ean_unknown,
	scan.article_overdelivered,
	scan.photo_article,
	scan.hanging,
	scan.added_value,
	parseTimestamp(scan.date_delivered, 'yyyy-MM-dd HH:mm:ss.S' ) AS date_delivered,
	scan.delivery_note,
	parseTimestamp(scan.date_given_to_serviceprovi, 'yyyy-MM-dd HH:mm:ss.S' ) AS date_given_to_serviceprovi,
	parseTimestamp(scan.date_scanned, 'yyyy-MM-dd HH:mm:ss.S' ) AS date_scanned,
	parseTimestamp(date_uploaded, 'yyyy-MM-dd HH:mm:ss.S' ) as date_uploaded
FROM "dwh.scantemplatestool" scan


