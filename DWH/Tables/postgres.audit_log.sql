-- Table: audit_log

-- DROP TABLE audit_log;

CREATE TABLE audit_log
(
  id bigint NOT NULL,
  actor character varying(255),
  class_name character varying(255),
  date_created timestamp with time zone NOT NULL,
  event_name character varying(255),
  last_updated timestamp with time zone NOT NULL,
  new_value character varying(255),
  old_value character varying(255),
  persisted_object_id character varying(255),
  persisted_object_version bigint,
  property_name character varying(255),
  uri character varying(255),
  CONSTRAINT audit_log_pk PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE audit_log
  OWNER TO "HAH3svmoVs8ZLqU2aHCVfmIDsmgo2e2s";
GRANT ALL ON TABLE audit_log TO "HAH3svmoVs8ZLqU2aHCVfmIDsmgo2e2s";
GRANT SELECT ON TABLE audit_log TO datavirtuality;
GRANT SELECT ON TABLE audit_log TO "ps-app-coruscant";
GRANT SELECT ON TABLE audit_log TO "ps-app-curuscant2";
GRANT SELECT ON TABLE audit_log TO monitoring;
GRANT SELECT ON TABLE audit_log TO staging_db_syncer;

-- Index: persisted_object_id_idx

-- DROP INDEX persisted_object_id_idx;

CREATE INDEX persisted_object_id_idx
  ON audit_log
  USING btree
  (persisted_object_id COLLATE pg_catalog."default");

