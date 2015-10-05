-- Table: voucher

-- DROP TABLE voucher;

CREATE TABLE voucher
(
  id bigint NOT NULL,
  version bigint NOT NULL,
  date_created timestamp with time zone NOT NULL,
  last_updated timestamp with time zone NOT NULL,
  customer_id bigint NOT NULL,
  order_id bigint,
  file_url character varying(255),
  voucher_type character varying(55) NOT NULL,
  amount numeric(19,2) NOT NULL DEFAULT 0,
  reference_number bigint,
  parent_voucher_id bigint,
  CONSTRAINT "voPK" PRIMARY KEY (id),
  CONSTRAINT fk26288eae48503854 FOREIGN KEY (parent_voucher_id)
      REFERENCES voucher (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT fk65fb259c6a8d89d FOREIGN KEY (customer_id)
      REFERENCES principal (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT fk65fb269c6a8d89d FOREIGN KEY (order_id)
      REFERENCES customer_order (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT uc_referencenumber UNIQUE (reference_number)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE voucher
  OWNER TO "HAH3svmoVs8ZLqU2aHCVfmIDsmgo2e2s";
GRANT ALL ON TABLE voucher TO "HAH3svmoVs8ZLqU2aHCVfmIDsmgo2e2s";
GRANT SELECT ON TABLE voucher TO datavirtuality;
GRANT SELECT ON TABLE voucher TO "ps-app-coruscant";
GRANT SELECT ON TABLE voucher TO "ps-app-curuscant2";
GRANT SELECT ON TABLE voucher TO monitoring;
GRANT SELECT ON TABLE voucher TO staging_db_syncer;

-- Index: voucher_customer_id

-- DROP INDEX voucher_customer_id;

CREATE INDEX voucher_customer_id
  ON voucher
  USING btree
  (customer_id);

-- Index: voucher_order_id

-- DROP INDEX voucher_order_id;

CREATE INDEX voucher_order_id
  ON voucher
  USING btree
  (order_id);

