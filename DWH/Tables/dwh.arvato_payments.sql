-- Table: dwh.arvato_payments

-- DROP TABLE dwh.arvato_payments;

CREATE TABLE dwh.arvato_payments
(
  mandantid character varying(4000),
  debitornumber character varying(4000),
  journalentrytype character varying(4000),
  ordernumber character varying(4000),
  journalentrynumber character varying(4000),
  journalentrydate character varying(4000),
  amount numeric(38,20),
  currency character varying(4000),
  dunninglevel character varying(4000),
  returndebitnote character varying(4000),
  creditcardchargeback character varying(4000),
  indebtcollection character varying(4000),
  id character varying(4000),
  date_created timestamp without time zone
)
WITH (
  OIDS=FALSE
);
ALTER TABLE dwh.arvato_payments
  OWNER TO postgres;
