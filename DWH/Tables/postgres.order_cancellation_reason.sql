-- Table: order_cancellation_reason

-- DROP TABLE order_cancellation_reason;

CREATE TABLE order_cancellation_reason
(
  id bigint NOT NULL,
  version bigint NOT NULL,
  reason character varying(255) NOT NULL,
  reference_key character varying(255) NOT NULL,
  CONSTRAINT order_cancellation_reason_pkey PRIMARY KEY (id),
  CONSTRAINT uk_2mk1onrikdkrrrcvf0aivu0ti UNIQUE (reference_key)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE order_cancellation_reason
  OWNER TO "HAH3svmoVs8ZLqU2aHCVfmIDsmgo2e2s";
GRANT ALL ON TABLE order_cancellation_reason TO "HAH3svmoVs8ZLqU2aHCVfmIDsmgo2e2s";
GRANT SELECT ON TABLE order_cancellation_reason TO datavirtuality;
