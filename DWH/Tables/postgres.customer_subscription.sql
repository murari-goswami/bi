-- Table: customer_subscription

-- DROP TABLE customer_subscription;

CREATE TABLE customer_subscription
(
  id bigint NOT NULL,
  customer_id bigint NOT NULL,
  date_activated timestamp without time zone,
  date_cancelled timestamp without time zone,
  date_created timestamp without time zone NOT NULL,
  end_date timestamp without time zone,
  "interval" character varying(255) NOT NULL,
  name character varying(255) NOT NULL,
  notes text,
  offer character varying(255),
  start_date timestamp without time zone,
  status character varying(255) NOT NULL,
  type character varying(255) NOT NULL,
  CONSTRAINT customer_subscription_pkey PRIMARY KEY (id),
  CONSTRAINT unique_customer_id UNIQUE (type, customer_id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE customer_subscription
  OWNER TO "HAH3svmoVs8ZLqU2aHCVfmIDsmgo2e2s";
GRANT ALL ON TABLE customer_subscription TO "HAH3svmoVs8ZLqU2aHCVfmIDsmgo2e2s";
GRANT SELECT ON TABLE customer_subscription TO datavirtuality;
