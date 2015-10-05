-- Table: preview

-- DROP TABLE preview;

CREATE TABLE preview
(
  id bigint NOT NULL,
  customer_id bigint,
  date_created timestamp with time zone NOT NULL,
  last_updated timestamp with time zone NOT NULL,
  note text,
  order_id bigint,
  state integer,
  class character varying(255) NOT NULL DEFAULT 'com.ps.customer.preview.Preview'::character varying,
  created_by_id bigint,
  preview_id bigint,
  name character varying(255),
  comment text,
  CONSTRAINT pk_preview PRIMARY KEY (id),
  CONSTRAINT fked08e3c84a2d9d02 FOREIGN KEY (preview_id)
      REFERENCES preview (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT fked08e3c88d9f622f FOREIGN KEY (created_by_id)
      REFERENCES principal (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT preview_order_id_fk FOREIGN KEY (order_id)
      REFERENCES customer_order (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
)
WITH (
  OIDS=FALSE
);
ALTER TABLE preview
  OWNER TO "HAH3svmoVs8ZLqU2aHCVfmIDsmgo2e2s";
GRANT ALL ON TABLE preview TO "HAH3svmoVs8ZLqU2aHCVfmIDsmgo2e2s";
GRANT SELECT ON TABLE preview TO datavirtuality;
GRANT SELECT ON TABLE preview TO "ps-app-coruscant";
GRANT SELECT ON TABLE preview TO "ps-app-curuscant2";
GRANT SELECT ON TABLE preview TO monitoring;
GRANT SELECT ON TABLE preview TO staging_db_syncer;

-- Index: preview_created_by_id

-- DROP INDEX preview_created_by_id;

CREATE INDEX preview_created_by_id
  ON preview
  USING btree
  (created_by_id);

-- Index: preview_customer_id

-- DROP INDEX preview_customer_id;

CREATE INDEX preview_customer_id
  ON preview
  USING btree
  (customer_id);

-- Index: preview_order_id

-- DROP INDEX preview_order_id;

CREATE INDEX preview_order_id
  ON preview
  USING btree
  (order_id);

-- Index: preview_preview_id

-- DROP INDEX preview_preview_id;

CREATE INDEX preview_preview_id
  ON preview
  USING btree
  (preview_id);

