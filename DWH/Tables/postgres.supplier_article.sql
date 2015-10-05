-- Table: supplier_article

-- DROP TABLE supplier_article;

CREATE TABLE supplier_article
(
  id bigint NOT NULL,
  version bigint NOT NULL,
  article_id bigint,
  date_created timestamp with time zone NOT NULL,
  last_updated timestamp with time zone NOT NULL,
  retail_price numeric(19,2) NOT NULL,
  sku character varying(255) NOT NULL,
  supplier_id bigint NOT NULL,
  purchase_price numeric(19,2) NOT NULL DEFAULT 0,
  quantity integer,
  data hstore DEFAULT ''::hstore,
  active boolean DEFAULT true,
  ean character varying(13),
  image_url character varying(256),
  partner_shop_url character varying(256),
  manufacturer_sku character varying(255),
  CONSTRAINT "supplier_artiPK" PRIMARY KEY (id),
  CONSTRAINT fka943e1838796ad17 FOREIGN KEY (supplier_id)
      REFERENCES supplier (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT fka943e183c5a8d77d FOREIGN KEY (article_id)
      REFERENCES article (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
)
WITH (
  OIDS=FALSE
);
ALTER TABLE supplier_article
  OWNER TO "HAH3svmoVs8ZLqU2aHCVfmIDsmgo2e2s";
GRANT ALL ON TABLE supplier_article TO "HAH3svmoVs8ZLqU2aHCVfmIDsmgo2e2s";
GRANT SELECT ON TABLE supplier_article TO datavirtuality;
GRANT SELECT ON TABLE supplier_article TO "ps-app-coruscant";
GRANT SELECT ON TABLE supplier_article TO "ps-app-curuscant2";
GRANT SELECT ON TABLE supplier_article TO monitoring;
GRANT SELECT ON TABLE supplier_article TO staging_db_syncer;

-- Index: supplier_article_article_id_idx

-- DROP INDEX supplier_article_article_id_idx;

CREATE INDEX supplier_article_article_id_idx
  ON supplier_article
  USING btree
  (article_id);
ALTER TABLE supplier_article CLUSTER ON supplier_article_article_id_idx;

-- Index: supplier_article_ean_idx

-- DROP INDEX supplier_article_ean_idx;

CREATE INDEX supplier_article_ean_idx
  ON supplier_article
  USING btree
  (ean COLLATE pg_catalog."default");

-- Index: supplier_article_sku_idx

-- DROP INDEX supplier_article_sku_idx;

CREATE INDEX supplier_article_sku_idx
  ON supplier_article
  USING btree
  (sku COLLATE pg_catalog."default");

-- Index: supplier_article_supplier_id_idx

-- DROP INDEX supplier_article_supplier_id_idx;

CREATE INDEX supplier_article_supplier_id_idx
  ON supplier_article
  USING btree
  (supplier_id);

