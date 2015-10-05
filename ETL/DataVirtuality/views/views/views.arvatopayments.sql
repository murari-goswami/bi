-- Name: views.arvatopayments
-- Created: 2015-04-24 18:17:24
-- Updated: 2015-04-24 18:17:24

CREATE view views.arvatopayments
AS
SELECT 
	mandantid,
	debitornumber,
	journalentrytype,
	ordernumber,
	journalentrynumber,
	journalentrydate,
	cast(amount as bigdecimal) as amount,
	currency,
	dunninglevel,
	returndebitnote,
	creditcardchargeback,
	indebtcollection,
	id,
	date_created 
FROM "dwh"."arvato_payments"


