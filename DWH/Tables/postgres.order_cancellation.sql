-- Table: order_cancellation

-- DROP TABLE order_cancellation;

CREATE TABLE order_cancellation
(
  id bigint NOT NULL,
  version bigint NOT NULL,
  date_created timestamp without time zone NOT NULL,
  order_id bigint NOT NULL,
  order_cancellation_reason_id bigint NOT NULL,
  CONSTRAINT order_cancellation_pkey PRIMARY KEY (id),
  CONSTRAINT fk_1yvlvd9xjf6q5xtp1vgrlw7gc FOREIGN KEY (order_cancellation_reason_id)
      REFERENCES order_cancellation_reason (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT fk_s2fhysqaoeok7bdhjtqe61ed9 FOREIGN KEY (order_id)
      REFERENCES customer_order (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
)
WITH (
  OIDS=FALSE
);
ALTER TABLE order_cancellation
  OWNER TO "HAH3svmoVs8ZLqU2aHCVfmIDsmgo2e2s";
GRANT ALL ON TABLE order_cancellation TO "HAH3svmoVs8ZLqU2aHCVfmIDsmgo2e2s";
GRANT SELECT ON TABLE order_cancellation TO datavirtuality;
