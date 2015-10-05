-- Table: order_position

-- DROP TABLE order_position;

CREATE TABLE order_position
(
  id bigint NOT NULL,
  state integer NOT NULL DEFAULT 8,
  version bigint NOT NULL DEFAULT 0,
  article_id bigint NOT NULL,
  date_created timestamp with time zone NOT NULL,
  last_updated timestamp with time zone NOT NULL,
  order_id bigint NOT NULL,
  quantity integer NOT NULL,
  supplier_article_id bigint,
  purchase_price real NOT NULL DEFAULT 0,
  retail_price real NOT NULL DEFAULT 0,
  date_returned timestamp with time zone,
  date_shipped timestamp with time zone,
  supplier_order_number character varying(255),
  date_incoming timestamp with time zone,
  date_returned_online timestamp with time zone,
  group_id character varying(255) NOT NULL DEFAULT '0'::character varying,
  order_positions_idx integer,
  track_and_trace_number character varying(255),
  stock_location_id bigint,
  date_picked timestamp with time zone,
  date_canceled timestamp with time zone,
  date_lost timestamp with time zone,
  CONSTRAINT "order_positioPK" PRIMARY KEY (id),
  CONSTRAINT fkdfce9afa4bab2bc8 FOREIGN KEY (order_id)
      REFERENCES customer_order (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT fkdfce9afa4f5a40d1 FOREIGN KEY (stock_location_id)
      REFERENCES stock_location (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT fkdfce9afa83ab6964 FOREIGN KEY (supplier_article_id)
      REFERENCES supplier_article (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT fkdfce9afac5a8d77d FOREIGN KEY (article_id)
      REFERENCES article (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
)
WITH (
  OIDS=FALSE
);
ALTER TABLE order_position
  OWNER TO "HAH3svmoVs8ZLqU2aHCVfmIDsmgo2e2s";
GRANT ALL ON TABLE order_position TO "HAH3svmoVs8ZLqU2aHCVfmIDsmgo2e2s";
GRANT SELECT ON TABLE order_position TO datavirtuality;
GRANT SELECT ON TABLE order_position TO "ps-app-coruscant";
GRANT SELECT ON TABLE order_position TO "ps-app-curuscant2";
GRANT SELECT ON TABLE order_position TO monitoring;
GRANT SELECT ON TABLE order_position TO staging_db_syncer;

-- Index: order_position_article_id

-- DROP INDEX order_position_article_id;

CREATE INDEX order_position_article_id
  ON order_position
  USING btree
  (article_id);

-- Index: order_position_oid_idx

-- DROP INDEX order_position_oid_idx;

CREATE INDEX order_position_oid_idx
  ON order_position
  USING btree
  (order_id);

-- Index: order_position_supplier_article_id

-- DROP INDEX order_position_supplier_article_id;

CREATE INDEX order_position_supplier_article_id
  ON order_position
  USING btree
  (supplier_article_id);

