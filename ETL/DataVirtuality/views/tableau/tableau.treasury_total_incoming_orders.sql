-- Name: tableau.treasury_total_incoming_orders
-- Created: 2015-04-24 18:23:22
-- Updated: 2015-04-24 18:23:22

CREATE view tableau.treasury_total_incoming_orders
AS
SELECT 
  cast(co.date_created as date) as "datecreated",
  'Week'||' '||f."week" AS week_of_date_created,
  co.shipping_country as "addr_country",
  count(distinct(co.id)) as "aggorders",
  count(distinct(case when  sfo.OpsCheck__c not like 'OK' then co.id else null end)) as "ops-check-Not OK",
  count(distinct(case when sfo.StageName like '%Inaktiv%' then co.id else null end)) as "stage-inaktiv",
  count(distinct(case when sfo.StageName like '%Datum vorschlagen%' then co.id else null end)) as "stage-Datum vorschlagen",
  count(distinct(case when sfo.StageName like '%on hold%' then co.id else null end)) as "stage-on hold",
  count(distinct(case when sfo.StageName like '%Termin ausmachen%' then co.id else null end)) as "stage-Termin ausmachen",
  count(distinct(case when sfo.OpsCheck__c='OK' and sfo.StageName like '%Vorschau erstellen%' then co.id else null end))*0.50 as "stage-Vorschau erstellen",
  count(distinct(case when sfo.OpsCheck__c='OK' and co.sales_channel<>'websiteWithDate' and StageName like 'Informationen vervoll%' then co.id else null end)) as "Informationen vervollständigen-No Phonedate",
  count(distinct(case when sfo.OpsCheck__c='OK' and StageName like 'Informationen vervoll%' and co.sales_channel='websiteWithDate' then co.id else null end)) as "Informationen vervollständigen-before PhoneDate",
  count(distinct(case when sfo.OpsCheck__c='OK' and cast(co.phone_date as date)>=curdate() and StageName like 'Informationen vervoll%' and co.sales_channel='websiteWithDate' then co.id else null end))*0.35 as "Informationen vervollständigen-PhoneDate",
  count(distinct(case when sfo.OpsCheck__c='OK' and cast(co.phone_date as date)<curdate() and StageName like 'Informationen vervoll%' and co.sales_channel='websiteWithDate' then co.id else null end)) as "Informationen vervollständigen-PhoneDate(<)",
  count(distinct(case when sfo.OpsCheck__c<>'OK' and (sfo.StageName in ('abgeschloßen & Nachbereitung','Artikel bestellen','Feedback zur Bestellung einholen','Packen') or sfo.StageName like '%Vorschau erstellen%' or StageName like 'Informationen vervoll%')  then co.id else null end)) as "7_totalincomingstage_not_ok"
FROM views.customer_order co
INNER JOIN views.salesforce_opportunity sfo on sfo.ExternalOrderId__c = co.id
LEFT JOIN views.futuredate f on f.date_created=cast(co.date_created as date)
WHERE co.state>= '8' 
AND co.state<'2048'
GROUP BY 1,2,3


