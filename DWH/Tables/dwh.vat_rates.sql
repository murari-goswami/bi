-- Table: dwh.vat_rates

-- DROP TABLE dwh.vat_rates;

CREATE TABLE dwh.vat_rates
(
  country_code_iso character(2) NOT NULL,
  year_month character(7) NOT NULL,
  vat_rate numeric,
  CONSTRAINT vat_rates_pkey PRIMARY KEY (country_code_iso, year_month)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE dwh.vat_rates
  OWNER TO postgres;
