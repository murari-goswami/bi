-- Name: tableau.finance_zstock_returnmail_check
-- Created: 2015-04-24 18:17:48
-- Updated: 2015-04-24 18:17:48

CREATE VIEW tableau.finance_zstock_returnmail_check
AS
SELECT
	supplierorderid,
	retoure_received_date_time,
	sum(gutschrift) gutschrift,
	sum(nb_of_articles_returned) nb_of_articles_returned
FROM 
(
	SELECT
		parseTimestamp(received_date_time, 'yyyy-MM-dd HH:mm:ss.S') as retoure_received_date_time,
		supplierorderid,
		max
		(
			case when cast(gutschrift as double) is null then cast(gutschrift_chf as double)
			else cast(gutschrift as double)
			end
		)gutschrift,
		count
		(
			distinct case when artikel_description='Artikel' then artikel_grosse 
			else artikel_description 
			end
		)nb_of_articles_returned 
	FROM "dwh"."retouremails"
	GROUP BY 1,2
)gutschrift 
GROUP BY 1,2


