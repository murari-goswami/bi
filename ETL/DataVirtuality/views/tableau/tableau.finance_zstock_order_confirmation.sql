-- Name: tableau.finance_zstock_order_confirmation
-- Created: 2015-04-24 18:17:47
-- Updated: 2015-04-24 18:17:47

CREATE VIEW tableau.finance_zstock_order_confirmation
AS
SELECT 
	cast(supplierorderid as long) best_supplierorderid,
	cast(kundennummer as long) kundennummer,
	parseTimestamp( received_date, 'yyyy-MM-dd HH:mm:ss.S' ) as received_date_confirmed,
	count(article_nr) as nb_of_articles_confirmed,
	min(cast(replace(zwischensumme_de, ',', '.') as double)) as zwischensumme_de,
	min(cast(replace(rabatt_de, ',', '.') as double)) as rabatt_de,
	min(cast(zwischensumme_chf as double)) as zwischensumme_chf,
	min(cast(rabatt_chf as double)) as rabatt_chf,
	min(cast(replace(gesamtsumme_de, ',', '.') as double)) as gesamtsumme_de,
	min(cast(gesamtsumme_chf as double)) as gesamtsumme_chf
from dwh.customerorderbox group by 1,2,3


