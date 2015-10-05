-- Table: dwh.historical_exchange_rates

-- DROP TABLE dwh.historical_exchange_rates;

CREATE TABLE dwh.historical_exchange_rates
(
  date date NOT NULL,
  currency_code character(3) NOT NULL,
  exchange_rate numeric,
  CONSTRAINT historical_exchange_rates_pkey PRIMARY KEY (date, currency_code)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE dwh.historical_exchange_rates
  OWNER TO postgres;
